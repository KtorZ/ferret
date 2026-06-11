import store from '../store';
import { get, readonly } from 'svelte/store';
import { TX_REALM, TX_STATUS, selectActiveChannel } from '../helpers';
import { ConsumerState, Invoice, Konduit, Quote, Tag } from '../kernel';

// -------------------------------------------------------------------------------------------------
// Svelte Store
// -------------------------------------------------------------------------------------------------

const STEP = {
  NONE: 0,
  OPENING: 1,
  OPENED: 2,
  CLOSING: 3,
  CLOSED: 4,
  RESPONDED: 5,
  ENDING: 6,
}

const HUMAN_READABLE_STEP = {
  [STEP.NONE]: null,
  [STEP.OPENING]: 'Opening',
  [STEP.OPENED]: 'Opened',
  [STEP.CLOSING]: 'Closing',
  [STEP.CLOSED]: 'Closed',
  [STEP.RESPONDED]: 'Responded',
  [STEP.ENDING]: 'Ending',
};

function createDefaultState() {
  return {
    _state: new ConsumerState(),
    step: STEP.NONE,
    tag: null,
    totalAmount: 0n,
    owedAmount: 0n,
    transactions: [],
  };
}

const state = store.writable(
  'ferret.channel.v1',
  createDefaultState(),
);

// -------------------------------------------------------------------------------------------------
// Interface with the application
// -------------------------------------------------------------------------------------------------

/**
 * @param {Konduit} konduit An instance of Konduit runtime
 */
function init(konduit) {
  const { tag, _state } = get(state);
  if (tag != null) {
    konduit.setChannelTag(tag);
  }

  // Migrate old states before '_state' was introduced
  if (!(_state instanceof ConsumerState)) {
    state.update((st) => ({
      ...st,
      _state: new ConsumerState(),
      // Transactions didn't have any 'index' value before, so we simply drop them all.
      // This isn't unsafe, as the channel amount is still tracked through squashes. We simply
      // loose visibility on those transactions.
      transactions: [],
    }))
  }
}

/**
 * @param {Konduit} konduit An instance of Konduit runtime
 */
async function refresh(konduit) {
  try {
    const channel = selectActiveChannel(await konduit.channels());
    const st = get(state);
    const step = resolveStep(channel, st.step);
    if (channel != null) {
      konduit.setChannelTag(channel.tag);
      const syncStatus = await konduit.syncChannel(st._state);
      state.update((st) => ({
        ...st,
        ...syncStatusUpdate(syncStatus, st._state, st.transactions),
        step,
        tag: channel.tag,
        totalAmount: channel.totalAmount,
      }));
    } else if (step !== STEP.OPENING) {
      state.set({ ...createDefaultState(), step });
    }
  } catch (err) {
    console.error(`failed to load channels from Adaptor: ${err.message ?? err}`);
  }
}

/**
 * @param {Konduit} konduit An instance of Konduit runtime
 * @param {any} tag A 64-digit hex-encoded string that, alongside the verification key, uniquely identifies the channel.
 * @param {bigint} amount An amount of lovelace to commit in the channel initially.
 */
async function open(konduit, tag, amount) {
  tag = tag instanceof Tag ? tag : Tag.tryParse(tag);
  void await konduit.openChannel(tag, amount);
  konduit.setChannelTag(tag);
  state.patch({
    step: STEP.OPENING,
    tag,
    totalAmount: amount,
    owedAmount: 0n,
  });
}

/**
 * @param {Konduit} konduit An instance of Konduit runtime
 * @param {string|Invoice} invoice A Bolt11 Lightning invoice
 * @param {Quote} quote A quote from the adaptor for that invoice
 *
 * TODO: prevent if channel's status isn't 'OPENED'.
 */
async function pay(konduit, invoice, quote) {
  invoice = typeof invoice === 'string' ? Invoice.tryParse(invoice) : invoice;

  const { _state } = get(state);

  const paymentRequest = _state.record(invoice, quote);
  state.update((st) => ({
    ...st,
    transactions: repsertPendingPayment(st.transactions, invoice, quote),
  }));

  const syncStatus = await konduit.pay(paymentRequest, _state);

  state.update((st) => ({
    ...st,
    ...syncStatusUpdate(syncStatus, st._state, st.transactions),
  }));
}

/**
 * @param {Konduit} konduit An instance of Konduit runtime
 */
async function close(konduit) {
  void await konduit.closeChannel();
  konduit.resetChannelTag();
  state.patch({ step: STEP.CLOSING });
}


/**
 * @param {Konduit} konduit An instance of Konduit runtime
 * @param {bigint} amount
 */
async function add(konduit, amount) {
  // TODO: prevent if channel's status isn't 'OPENED'.
  void await konduit.addToChannel(amount);
}

function reset() {
  state.set(createDefaultState());
}

// -------------------------------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------------------------------

/**
 * Remap the channel's step to its *effective* state based on the app's internal knowledge.
 */
function resolveStep(channel, step) {
  if (channel == null) {
    return step === STEP.OPENING ? STEP.OPENING : STEP.NONE;
  }

  if (channel.isOpened) {
    return step === STEP.CLOSING ? STEP.CLOSING : STEP.OPENED;
  }

  if (channel.isClosed) {
    return STEP.CLOSED;
  }

  if (channel.isResponded) {
    return step === STEP.ENDING ? STEP.ENDING : STEP.RESPONDED;
  }
}

function repsertPendingPayment(transactions, invoice, quote) {
  const pending = createPendingPayment(invoice, quote);

  // Check whether a transaction already existed for that quote. This can occur
  // should the user retry a payment.
  const transaction = transactions.find((tx) => tx.index === quote.index );
  if (transaction == null) {
    return transactions.concat([pending]);
  }

  // TODO: quote retrying resolution
  // If a quote was previously submitted with that same index, then we can't really
  // know which one will the adaptor decide to squash. In theory, they should pick
  // the one giving them the most revenue (i.e, highest fee).
  //
  // So right now, we'll just consider the maximum amount, and maximum timestamp. In
  // a next iteration, we shall consider remembering all amounts, with their associated
  // locks. Upon final resolution (i.e. after squash), we should update the effective
  // amount to what was squash (which may be a lower amount than originally reported)
  transaction.status = pending.status;
  transaction.timestamp = pending.timestamp;
  if (pending.fee > transaction.fee) {
    transaction.fee = pending.fee;
  }

  return transactions;
}

function reconcileTransactions(transactions, squashed, locked) {
  // Settle or expire transactions
  transactions.forEach((tx) => {
    if (tx.status !== TX_STATUS.PENDING) {
      return;
    }

    if (squashed.includes(tx.index)) {
      tx.status = TX_STATUS.SETTLED;
    } else if (!locked.includes(tx.index)) {
      tx.status = TX_STATUS.FAILED;
    }
  });

  return transactions;
}

function syncStatusUpdate(syncStatus, _state, transactions) {
  _state.sync(syncStatus);
  return {
    owedAmount: BigInt(syncStatus.owed),
    transactions: reconcileTransactions(transactions, syncStatus.squashed, syncStatus.locked),
  };
}

function createPendingPayment(invoice, quote) {
  return {
    id: invoice.toString(),
    index: quote.index,
    realm: TX_REALM.L2,
    amount: quote.amount,
    fee: quote.routingFee,
    status: TX_STATUS.PENDING,
    timestamp: Date.now(),
  };
}


// -------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------

export default {
  HUMAN_READABLE_STEP,
  STEP,
  state: readonly(state),
  init,
  refresh,
  open,
  pay,
  add,
  close,
  reset,
};
