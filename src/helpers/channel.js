import { KONDUIT_MIN_UTXO } from './transaction';

/**
 * Format a close period expressed in seconds into a human-readable unit.
 *
 * @param {bigint|number} seconds
 * @returns {string}
 */
export function fmtClosingPeriod(seconds) {
  const value = typeof seconds === 'bigint' ? seconds : BigInt(seconds);

  if (value < 60n) {
    return `${value} sec${value === 1n ? '' : 's'}`;
  }

  if (value < 3600n) {
    const minutes = value / 60n;
    return `${minutes} min${minutes === 1n ? '' : 's'}`;
  }

  const hours = value / 3600n;
  return `${hours} hour${hours === 1n ? '' : 's'}`;
}

export function channelBalance(channel) {
  return channel.totalAmount - channel.owedAmount - KONDUIT_MIN_UTXO;
}

/** Deterministically pick a channel amongst a choice of many, in case we happen, *for some reasons*, 
 * to have more than one open channel.
 */
export function selectActiveChannel(channels) {
  if (channels.length === 0) {
    return null;
  }
  return channels.reduce((best, channel) => {
    if (!best) {
      return channel;
    }
    const bestTag = best?.tag?.toString?.() ?? '';
    const nextTag = channel?.tag?.toString?.() ?? '';
    return nextTag > bestTag ? channel : best;
  }, null);
}
