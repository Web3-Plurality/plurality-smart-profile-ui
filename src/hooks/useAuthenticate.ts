import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { AuthMethod } from '@lit-protocol/types';
import { authenticateWithEthWallet, authenticateWithStytch } from '../services/Lit';
import { useLogoutUser } from './useLogoutUser';

export default function useAuthenticate() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleLogoutUser = useLogoutUser()

  /**
   * Authenticate with Stytch
   */
  const authWithStytch = useCallback(
    async (accessToken: string, userId?: string, method?: string): Promise<void> => {
      setLoading(true);
      setError(false);
      setAuthMethod(undefined);

      try {
        const result: AuthMethod = await authenticateWithStytch(
          accessToken,
          userId,
          method
        );
        setAuthMethod(result);
      } catch (err) {
        setError(true);
        console.log("Error", err)
        handleLogoutUser("Authentication failed, please contact the team", true)
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
 * Authenticate with Ethereum wallet
 */
  const authWithEthWallet = useCallback(
    async (): Promise<void> => {
      setLoading(true);
      setError(false);
      setAuthMethod(undefined);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const signMessage = async (message: string) => {
          const sig = await signer.signMessage(message);
          return sig;
        };
        const result: AuthMethod | undefined = await authenticateWithEthWallet(
          userAddress,
          signMessage
        );
        setAuthMethod(result);
      } catch (err) {
        setError(true);
        console.log("Error", err)
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    authWithStytch,
    authWithEthWallet,
    setAuthMethod,
    authMethod,
    loading,
    error,
  };
}
