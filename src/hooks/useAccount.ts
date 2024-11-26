import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { IRelayPKP } from '@lit-protocol/types';
import { getPKPs, mintPKP } from '../services/Lit';
import { getLocalStorageValue, isProfileConnectPlatform, isRsmPlatform, setLocalStorageValue } from '../utils/Helpers';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { goToStep, resetSteps } from '../Slice/stepperSlice';
import { message } from 'antd';

export default function useAccounts() {
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [isFetchTriggered, setIsFetchTriggered] = useState<boolean>(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

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
        handleLogout()
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
        handleLogout()
      } finally {
        setLoading(false);
      }
    },
    []
  );

  async function handleLogout() {
    const smartprofileData = getLocalStorageValue("smartProfileData")
    const tool = getLocalStorageValue("tool")
    const clientId = localStorage.getItem('clientId')
    localStorage.clear();
    setLocalStorageValue("smartProfileData", smartprofileData || '')
    setLocalStorageValue("tool", tool || '')
    dispatch(resetSteps())
    dispatch(goToStep("litLogin"))
    let path = window.location.pathname
    if (isRsmPlatform() || isProfileConnectPlatform()) {
      path = `${window.location.pathname}?client_id=${clientId}`
    }
    navigate(path, { replace: true });
    message.error("Something went wrong, please contact the team")
  }

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
