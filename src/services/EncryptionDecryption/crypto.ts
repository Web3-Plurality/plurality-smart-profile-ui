// MetaMask-based encryption using Web Crypto API
// Replaces Lit Protocol encryption with standard AES-GCM

const ENCRYPTION_MESSAGE = 'Plurality encryption key derivation';

/**
 * Derives an AES-256-GCM encryption key from a MetaMask signature.
 * Always uses MetaMask signature for consistency across all contexts (iframe or standalone).
 * The key is cached in sessionStorage for the duration of the browser session.
 */
export async function deriveEncryptionKey(address: string): Promise<CryptoKey> {
  // Check if we have a cached key
  const cachedKey = sessionStorage.getItem(`encKey-${address}`);
  if (cachedKey) {
    const keyData = JSON.parse(cachedKey);
    return await crypto.subtle.importKey(
      'raw',
      new Uint8Array(keyData),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  // First, ensure we have account access (important for iframes)
  try {
    await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
  } catch (e) {
    console.error('Failed to request account access:', e);
    throw new Error('Please connect your wallet to continue');
  }

  // Request signature from MetaMask to derive encryption key
  console.log('deriveEncryptionKey: Requesting MetaMask signature for encryption key...');
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [`${ENCRYPTION_MESSAGE}\nAddress: ${address}`, address],
  });

  // Derive key using PBKDF2
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(signature as string),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(address),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Cache the key for this session
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  sessionStorage.setItem(
    `encKey-${address}`,
    JSON.stringify(Array.from(new Uint8Array(exportedKey)))
  );

  return key;
}

/**
 * Encrypts plaintext using AES-256-GCM
 * Returns base64-encoded ciphertext and IV
 */
export async function encryptAES(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

/**
 * Decrypts base64-encoded ciphertext using AES-256-GCM
 */
export async function decryptAES(
  encryptedData: { ciphertext: string; iv: string },
  key: CryptoKey
): Promise<string> {
  const ciphertext = Uint8Array.from(atob(encryptedData.ciphertext), (c) =>
    c.charCodeAt(0)
  );
  const iv = Uint8Array.from(atob(encryptedData.iv), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Clears the cached encryption key (call on logout)
 */
export function clearEncryptionKey(address: string): void {
  sessionStorage.removeItem(`encKey-${address}`);
}
