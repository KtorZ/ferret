import * as kernel from './kernel.js';
import { writable } from 'svelte/store';

export default {
  /**
   * @template T
   * @param {string} key The namespace under which thi value is stored.
   * @param {T} defaultValue The default value to use when loading an empty store.
   * @returns {import("svelte/store").Writable<T> & { patch(obj: Partial<T>): void }}
   */
  writable(key, defaultValue) {
    /** @type {any} */
    const state = writable(load(key) ?? defaultValue);
    state.subscribe((st) => save(key, st));
    state.patch = function(obj) {
      state.update((st) => ({ ...st, ...obj }));
    }
    return state;
  },
  save,
  load,
  snapshot,
}

/**
 * @param {string} key The namespace under which this value was stored.
 */
function load(key) {
  const value = localStorage.getItem(key);
  if (value !== undefined) {
    return fromJson(value);
  }
  return null
}

/**
 * @param {string} key The namespace under which this value gets stored.
 * @param {any} value A serialisable value to store.
 */
function save(key, value) {
  localStorage.setItem(key, toJson(value));
}

/**
 * @param {string[]} keys The namespaces to snapshot from localStorage.
 */
function snapshot(keys) {
  return Object.fromEntries(
    keys.map((key) => {
      const value = localStorage.getItem(key);
      return [key, value == null ? null : JSON.parse(value)];
    }),
  );
}

/**
 * @param {any} value A serialisable value to store.
 */
function toJson(value) {
  function serialise(item) {
    if (item === undefined || typeof item === 'function') {
      return null;
    }

    if (item instanceof Date) {
      return { __date: item.getTime() };
    }

    if (isSimpleType(item) || isPlainObject(item)) {
      return item;
    }

    if (typeof item === 'bigint') {
      return { __bigint: item.toString() }
    }

    if (item instanceof kernel.AdaptorInfo) {
      return {
        __adaptorInfo: [
          item.verificationKey,
          item.closePeriod,
          item.maxTagLength,
          item.fee,
        ]
      };
    }

    if (item instanceof kernel.Lock) {
      return { __lock: item.toString() };
    }

    if (item instanceof kernel.ConsumerState) {
      return { __consumerState: item.serialize() };
    }

    if (item instanceof kernel.ShelleyAddress) {
      return { __shelleyAddress: item.toString() }
    }

    if (item instanceof kernel.SigningKey) {
      return { __signingKey: item.toString() }
    }

    if (item instanceof kernel.TransactionSummary) {
      return { __transactionSummary: item.serialise() }
    }

    if (item instanceof kernel.Tag) {
      return { __tag: item.toString() }
    }

    if (item instanceof kernel.VerificationKey) {
      return { __verificationKey: item.toString() }
    }

    console.error(item);
    throw new Error(`no strategy to serialise value of type ${typeof item}: ${item}`);
  }

  return JSON.stringify(value, (_key, item) => serialise(item));
}

/**
 * @param {string} raw A raw JSON string to parse
 */
function fromJson(raw) {
  function parse(item) {
      if (isSimpleType(item)) {
        return item;
      }

      if ('__adaptorInfo' in item) {
        const [ verificationKey, closePeriod, maxTagLength, fee ] = item.__adaptorInfo;
        return new kernel.AdaptorInfo(
          verificationKey,
          closePeriod,
          maxTagLength,
          fee,
        );
      }

      if ('__bigint' in item) {
        return BigInt(item.__bigint);
      }

      if ('__date' in item) {
        return new Date(item.__date);
      }

      if ('__lock' in item) {
        return kernel.Lock.tryParse(item.__lock);
      }

      if ('__consumerState' in item) {
        return kernel.ConsumerState.deserialize(item.__consumerState);
      }

      if ('__shelleyAddress' in item) {
        return kernel.ShelleyAddress.tryParse(item.__shelleyAddress);
      }

      if ('__signingKey' in item) {
        return kernel.SigningKey.tryParse(item.__signingKey);
      }

      if ('__tag' in item) {
        return kernel.Tag.tryParse(item.__tag);
      }

      if ('__transactionSummary' in item) {
        return kernel.TransactionSummary.deserialise(item.__transactionSummary);
      }

      if ('__verificationKey' in item) {
        return kernel.VerificationKey.tryParse(item.__verificationKey);
      }

      return item;
  }

  return JSON.parse(raw, (_key, item) => parse(item));
}

/**
 * @param {any} value A serialisable value to store.
 */
function isSimpleType(value) {
  return value === null
    || typeof value === 'number'
    || typeof value === 'string'
    || typeof value === 'boolean'
    || Array.isArray(value);
}

/**
 * @param {any} value A serialisable value to store.
 */
function isPlainObject(value) {
  return typeof value === 'object' && Object.is(Object.getPrototypeOf(value), Object.prototype);
}
