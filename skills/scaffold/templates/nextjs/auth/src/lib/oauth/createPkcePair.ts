/** Random PKCE verifier and its S256 challenge (RFC 7636). */
export async function createPkcePair() {
  const verifier = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return { verifier, challenge: toBase64Url(new Uint8Array(digest)) };
}

function toBase64Url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString('base64url');
}
