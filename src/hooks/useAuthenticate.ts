import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { authenticateWithStytch } from '../services/Lit';

export default function useAuthenticate() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

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
        console.log("Found you: ", err)
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    authWithStytch,
    authMethod,
    loading,
    error,
  };
}
