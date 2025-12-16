import { useCallback, useState } from 'react';
import { connectMetaMask, signInWithEthereum } from '../services/auth';
import { useLogoutUser } from './useLogoutUser';
import { CLIENT_ID } from '../utils/EnvConfig';

// Auth result type (replaces Lit's AuthMethod)
export interface AuthResult {
  address: string;
  token: string;
  user: any;
}

export default function useAuthenticate() {
  const [authResult, setAuthResult] = useState<AuthResult>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleLogoutUser = useLogoutUser();

  function isEthereumError(err: unknown): err is { code: number; info?: { error?: { code?: number } } } {
    return typeof err === 'object' && err !== null && 'code' in err;
  }

  /**
   * Authenticate with MetaMask using SIWE (Sign-In with Ethereum)
   */
  const authWithMetaMask = useCallback(
    async (handleMetaMaskError?: (val: boolean) => void): Promise<AuthResult | undefined> => {
      setLoading(true);
      setError(false);
      handleMetaMaskError?.(false);
      setAuthResult(undefined);

      try {
        // Get client ID from URL or default
        const queryParams = new URLSearchParams(location.search);
        const clientId = queryParams.get('client_id') || CLIENT_ID;

        // Connect to MetaMask and get address
        const address = await connectMetaMask();

        // Sign in with Ethereum (SIWE)
        const { token, user } = await signInWithEthereum(address, clientId);

        const result: AuthResult = { address, token, user };
        setAuthResult(result);
        return result;
      } catch (err: unknown) {
        console.error('MetaMask authentication error:', err);
        if (isEthereumError(err)) {
          // User rejected the request
          if (err.code === 4001 || err.info?.error?.code === 4001) {
            handleMetaMaskError?.(true);
          } else {
            setError(true);
            handleLogoutUser('Authentication failed, please try again', true);
          }
        } else {
          setError(true);
          handleLogoutUser('Authentication failed, please contact the team', true);
        }
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [handleLogoutUser]
  );

  return {
    authWithMetaMask,
    // Legacy alias for compatibility during migration
    authWithEthWallet: authWithMetaMask,
    setAuthResult,
    // Legacy alias
    setAuthMethod: setAuthResult,
    authResult,
    // Legacy alias
    authMethod: authResult,
    loading,
    error,
  };
}
