// MetaMask-based decryption (replaces Lit Protocol decryption)
import { CLIENT_ID } from '../../utils/EnvConfig';
import { deriveEncryptionKey, decryptAES } from './crypto';
import { getCurrentAddress } from '../auth';

/**
 * Decrypts data using AES-256-GCM with a key derived from MetaMask signature
 * @param encryptedData - Encrypted data (either stringified JSON or object with ciphertext and iv)
 * @returns Decrypted and parsed data
 */
export const decryptData = async (
  encryptedData: string | { ciphertext: string; iv: string }
): Promise<any | undefined> => {
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;

  // Get current wallet address
  const address = await getCurrentAddress(clientId);

  if (!address) {
    console.error('No wallet address found for decryption');
    return undefined;
  }

  try {
    // Parse encrypted data if it's a string
    const parsedData =
      typeof encryptedData === 'string' ? JSON.parse(encryptedData) : encryptedData;

    // Derive encryption key from MetaMask signature
    const key = await deriveEncryptionKey(address);

    // Decrypt the data
    const decrypted = await decryptAES(parsedData, key);

    // Parse the decrypted JSON string
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};
