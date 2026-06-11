import { Credential, NetworkId, ShelleyAddress, TransactionSummary } from '../kernel.js';
import config from '../config';

/**
 * Minimum confirmation depth for a transaction to be considered confirmed.
 *
 * @type {number}
 */
export const MIN_DEPTH_FOR_CONFIRMED = 5;

/**
 * Conservative minimum UTxO value kept in Konduit channel accounting.
 *
 * @type {bigint}
 */
export const KONDUIT_MIN_UTXO = 2000000n;

/**
 * @type {Credential}
 */
export const KONDUIT_PAYMENT_CREDENTIAL = ShelleyAddress.tryParse(config.konduitValidatorAddress).paymentCredential;

/**
 * @typedef {'l1' | 'l2'} TxRealm
 */

/**
 * @type {{ L1: TxRealm, L2: TxRealm}}
 */
export const TX_REALM = {
  L1: 'l1',
  L2: 'l2'
}

/**
 * Supported transaction status values used by UI rendering.
 *
 * @type {{ PENDING: 'pending', FAILED: 'failed', CONFIRMED: 'confirmed', SETTLED: 'settled' }}
 */
export const TX_STATUS = {
  PENDING: 'pending',
  FAILED: 'failed',
  CONFIRMED: 'confirmed',
  SETTLED: 'settled',
};

/**
 * Human-readable labels for transaction statuses.
 *
 * @type {Record<string, string>}
 */
export const txStatusLabel = {
  [TX_STATUS.PENDING]: 'Pending',
  [TX_STATUS.FAILED]: 'Failed',
  [TX_STATUS.CONFIRMED]: 'Confirmed',
  [TX_STATUS.SETTLED]: 'Settled',
}

/**
 * Check whether a transaction object is an L2 synthetic payment row.
 *
 * @param {any} tx
 * @returns {boolean}
 */
function isL2PaymentTx(tx) {
  return tx?.realm === TX_REALM.L2;
}

/**
 * @param {TransactionSummary} tx
 * @return {BigInt}
 */
function sumInputLovelace(tx) {
  return tx.inputs.reduce((total, input) => total + (input?.output?.lovelace ?? 0n), 0n);
}

/**
 * @param {TransactionSummary} tx
 * @return {BigInt}
 */
function sumOutputLovelace(tx) {
  return tx.outputs.reduce((total, output) => total + (output?.lovelace ?? 0n), 0n);
}

/**
 * @param {Array<{address: ShelleyAddress, lovelace: BigInt}>} outputs
 * @param {(credential: Credential) => boolean} predicate
 * @returns {BigInt}
 */
function sumIf(outputs, predicate) {
  return outputs.reduce((total, output) => {
    const credential = output.address.paymentCredential;
    if (predicate(credential)) {
      return total + (output?.lovelace ?? 0n);
    }
    return total;
  }, 0n);
}

/**
 * Compute display amount and a transaction description from a summary.
 *
 * @param {TransactionSummary|any} tx
 * @param {{ walletAddress: ShelleyAddress }} context
 * @return {{ amount: BigInt, description: string, fee: BigInt, self?: boolean }}
 */
export function txDetails(tx, context) {
  if (isL2PaymentTx(tx)) {
    return { amount: tx.amount, fee: tx.fee, description: "L2 Payment", self: false };
  }

  const walletCredential = context.walletAddress.paymentCredential;

  const oursIn = sumIf(
    tx.inputs.map(({ output }) => output),
    credential => credential.equals(walletCredential),
  );

  // NOTE: This is a bit of shortcut, but we consider 'ours' any fund spent or received from
  // the validator from the moment where the transaction contained at least one of our input
  // because we assume that transaction was created correctly.

  const konduitIn = sumIf(
    tx.inputs.map(({ output }) => output),
    credential => oursIn > 0n && credential.equals(KONDUIT_PAYMENT_CREDENTIAL),
  );

  const oursOut = sumIf(
    tx.outputs,
    credential => credential.equals(walletCredential),
  );

  const konduitOut = sumIf(
    tx.outputs,
    credential => oursIn > 0n && credential.equals(KONDUIT_PAYMENT_CREDENTIAL),
  )

  const oIn = oursIn > 0;
  const oOut = oursOut > 0;
  const kIn = konduitIn > 0;
  const kOut = konduitOut > 0;

  let fee = sumInputLovelace(tx) - sumOutputLovelace(tx);


  let description = 'unknown';
  if (!oIn && oOut) {
    return { 
      amount: oursOut,
      fee,
      description: `top-up L1 wallet`,
      self: false 
    };
  }

  if (oIn && !kIn && kOut) {
    return { 
      amount: konduitOut - KONDUIT_MIN_UTXO,
      fee: fee + KONDUIT_MIN_UTXO,
      description: `open L2 channel`,
      self: true 
    };
  }

  if (oIn && kIn && kOut) {
    if (konduitOut > konduitIn) {
      return { 
        amount: konduitOut - konduitIn,
        fee,
        description: `add to L2 channel`,
        self: true 
      };
    } else {
      return {
        amount: konduitIn,
        fee,
        description: `close L2 channel`,
        self: true 
      };
    }
  }

  return { 
    amount: oursOut + konduitOut - oursIn - konduitIn,
    fee,
    description,
    self: false 
  };
}

/**
 * Resolve transaction status from depth and network rollback constraints.
 *
 * @param {TransactionSummary|any} tx
 * @return {'pending'|'failed'|'confirmed'|'settled'}
 */
export function txStatus(tx) {
  if (isL2PaymentTx(tx)) {
    return tx?.status ?? TX_STATUS.SETTLED;
  }
  const depth = tx.depth;
  if (depth < MIN_DEPTH_FOR_CONFIRMED) {
    return TX_STATUS.PENDING;
  }
  if (depth < config.maxRollbackLength) {
    return TX_STATUS.CONFIRMED;
  }
  return TX_STATUS.SETTLED;
}

/**
 * Convert transaction timestamp into an ISO yyyy-mm-dd date string.
 *
 * @param {TransactionSummary} tx
 * @return {string}
 */
export function txDateText(tx) {
  const timestamp = tx.timestamp instanceof Date ? tx.timestamp : new Date(tx.timestamp);
  return Number.isNaN(timestamp.getTime())
    ? new Date().toISOString().slice(0, 10)
    : timestamp.toISOString().slice(0, 10);
}

/**
 * Resolve additional status note text for expanded transaction rows.
 *
 * @param {TransactionSummary|any} tx
 * @returns {string}
 */
export function txStatusNote(tx) {
  const status = txStatus(tx);

  if (isL2PaymentTx(tx)) {
    if (status === TX_STATUS.SETTLED) {
      return ' (settled)';
    }
    if (status === TX_STATUS.PENDING) {
      return ' (in processing)';
    }
    if (status === TX_STATUS.FAILED) {
      return ' (expired)';
    }
    return '';
  }

  if (status === TX_STATUS.SETTLED) {
    return ' (immutable)';
  }

  if (tx?.depth != null) {
    return ` (${tx.depth} blocks ago)`;
  }

  return '';
}

/**
 * Resolve transaction direction from signed amount.
 *
 * @param {BigInt} amount
 * @return {'in'|'out'}
 */
export function txDirection(amount) {
  return amount >= 0n ? 'in' : 'out';
}

export function getActivity(source, wallet, channel) {
  return (source === TX_REALM.L1 ? wallet : channel)
    .sort((a, b) => b.timestamp - a.timestamp);
}
