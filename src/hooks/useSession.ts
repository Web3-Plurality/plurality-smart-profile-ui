import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { litNodeClient } from '../common/lit';
import { LitAbility, LitPKPResource } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useDisconnect } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../context/StepContext';
import { message } from 'antd';

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const navigate = useNavigate()

  const { setUser } = useAuth()
  const { disconnectAsync } = useDisconnect();
  const { handleStepper } = useStep();


  /**
   * Generate session sigs and store new session data
   */
  const initSession = useCallback(
    async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {

        const authToken = await userAuthorization(pkp.ethAddress)
        const capacityDelegationAuthSig = await getCapacityDelegationAuthSig(authToken)

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

      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const userAuthorization = async (pkpAddress: string) => {
    try {
      const url = `${import.meta.env.VITE_APP_API_BASE_URL}/user`
      const payload = {
        address: pkpAddress,
        email: localStorage.getItem('user'),
        subscribe: true
      };
      const headers = {
        'x-stytch-token': Cookies.get('stytch_session_jwt'),
      };
      const { data } = await axios.post(url, { data: payload }, { headers })
      if (data.success) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        return data.token
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
      console.log("Something went wrong!")
    }
  }

  const getCapacityDelegationAuthSig = async (token: string) => {
    try {
      const url = `${import.meta.env.VITE_APP_API_BASE_URL}/user/capacity`
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const { data } = await axios.get(url, { headers })
      if (data.success) {
        return data.capacityDelegationAuthSig
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
      console.log("Something went wrong!")
    }
  }

  async function handleLogout() {
    const litSignature = localStorage.getItem("signature")
    if (!litSignature) {
      try {
        await disconnectAsync();
      } catch (err) {
          console.error(err);
      }
    }
    const smartprofileData = localStorage.getItem("smartProfileData")
    const tool = localStorage.getItem("tool")
    localStorage.clear();
    localStorage.setItem("smartProfileData", smartprofileData || '')
    localStorage.setItem("tool", tool || '')
    handleStepper("initial")
    navigate('/', { replace: true });
    message.error("Something went wrong, please contact the team")
}

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
