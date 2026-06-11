/**
 * Assert an URL is well formed and uses the http(s) scheme.
 *
 * @param {unknown} value
 * @returns {string}
 * @throws {Error}
 */
export function assertWellFormedUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) {
    throw new Error('malformed URL');
  }

  let parsed = null;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('malformed URL');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('malformed URL');
  }

  return raw;
}
