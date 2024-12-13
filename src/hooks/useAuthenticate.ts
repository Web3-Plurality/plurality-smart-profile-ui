import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { authenticateWithStytch } from '../services/Lit';
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

  return {
    authWithStytch,
    setAuthMethod,
    authMethod,
    loading,
    error,
  };
}
