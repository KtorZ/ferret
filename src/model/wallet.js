import store from '../store';
import { get, readonly } from 'svelte/store';
import { Credential, Konduit, ShelleyAddress } from '../kernel';

// -------------------------------------------------------------------------------------------------
// Svelte Store
// -------------------------------------------------------------------------------------------------

const DEFAULT_STATE = {
  address: null,
  exitAddress: null,
  balance: 0n,
  transactions: [],
};

const state = store.writable(
  'ferret.wallet.v1',
  DEFAULT_STATE,
);

// -------------------------------------------------------------------------------------------------
// Interface with the application
// -------------------------------------------------------------------------------------------------

/**
 * @param {Konduit} konduit
 */
function init(konduit) {
  const { address, exitAddress } = get(state);
  setStakeCredential(konduit, address?.stakeCredential)
  setExitAddress(konduit, exitAddress)
}

/**
 * @param {Konduit} konduit
 * @param {string|null} stakeCredential
 */
function setStakeCredential(konduit, stakeCredential) {
  if (stakeCredential != null) {
    konduit.wallet.stakeCredential = Credential.tryParse(stakeCredential);
  } else {
    konduit.wallet.resetStakeCredential();
  }
  state.patch({ address: konduit.wallet.address });
}


/**
 * @param {Konduit} konduit
 * @param {string|null} exitAddress
 */
function setExitAddress(konduit, exitAddress) {
  if (exitAddress != null) {
    konduit.wallet.exitAddress = ShelleyAddress.tryParse(exitAddress);
  } else {
    konduit.wallet.resetExitAddress();
  }
  state.patch({ exitAddress: konduit.wallet.exitAddress });
}

/**
 * @param {Konduit} konduit
 */
async function refresh(konduit) {
  const balance = await konduit.wallet.balance(konduit.connector);
  const transactions = await konduit.wallet.transactions(konduit.connector);
  state.patch({ balance, transactions });
}

function reset() {
  state.set(DEFAULT_STATE);
}

// -------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------

export default {
  state: readonly(state),
  init,
  setStakeCredential,
  setExitAddress,
  refresh,
  reset,
};
