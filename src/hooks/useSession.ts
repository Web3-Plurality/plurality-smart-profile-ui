import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { LitAbility, LitPKPResource } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { litNodeClient } from '../services/Lit';
import { getLocalStorageValue, isProfileConnectPlatform, isRsmPlatform, setLocalStorageValue } from '../utils/Helpers';
import { useDispatch } from 'react-redux';
import { goToStep } from '../Slice/stepperSlice';
import axiosInstance from '../services/Api';
import { globalSessionSigs } from '../Slice/userDataSlice';

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getCapacityDelegationAuthSig = async (pkp: IRelayPKP) => {
    try {
      const userPkp = localStorage.getItem("pkpKey")
      if (userPkp || pkp) {
        const payload = { address: pkp?.ethAddress }
        const { data } = await axiosInstance.post('/user/capacity', payload)
        if (data) {
          return data.capacityDelegationAuthSig
        }
      }
    } catch (err) {
      handleLogout();
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
        localStorage.setItem('signature', JSON.stringify(sessionSigs))
        dispatch(globalSessionSigs(JSON.stringify(sessionSigs)))

      } catch (err) {
        handleLogout();
        setError(err as Error);
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

    dispatch(goToStep("litLogin"))
    let path = window.location.pathname
    if (isRsmPlatform() || isProfileConnectPlatform()) {
      path = `${window.location.pathname}?client_id=${clientId}`
    }
    navigate(path, { replace: true });
    message.error("Something went wrong, please contact the team")
  }

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
