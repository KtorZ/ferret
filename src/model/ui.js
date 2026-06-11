import { TX_REALM } from '../helpers';
import store from '../store';
import { get, readonly } from 'svelte/store';

const DISPLAY_MODE = {
  ADA: 'ADA',
  FIAT: 'FIAT',
};

// -------------------------------------------------------------------------------------------------
// Svelte Store
// -------------------------------------------------------------------------------------------------

const DEFAULT_STATE = {
  toast: null,
  displayCurrency: DISPLAY_MODE.ADA,
  displayWallet: TX_REALM.L1,
};

const state = store.writable(
  'ferret.ui.v1',
  DEFAULT_STATE,
);

// -------------------------------------------------------------------------------------------------
// Interface with the application
// -------------------------------------------------------------------------------------------------

/**
 * @param {'error'|'success'} severity
 * @param {string} message
 */
function setToast(severity, message, fn = () => {}) {
  state.patch({
    toast: {
      id: `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
      severity: String(severity ?? 'error'),
      message: String(message ?? ''),
      fn,
    }
  });
}

function toggleCurrencyDisplayMode() {
  const { displayCurrency } = get(state);
  state.patch({
    displayCurrency: displayCurrency === DISPLAY_MODE.ADA ? DISPLAY_MODE.FIAT : DISPLAY_MODE.ADA,
  });
}

/**
 * @param {import('../helpers').TxRealm} displayWallet
 */
function setDisplayWallet(displayWallet) {
  state.patch({ displayWallet })
}

function reset() {
  state.set(DEFAULT_STATE);
}

// -------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------

export default {
  state: readonly(state),
  clearToast: () => {
    const { toast } = get(state);
    if (toast !== null) {
      toast.fn?.();
    }
    state.patch({ toast: null })
  },
  errorToast: (message, fn) => setToast('error', message, fn),
  successToast: (message, fn) => setToast('success', message, fn),
  toggleCurrencyDisplayMode,
  setDisplayWallet,
  reset,
};
