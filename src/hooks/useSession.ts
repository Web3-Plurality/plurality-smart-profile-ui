import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { LitAbility, LitPKPResource } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { litNodeClient } from '../services/Lit';
import { getLocalStorageValue, getLocalStorageValueofClient, removeGlobalLitData } from '../utils/Helpers';
import { CLIENT_ID } from '../utils/EnvConfig';
import axiosInstance from '../services/Api';
import { useLogoutUser } from './useLogoutUser';

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const handleLogoutUser = useLogoutUser()

  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;
  const { userPkp } = getLocalStorageValueofClient(`clientID-${clientId}`)

  const getCapacityDelegationAuthSig = async (pkp: IRelayPKP) => {
    try {
      if (userPkp || pkp) {
        const payload = { address: pkp?.ethAddress }
        const { data } = await axiosInstance.post('/user/capacity', payload)
        if (data) {
          return data.capacityDelegationAuthSig
        }
      }
    } catch (err) {
      handleLogoutUser("Unable to retrieve authorization. Please try again.", true);
      console.log("Something went wrong!", err)
    }
  }


  /**
   * Generate session sigs and store new session data
   */
  const initSession = useCallback(
    async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const capacityDelegationAuthSig = await getCapacityDelegationAuthSig(pkp)
        await litNodeClient.connect()

        // Generate session sigs
        const sessionSigs = await litNodeClient.getPkpSessionSigs({
          pkpPublicKey: pkp.publicKey!,
          capabilityAuthSigs: [capacityDelegationAuthSig],
          authMethods: [authMethod],
          resourceAbilityRequests: [
            {
              resource: new LitPKPResource("*"),
              ability: LitAbility.PKPSigning,
            },
          ],
          expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
        });

        setSessionSigs(sessionSigs);
        const existingDataString = localStorage.getItem(`clientID-${clientId}`)
        let existingData = existingDataString ? JSON.parse(existingDataString) : {}

        const globalLitSession = getLocalStorageValue('lit-session-key')
        const globalLitWallet = getLocalStorageValue('lit-wallet-sig')

        existingData = {
          ...existingData,
          signature: sessionSigs,
          litWalletSig: globalLitWallet,
          litSessionKey: globalLitSession
        }

        localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
        removeGlobalLitData()

      } catch (err) {
        handleLogoutUser("Failed to initialize session. Please try again", true);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
