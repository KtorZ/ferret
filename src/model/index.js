import { get, readonly, writable } from 'svelte/store';
import { Konduit, NetworkId, ShelleyAddress, SigningKey } from '../kernel';
import config from '../config';
import store from '../store';
import { TX_REALM, TX_STATUS, txStatus } from '../helpers';

import adaptor from './adaptor';
import channel from './channel';
import connector from './connector';
import fx from './fx';
import settings from './settings';
import ui from './ui';
import wallet from './wallet';

// Top-level konduit instance, which is either instantiated when the user initialise the app, or
let konduit = null;

// -------------------------------------------------------------------------------------------------
// Svelte Store
// -------------------------------------------------------------------------------------------------

const STATE = {
  // There's no stake key, or we failed to load the instance.
  UNAVAILABLE: -1,
  // The app just started, we don't know if we have a signing key available or not yet.
  BOOTING: 0,
  // A signing key has been found, but we haven't loaded the whole system yet.
  LOADING: 1,
  // Konduit is ready, we can let the app start.
  READY: 2,
  // The app has started but is busy doing work.
  BUSY: 3,
}

const state = writable(STATE.BOOTING);

const STORAGE_KEY = "ferret.konduit.v1";
const BACKUP_STORE_KEYS = [
  STORAGE_KEY,
  'ferret.settings.v1',
  'ferret.wallet.v1',
  'ferret.adaptor.v1',
  'ferret.connector.v1',
  'ferret.channel.v1',
  'ferret.fx.v1',
  'ferret.ui.v1',
];
const signingKey = store.load(STORAGE_KEY);
if (signingKey != null) {
  initKonduit(signingKey);
} else {
  state.set(STATE.UNAVAILABLE);
}

/**
 * @param {string|SigningKey|null} signingKey
 */
async function initKonduit(signingKey) {
  try {
    state.set(STATE.LOADING);

    // Parse configuration
    const networkId = config.networkName === 'mainnet' ? NetworkId.mainnet() : NetworkId.testnet();
    const scriptDeploymentAddress = ShelleyAddress.tryParse(config.scriptDeploymentAddress);


    // Instantiate Konduit runtime
    if (signingKey == null) {
      signingKey = new SigningKey();
    } else if (typeof signingKey === 'string') {
      signingKey = SigningKey.tryParse(signingKey);
    } else if (!(signingKey instanceof SigningKey)) {
      throw new Error("unexpected signing key");
    }
    store.save(STORAGE_KEY, signingKey);
    konduit = new Konduit(networkId, scriptDeploymentAddress, signingKey);

    // Initialize the Wallet
    wallet.init(konduit);

    // Initialize the Connector
    const defaultConnector = config.connectors.find(({ label }) => label == config.defaultConnector);
    try {
      await connector.init(
        konduit,
        get(connector.state)?.url ?? defaultConnector?.url,
        true,
      );
    } catch (err) {
      console.error("failed to initialize the connector", err);
    }

    // Initialize the Adaptor
    const defaultAdaptor = config.adaptors.find(({ label }) => label == config.defaultAdaptor);
    try {
      await adaptor.init(
        konduit,
        get(adaptor.state)?.url ?? defaultAdaptor?.url,
        true,
      );
    } catch (err) {
      console.error("failed to initialize the adaptor", err);
    }

    // Initialize the Channel, if any.
    channel.init(konduit);

    // Initial refresh the application state, we don't use `refresh` directly here to ensure we only
    // only change the app to ready once we have at least performed the initial refresh.
    await Promise.all([
      wallet.refresh(konduit),
      channel.refresh(konduit),
    ]);

    state.set(STATE.READY);
  } catch(err) {
    state.set(STATE.UNAVAILABLE);
    ui.errorToast(err?.message ?? err);
    throw err;
  }
}


//-------------------------------------------------------------------------------------------------
// App Refresh
// -------------------------------------------------------------------------------------------------

/**
 * @returns {boolean}
 */
function shouldAutoRefresh() {
  const walletState = get(wallet.state);
  const channelState = get(channel.state);

  const hasPendingTx = walletState.transactions.some((tx) => txStatus(tx) === TX_STATUS.PENDING);
  const hasPendingL2Tx = (channelState?.transactions ?? []).some((tx) => txStatus(tx) === TX_STATUS.PENDING);
  const channelPending = channelState?.step === channel.STEP.OPENING || channelState?.step === channel.STEP.CLOSING;
  const walletBalanceZero = (walletState?.balance ?? 0n) === 0n;

  return hasPendingTx || hasPendingL2Tx || channelPending || walletBalanceZero;
}

async function refresh() {
  if (get(state) !== STATE.READY) {
    return;
  }

  state.set(STATE.BUSY);

  fx.reset();

  try {
    const wasOpening = get(channel.state).step === channel.STEP.OPENING;
    await Promise.all([
      wallet.refresh(konduit),
      channel.refresh(konduit),
    ]);
    const hasOpened = get(channel.state).step === channel.STEP.OPENED;
    if (wasOpening && hasOpened) {
      ui.setDisplayWallet(TX_REALM.L2);
    }
  } finally {
    state.set(STATE.READY);
  }
}

setInterval(() => {
  if (get(state) !== STATE.READY) {
    return;
  }

  if (!shouldAutoRefresh()) {
    return;
  }

  void refresh();
}, 20_000);

//-------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------

export default {
  // Global
  state: readonly(state),
  STATE,
  initKonduit,
  refresh,
  exportBackup() {
    if (konduit == null) {
      throw new Error('Wallet is unavailable.');
    }

    return {
      filename: `${konduit.wallet.verificationKey.toString()}.json`,
      payload: store.snapshot(BACKUP_STORE_KEYS),
    };
  },
  async exit() {
    // FIXME: This should empty funds to the exit address and properly clean up the state
    store.save(STORAGE_KEY, null);
    state.set(STATE.BOOTING);
    wallet.reset();
    channel.reset();
    adaptor.reset();
    connector.reset();
    ui.reset();
    settings.reset();
    ui.successToast("Cheers.", () => state.set(STATE.UNAVAILABLE));
  },

  // Adaptor
  adaptor: adaptor.state,
  initAdaptor(url) { return adaptor.init(konduit, url, false) },
  getQuote(invoice) { return adaptor.getQuote(konduit, invoice) },

  // Channel
  CHANNEL_STEP: channel.STEP,
  channel: channel.state,
  openChannel(tag, amount) { return channel.open(konduit, tag, amount) },
  addToChannel(amount) { return channel.add(konduit, amount) },
  async pay(invoice, quote) {
    state.set(STATE.BUSY);
    try {
      return await channel.pay(konduit, invoice, quote);
    } finally {
      state.set(STATE.READY);
    }
  },
  closeChannel() { return channel.close(konduit) },

  // Connector
  connector: connector.state,
  initConnector(url) { return connector.init(konduit, url, false) },
  purgeHttpCache: connector.purgeHttpCache,

  // FX
  fx: fx.state,

  // Settings
  settings: settings.state,
  configureAdaptor: settings.setAdaptor,
  configureConnector: settings.setConnector,
  configureCurrency: settings.setCurrency,
  configureFxProvider: settings.setFxProvider,
  configureLocale: settings.setLocale,
  configureNetwork: settings.setNetwork,

  // UI
  ui: ui.state,
  clearToast: ui.clearToast,
  successToast: ui.successToast,
  errorToast: ui.errorToast,
  toggleCurrencyDisplayMode: ui.toggleCurrencyDisplayMode,
  setDisplayWallet: ui.setDisplayWallet,

  // Wallet
  wallet: wallet.state,
  setStakeCredential(stakeCredential) { return wallet.setStakeCredential(konduit, stakeCredential) },
  setExitAddress(exitAddress) { return wallet.setExitAddress(konduit, exitAddress) },
};
