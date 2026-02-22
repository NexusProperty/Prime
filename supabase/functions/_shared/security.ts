import { timingSafeEqual } from 'node:crypto';

/**
 * Verify Vapi webhook secret.
 * Vapi sends the Server URL Secret as a plain value in the 'x-vapi-secret' header.
 * Uses timingSafeEqual to prevent timing-attack leakage.
 */
export function verifyVapiSignature(
  _rawBody: Uint8Array,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;

  const expected = new TextEncoder().encode(secret);
  const received = new TextEncoder().encode(signatureHeader);

  if (expected.byteLength !== received.byteLength) return false;
  return timingSafeEqual(expected, received);
}
