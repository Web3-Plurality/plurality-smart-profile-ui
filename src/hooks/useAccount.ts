import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { IRelayPKP } from '@lit-protocol/types';
import { getPKPs, mintPKP } from '../services/Lit';
import { useLogoutUser } from './useLogoutUser';

export default function useAccounts() {
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [isFetchTriggered, setIsFetchTriggered] = useState<boolean>(false)

  const handleLogoutUser = useLogoutUser()

  /**
   * Fetch PKPs tied to given auth method
   */
  const fetchAccounts = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        // Fetch PKPs tied to given auth method
        const myPKPs = await getPKPs(authMethod);
        setAccounts(myPKPs);

        setIsFetchTriggered(true)
        // If only one PKP, set as current account
        if (myPKPs.length === 1) {
          setCurrentAccount(myPKPs[0]);
        }
      } catch (err) {
        setError(err as Error);
        handleLogoutUser("Failed to fetch accounts, please contact the team")
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Mint a new PKP for current auth method
   */
  const createAccount = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const newPKP = await mintPKP(authMethod);
        setAccounts(prev => [...prev, newPKP]);
        setCurrentAccount(newPKP);
      } catch (err) {
        setError(err as Error);
        handleLogoutUser("Failed to create account, please contact the team")
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    isFetchTriggered,
    accounts,
    currentAccount,
    loading,
    error,
  };
}
