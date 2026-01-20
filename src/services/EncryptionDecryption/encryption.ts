// MetaMask-based encryption (replaces Lit Protocol encryption)
import { CLIENT_ID } from '../../utils/EnvConfig';
import { deriveEncryptionKey, encryptAES } from './crypto';
import { getCurrentAddress } from '../auth';

/**
 * Encrypts data using AES-256-GCM with a key derived from MetaMask signature
 * @param dataToEncrypt - String data to encrypt
 * @returns Encrypted data object with ciphertext and iv (base64 encoded)
 */
export const encryptData = async (
  dataToEncrypt: string
): Promise<{ ciphertext: string; iv: string } | undefined> => {
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;

  // Get current wallet address
  const address = await getCurrentAddress(clientId);

  if (!address) {
    console.error('encryptData: No wallet address found for encryption');
    return undefined;
  }

  try {
    // Derive encryption key from MetaMask signature
    const key = await deriveEncryptionKey(address);

    // Encrypt the data
    const encrypted = await encryptAES(dataToEncrypt, key);

    return encrypted;
  } catch (error) {
    console.error('encryptData: Encryption failed:', error);
    throw error;
  }
};
