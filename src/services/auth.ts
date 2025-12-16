// Pure MetaMask authentication service
// Replaces Lit Protocol authentication with standard SIWE (Sign-In with Ethereum)

import { SiweMessage } from 'siwe';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * Connect to MetaMask and get the user's address
 */
export async function connectMetaMask(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  return (accounts as string[])[0];
}

/**
 * Sign in with Ethereum (SIWE) - authenticates user with backend
 */
export async function signInWithEthereum(
  address: string,
  clientAppId: string
): Promise<{ token: string; user: any }> {
  // Get nonce from backend
  const {
    data: { nonce },
  } = await axios.post(`${API_BASE_URL}/auth/siwe/login`, {
    address,
  });

  // Create SIWE message
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Sign in to Plurality',
    uri: window.location.origin,
    version: '1',
    chainId: 1,
    nonce,
  });

  const messageToSign = message.prepareMessage();

  // Request signature from MetaMask
  const signature = await window.ethereum!.request({
    method: 'personal_sign',
    params: [messageToSign, address],
  });

  // Verify with backend
  const { data } = await axios.post(
    `${API_BASE_URL}/auth/siwe/authenticate`,
    {
      address,
      clientAppId,
    },
    {
      headers: {
        'x-siwe': JSON.stringify({
          siwe: signature,
          message: encodeURIComponent(messageToSign),
        }),
      },
    }
  );

  return { token: data.token, user: data.user };
}

/**
 * Get stored authentication data from localStorage
 */
export function getStoredAuth(
  clientId: string
): { address: string; token: string } | null {
  const stored = localStorage.getItem(`auth-${clientId}`);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Store authentication data in localStorage
 */
export function storeAuth(
  clientId: string,
  address: string,
  token: string
): void {
  localStorage.setItem(`auth-${clientId}`, JSON.stringify({ address, token }));
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuth(clientId: string): void {
  localStorage.removeItem(`auth-${clientId}`);
}

/**
 * Get current wallet address from stored auth or MetaMask
 */
export async function getCurrentAddress(clientId: string): Promise<string | null> {
  // First check clientID-${clientId} localStorage (main storage location)
  const clientData = localStorage.getItem(`clientID-${clientId}`);
  if (clientData) {
    try {
      const parsed = JSON.parse(clientData);
      if (parsed.walletAddress) {
        return parsed.walletAddress;
      }
    } catch (e) {
      console.error('Failed to parse clientID data:', e);
    }
  }

  // Fallback: check auth-${clientId} storage
  const stored = getStoredAuth(clientId);
  if (stored?.address) {
    return stored.address;
  }

  // Otherwise check if MetaMask is connected
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    if ((accounts as string[]).length > 0) {
      return (accounts as string[])[0];
    }
  }

  return null;
}

// Add ethereum type to window
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
