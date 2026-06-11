/**
 * Number of lovelace units in one ADA.
 *
 * @type {bigint}
 */
const LOVELACE_PER_ADA = 1_000_000n;

/**
 * Minimum lovelace threshold under which ADA fees are displayed as lovelace.
 *
 * @type {bigint}
 */
const MIN_ADA_DECIMAL_DISPLAY_LOVELACE = 10_000n; // 0.01 ADA

/**
 * Parse a user-entered ADA amount into lovelace.
 *
 * @param {unknown} value
 * @returns {bigint}
 */
export function parseLovelace(value) {
  const raw = String(value ?? '').trim();
  if (!/^\d+(\.\d{0,6})?$/.test(raw)) {
    throw new Error('Invalid ADA amount.');
  }
  const [wholePart, decimalPart = ''] = raw.split('.');
  const whole = BigInt(wholePart || '0');
  const decimals = BigInt((decimalPart + '000000').slice(0, 6));
  return whole * LOVELACE_PER_ADA + decimals;
}

/**
 * Convert lovelace to ADA.
 *
 * @param {bigint} lovelace
 * @returns {number}
 */
export function lovelaceToAdaNumber(lovelace) {
  return Number(lovelace) / Number(LOVELACE_PER_ADA);
}

/**
 * Convert an amount from base currency (ADA) into a display amount.
 *
 * @param {bigint} value
 * @param {string} currency
 * @param {Record<string, number>} [fxRates]
 * @returns {number}
 */
function toDisplayAmount(value, currency, fxRates) {
  if (currency === 'ADA') {
    return lovelaceToAdaNumber(value);
  }
  return lovelaceToAdaNumber(value) * (fxRates?.[currency] ?? 1);
}

/**
 * Resolve symbol for a supported display currency.
 *
 * @param {string} currency
 * @returns {string}
 */
function currencySymbol(currency) {
  if (currency === 'ADA') {
    return '₳';
  }
  if (currency === 'USD') {
    return '$';
  }
  if (currency === 'EUR') {
    return '€';
  }
  if (currency === 'GBP') {
    return '£';
  }
  if (currency === 'CHF') {
    return 'CHF';
  }
  return '?';
}

/**
 * Split an amount into symbol/whole/cents parts for metric display.
 *
 * @param {bigint} value
 * @param {string} currency
 * @param {Record<string, number>} [fxRates]
 * @returns {{ symbol: string, whole: string, cents: string }}
 */
export function metricBalanceParts(value, currency, fxRates) {
  const amount = toDisplayAmount(value, currency, fxRates);
  const [whole, cents] = amount.toFixed(2).split('.');
  return { symbol: currencySymbol(currency), whole, cents };
}

/**
 * Format an amount for display, optionally with sign handling.
 *
 * @param {bigint} value
 * @param {string} currency
 * @param {'none'|'auto'|'+'|'-'} [sign]
 * @param {Record<string, number>} [fxRates]
 * @returns {{ sign: string, value: string }}
 */
export function fmtCurrency(value, currency, sign = 'none', fxRates) {
  const unsignedAmount = Math.abs(toDisplayAmount(value < 0n ? -value : value, currency, fxRates));
  const signedAmount = toDisplayAmount(value, currency, fxRates);
  const withSign = sign !== 'none';
  const signPrefix =
    sign === 'auto'
      ? value >= 0n
        ? '+'
        : '-'
      : sign;
  const amount = withSign ? unsignedAmount : signedAmount;
  const prefix = withSign ? signPrefix : '';
  return { sign: prefix, value: `${currencySymbol(currency)}${Number(amount).toFixed(2)}` };
}

/**
 * Format a lovelace amount with the Ł prefix.
 *
 * @param {bigint} value
 * @param {'none'|'auto'|'+'|'-'} [sign]
 * @returns {string}
 */
function fmtLovelace(value, sign = 'none') {
  const absolute = value < 0n ? -value : value;
  const withSign = sign !== 'none';
  const signPrefix =
    sign === 'auto'
      ? value >= 0n
        ? '+'
        : '-'
      : sign === '+' || sign === '-'
        ? sign
        : '';
  const amount = withSign ? absolute : value;
  return `${withSign ? signPrefix : ''}Ł${amount.toString()}`;
}

/**
 * Format a number to a fixed decimal precision with NaN/infinite protection.
 *
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
function fmtWithFixedDecimals(value, decimals) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) {
    return Number(0).toFixed(decimals);
  }
  return normalized.toFixed(decimals);
}

/**
 * Format fee amounts with ADA/lovelace-specific and fiat-specific display rules.
 *
 * @param {bigint} fee
 * @param {string} currency
 * @param {Record<string, number>} [fxRates]
 * @returns {string}
 */
export function fmtFee(fee, currency, fxRates) {
  const absoluteFee = fee < 0n ? -fee : fee;
  if (currency === 'ADA') {
    if (absoluteFee < MIN_ADA_DECIMAL_DISPLAY_LOVELACE) {
      return fmtLovelace(absoluteFee);
    }
    return `${currencySymbol(currency)}${lovelaceToAdaNumber(absoluteFee).toFixed(2)}`;
  }
  const converted = toDisplayAmount(absoluteFee, currency, fxRates);
  const formatted = converted > 0.01
    ? fmtWithFixedDecimals(converted, 2)
    : fmtWithFixedDecimals(converted, 6);
  if (currency === 'CHF') {
    return `CHF ${formatted}`;
  }
  return `${currencySymbol(currency)}${formatted}`;
}
