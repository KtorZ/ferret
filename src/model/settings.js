import { readonly, writable } from 'svelte/store';
import config from '../config';
import store from '../store';

// -------------------------------------------------------------------------------------------------
// Svelte Store
// -------------------------------------------------------------------------------------------------

const DEFAULT_STATE = {
  locale: 'en-UK',
  network: config.networkName,
  currency: 'USD',
  fxProvider: 'HardCoded',
  connector: {
    type: 'predefined',
    label: config.defaultConnector,
  },
  adaptor: {
    type: 'predefined',
    label: config.defaultAdaptor,
  }
};

const state = store.writable(
  `ferret.settings.v1`,
  DEFAULT_STATE,
);

// -------------------------------------------------------------------------------------------------
// Shared validators
// -------------------------------------------------------------------------------------------------

function equalsCI(a, b) {
  return String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();
}

/**
 * @param {string} value
 * @param {string} scope
 * @returns {string}
 */
function assertHttpUrl(value, scope) {
  const normalized = String(value ?? '').trim();
  if (!normalized) {
    return '';
  }

  let parsed = null;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`${scope} must be a valid URL.`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${scope} must use http or https.`);
  }

  return parsed.toString();
}

// -------------------------------------------------------------------------------------------------
// Currency
// -------------------------------------------------------------------------------------------------

const KNOWN_CURRENCIES = ['USD', 'EUR', 'CHF', 'GBP'];

/**
 * @param {string} value
 * @returns {string}
 */
function assertCurrency(value) {
  const currency = String(value ?? '').toUpperCase();
  if (!KNOWN_CURRENCIES.includes(currency)) {
    throw new Error(`unknown currency, must be one of ${KNOWN_CURRENCIES.join(',')}`);
  }
  return currency;
}

// -------------------------------------------------------------------------------------------------
// Locale
// -------------------------------------------------------------------------------------------------

const KNOWN_LOCALES = ['en-UK'];

/**
 * @param {string} value
 * @returns {string}
 */
function assertLocale(value) {
  const locale = String(value ?? '').trim();
  const known = KNOWN_LOCALES.find((candidate) => equalsCI(candidate, locale));
  if (!known) {
    throw new Error(`unknown locale, must be one of ${KNOWN_LOCALES.join(',')}`);
  }
  return known;
}

// -------------------------------------------------------------------------------------------------
// FX Provider
// -------------------------------------------------------------------------------------------------

const KNOWN_FX_PROVIDERS = ['HardCoded'];

/**
 * @param {string} value
 * @returns {string}
 */
function assertFxProvider(value) {
  const provider = String(value ?? '').trim();
  const known = KNOWN_FX_PROVIDERS.find((candidate) => equalsCI(candidate, provider));
  if (!known) {
    throw new Error(`unknown fx provider, must be one of ${KNOWN_FX_PROVIDERS.join(',')}`);
  }
  return known;
}

// -------------------------------------------------------------------------------------------------
// Network
// -------------------------------------------------------------------------------------------------

const KNOWN_NETWORKS = ['preprod', 'preview', 'mainnet'];

/**
 * @param {string} value
 * @returns {string}
 */
function assertNetwork(value) {
  const network = String(value ?? '').trim();
  const known = KNOWN_NETWORKS.find((candidate) => equalsCI(candidate, network));
  if (!known) {
    throw new Error(`unknown network, must be one of ${KNOWN_NETWORKS.join(',')}`);
  }
  return known;
}

// -------------------------------------------------------------------------------------------------
// Connector
// -------------------------------------------------------------------------------------------------

/** @typedef {'predefined'|'custom'} ConnectorType */

/** @type {{PREDEFINED: ConnectorType, CUSTOM: ConnectorType}} */
const CONNECTOR_TYPES = {
  PREDEFINED: 'predefined',
  CUSTOM: 'custom',
};

/**
 * @param {string} value
 * @returns {ConnectorType}
 */
function assertConnectorType(value) {
  const type = String(value ?? '').trim().toLowerCase();
  if (type !== CONNECTOR_TYPES.PREDEFINED && type !== CONNECTOR_TYPES.CUSTOM) {
    throw new Error('unknown connector type.');
  }
  return type;
}

/**
 * @param {ConnectorType} type
 * @param {string} label
 * @returns {string}
 */
function assertConnectorLabel(type, label) {
  const normalizedType = assertConnectorType(type);
  const normalizedLabel = String(label ?? '').trim();

  if (normalizedType === CONNECTOR_TYPES.CUSTOM) {
    return assertHttpUrl(normalizedLabel, 'custom connector URL');
  }

  const knownLabels = (config.connectors ?? [])
    .map((item) => String(item?.label ?? '').trim())
    .filter(Boolean);
  const known = knownLabels.find((candidate) => equalsCI(candidate, normalizedLabel));
  if (!known) {
    throw new Error(`unknown connector, must be one of ${knownLabels.join(',')}`);
  }
  return known;
}

// -------------------------------------------------------------------------------------------------
// Adaptor
// -------------------------------------------------------------------------------------------------

/** @typedef {'predefined'|'custom'} AdaptorType */

/** @type {{PREDEFINED: AdaptorType, CUSTOM: AdaptorType}} */
const ADAPTOR_TYPES = {
  PREDEFINED: 'predefined',
  CUSTOM: 'custom',
};

/**
 * @param {string} value
 * @returns AdaptorType
 */
function assertAdaptorType(value) {
  const type = String(value ?? '').trim().toLowerCase();
  if (type !== ADAPTOR_TYPES.PREDEFINED && type !== ADAPTOR_TYPES.CUSTOM) {
    throw new Error('unknown adaptor type.');
  }
  return type;
}

/**
 * @param {AdaptorType} type
 * @param {string} label
 * @returns {string}
 */
function assertAdaptorLabel(type, label) {
  const normalizedType = assertAdaptorType(type);
  const normalizedLabel = String(label ?? '').trim();

  if (normalizedType === ADAPTOR_TYPES.CUSTOM) {
    return assertHttpUrl(normalizedLabel, 'custom adaptor URL');
  }

  const knownLabels = (config.adaptors ?? [])
    .map((item) => String(item?.label ?? '').trim())
    .filter(Boolean);
  const known = knownLabels.find((candidate) => equalsCI(candidate, normalizedLabel));
  if (!known) {
    throw new Error(`unknown adaptor, must be one of ${knownLabels.join(',')}`);
  }
  return known;
}

// -------------------------------------------------------------------------------------------------
// Interface with the application
// -------------------------------------------------------------------------------------------------

/**
 * @param {ConnectorType} type
 * @param {string} label
 */
function setConnector(type, label) {
  const normalizedType = assertConnectorType(type);
  const normalizedLabel = assertConnectorLabel(normalizedType, label);
  state.patch({
    connector: {
      type: normalizedType,
      label: normalizedLabel,
    },
  });
}

/**
 * @param {'predefined'|'custom'} type
 * @param {string} label
 */
function setAdaptor(type, label) {
  const normalizedType = assertAdaptorType(type);
  const normalizedLabel = assertAdaptorLabel(normalizedType, label);
  state.patch({
    adaptor: {
      type: normalizedType,
      label: normalizedLabel,
    },
  });
}

/**
 * @param {string} currency
 */
function setCurrency(currency) {
  state.patch({ currency: assertCurrency(currency) });
}

/**
 * @param {string} fxProvider
 */
function setFxProvider(fxProvider) {
  state.patch({ fxProvider: assertFxProvider(fxProvider) });
}

/**
 * @param {string} locale
 */
function setLocale(locale) {
  state.patch({ locale: assertLocale(locale) });
}

/**
 * @param {string} network
 */
function setNetwork(network) {
  assertNetwork(network);
  // Intentionally a no-op for now; network is fixed by runtime config.
}

function reset() {
  state.set(DEFAULT_STATE);
}

// -------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------

export default {
  state: readonly(state),
  CONNECTOR_TYPES,
  ADAPTOR_TYPES,
  KNOWN_CURRENCIES,
  KNOWN_LOCALES,
  KNOWN_FX_PROVIDERS,
  KNOWN_NETWORKS,
  setAdaptor,
  setConnector,
  setCurrency,
  setFxProvider,
  setLocale,
  setNetwork,
  reset,
};
