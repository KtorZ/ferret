import { bech32 } from 'bech32';

/**
 * @typedef {Object} PayServiceResponse
 * @property {string} callback - URL to call with amount to get invoice.
 * @property {number} minSendable - Minimum amount payable, in millisatoshis.
 * @property {number} maxSendable - Maximum amount payable, in millisatoshis.
 * @property {string} metadata - JSON-encoded metadata string.
 * @property {'payRequest'} tag - A tag set to 'payRequest' in case of success
 * @property {number} [commentAllowed] - Max length of comment, if supported.
 */

/**
 * @typedef {Object} LnUrlErrorResponse
 * @property {string} tag
 * @property {string} [error]
 * @property {string} [reason]
 */

/**
 * @typedef {Object} InvoiceResponse
 * @property {string} pr - The bolt11 invoice (payment request).
 * @property {Array<Array<string>>} [routes] - Optional routing hints.
 * @property {"ERROR"} [status] - Present and equal to "ERROR" on failure.
 * @property {string} [reason] - Error reason, present when status is "ERROR".
 */

/**
 * Decode a bech32-encoded LNURL into its underlying HTTPS URL.
 *
 * @param {string} lnurl - Bech32-encoded LNURL string (e.g. "LNURL1...").
 * @returns {string} The decoded HTTPS URL.
 * @throws {Error} If the LNURL is not valid bech32 or doesn't decode to UTF-8.
 */
function decodeLnurl(lnurl) {
  const { words } = bech32.decode(lnurl, 2000);
  const data = bech32.fromWords(words);
  return new TextDecoder().decode(new Uint8Array(data));
}

/**
 * Check whether a string looks like a Lightning Address (user@domain).
 *
 * @param {string} input - The string to check.
 * @returns {boolean} True if it looks like a Lightning Address.
 */
export function isLightningAddress(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

/**
 * Check whether a string looks like a Bolt11 Invoice
 *
 * @param {string} input - The string to check.
 * @returns {boolean} True if it looks like a Bolt11 invoice
 */
export function isBolt11(input) {
  const prefix = input.toLowerCase().slice(0, 6);

  return prefix.startsWith("lnbc")  // Mainnet
    || prefix.startsWith("lntb")    // Testnet
    || prefix.startsWith("lntbs")   // Signet
    || prefix.startsWith("lnbcrt"); // Regtest
}

/**
 * Resolve a Lightning Address into its LNURL-pay metadata endpoint URL.
 *
 * @param {string} address - Lightning Address in the form "user@domain.com".
 * @returns {string} The well-known LNURL-pay HTTPS URL.
 * @throws {Error} If the address format is invalid.
 */
function lightningAddressToUrl(address) {
  const [user, domain] = address.split('@');
  if (!user || !domain) {
    throw new Error(`Invalid Lightning Address: ${address}`);
  }
  return `https://${encodeURIComponent(domain)}/.well-known/lnurlp/${encodeURIComponent(user)}`;
}

/**
 * Resolve a LNURL or Lightning Address to its LNURL-pay metadata endpoint URL.
 *
 * @param {string} input - A bech32 LNURL string or a Lightning Address (user@domain).
 * @returns {string} The HTTPS URL to fetch payRequest metadata from.
 * @throws {Error} If the input is neither a valid LNURL nor a Lightning Address.
 */
export function parseUrl(input) {
  const rawInput = input;
  const strippedInput = input.replace(/^.*:/, "");

  if (isLightningAddress(rawInput)) {
    return lightningAddressToUrl(rawInput);
  }

  if (isLightningAddress(strippedInput)) {
    return lightningAddressToUrl(strippedInput);
  }

  try {
    return decodeLnurl(rawInput);
  } catch (_) {
    try {
      return decodeLnurl(strippedInput);
    } catch (err) {
      throw new Error(`Input is neither a valid LNURL nor a Lightning Address: ${input}`);
    }
  }
}

/**
 * Convert a LNURL or Lightning Address into a bolt11 invoice for a given amount.
 *
 * @param {string} input - A bech32 LNURL string (e.g. "LNURL1...") or a Lightning Address (e.g. "user@domain.com").
 * @param {number | null} [amountMsat] - Amount to request, in millisatoshis. Pass null (or omit) to default to the service's minSendable amount.
 * @param {Object} [options] - Optional extra parameters.
 * @param {string} [options.comment] - Optional comment, if supported by the service.
 * @returns {Promise<string>} The bolt11 invoice (payment request) string.
 * @throws {Error} If the LNURL/address is invalid, the service is not a payRequest,
 *   the amount is out of bounds, or the service returns an error.
 */
export async function lnurlToBolt11(input, amountMsat = null, options = {}) {
  const url = parseUrl(input);

  const metadataRes = await fetch(url);
  if (!metadataRes.ok) {
    throw new Error(
      `Failed to fetch LNURL-pay metadata from ${url} (HTTP ${metadataRes.status})`
    );
  }

  /** @type {PayServiceResponse} */
  const params = await metadataRes.json();

  if (params.tag !== 'payRequest') {
    const reason = ('error' in params && params.error) || ('reason' in params && params.reason);
    if (reason) {
      throw new Error(`LNURL service returned an error: ${reason}`);
    }
    throw new Error(`Expected tag "payRequest", got "${params.tag}"`);
  }

  if (
    !(params.minSendable >= 1) ||
    !(params.maxSendable >= params.minSendable)
  ) {
    throw new Error(
      `Service advertised an invalid sendable range: ` +
        `[${params.minSendable}, ${params.maxSendable}] msat. ` +
        `This is likely a bug in the recipient's LNURL service.`
    );
  }

  const resolvedAmountMsat = amountMsat ?? params.minSendable;

  if (resolvedAmountMsat < params.minSendable || resolvedAmountMsat > params.maxSendable) {
    throw new Error(
      `Amount ${resolvedAmountMsat} msat is out of bounds [${params.minSendable}, ${params.maxSendable}]`
    );
  }

  const callbackUrl = new URL(params.callback);
  callbackUrl.searchParams.set('amount', String(resolvedAmountMsat));

  if (options.comment !== undefined) {
    if (params.commentAllowed && options.comment.length > params.commentAllowed) {
      throw new Error(
        `Comment exceeds max length of ${params.commentAllowed} characters`
      );
    }
    callbackUrl.searchParams.set('comment', options.comment);
  }

  const callbackRes = await fetch(callbackUrl.toString());
  if (!callbackRes.ok) {
    throw new Error(
      `Failed to fetch invoice from callback (HTTP ${callbackRes.status})`
    );
  }
  const invoiceRes = /** @type {InvoiceResponse} */ (await callbackRes.json());

  if (invoiceRes.status === 'ERROR') {
    throw new Error(invoiceRes.reason || 'Unknown error from LNURL service');
  }

  if (!invoiceRes.pr) {
    throw new Error('Response did not contain a bolt11 invoice ("pr" field)');
  }

  return invoiceRes.pr;
}
