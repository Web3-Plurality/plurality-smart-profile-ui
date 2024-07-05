import { useCallback, useState } from 'react';
// import {
//   isSignInRedirect,
//   getProviderFromUrl,
// } from '@lit-protocol/lit-auth-client';
import { AuthMethod } from '@lit-protocol/types';
import { authenticateWithStytch } from '../common/lit';
// import { useConnect } from 'wagmi';

// redirectUri?: string

export default function useAuthenticate() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();


  // wagmi hook (UPDATE REQUIRED)
//   const { connectAsync } = useConnect({
//     onError: (err: unknown) => {
//       setError(err as Error);
//     },
//   });

  /**
   * Authenticate with Stytch
   */
  const authWithStytch = useCallback(
    async (accessToken: string, userId?: string, method?: string): Promise<void> => {
      setLoading(true);
      setError(undefined);
      setAuthMethod(undefined);

      try {
        const result: AuthMethod = await authenticateWithStytch(
          accessToken,
          userId,
          method
        );
        setAuthMethod(result);
      } catch (err) {
        setError(err as Error);
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
