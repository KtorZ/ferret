import store from '../store';
import { readonly } from 'svelte/store';
import { assertWellFormedUrl } from '../helpers';
import { Connector, Konduit } from '../kernel';

const FERRET_API_CACHE = 'ferret-api-ferret-channel-v1';

// -------------------------------------------------------------------------------------------------
// Svelte Store
// -------------------------------------------------------------------------------------------------

const DEFAULT_STATE = {
  url: null,
};

const state = store.writable(
  'ferret.connector.v1',
  DEFAULT_STATE,
);

// -------------------------------------------------------------------------------------------------
// Interface with the application
// -------------------------------------------------------------------------------------------------

/**
 * @param {Konduit} konduit
 * @param {string} url
 * @param {boolean} strict
 */
async function init(konduit, url, strict = false) {
  try {
    url = assertWellFormedUrl(url);
    konduit.connector = await Connector.new(url);
    state.set({ url });
  } catch (err) {
    if (strict) {
      state.set(DEFAULT_STATE);
    }

    throw err;
  }
}

async function purgeHttpCache() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  await window.caches.delete(FERRET_API_CACHE);
  state.set(DEFAULT_STATE);
}

function reset() {
  state.set(DEFAULT_STATE);
}

// -------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------

export default {
  STORAGE_KEY: 'ferret.model.connector.v1',
  state: readonly(state),
  init,
  purgeHttpCache,
  reset,
};
