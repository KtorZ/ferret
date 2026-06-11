import store from '../store'
import { readonly } from 'svelte/store';
import { assertWellFormedUrl } from '../helpers';
import { Adaptor, Invoice, Konduit } from '../kernel';

// -------------------------------------------------------------------------------------------------
// Svelte Store
// -------------------------------------------------------------------------------------------------

const DEFAULT_STATE = {
  url: null,
  info: null,
};

const state = store.writable(
  'ferret.adaptor.v1',
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
    konduit.adaptor = await Adaptor.new(url);
    state.set({ url, info: konduit.adaptorInfo });
  } catch(err) {
    if (strict) {
      state.set(DEFAULT_STATE);
    }

    throw err;
  }
}

/**
 * @param {Konduit} konduit
 * @param {string|Invoice} invoice
 */
async function getQuote(konduit, invoice) {
  invoice = typeof invoice === 'string' ? Invoice.tryParse(invoice) : invoice;
  return await konduit.getQuoteFor(invoice);
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
  getQuote,
  reset,
};
