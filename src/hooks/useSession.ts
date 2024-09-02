import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { litNodeClient } from '../common/lit';
import { LitAbility, LitPKPResource } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const { setUser } = useAuth()


  /**
   * Generate session sigs and store new session data
   */
  const initSession = useCallback(
    async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try{
        
      const authToken = await userAuthorization(pkp.ethAddress)
      const capacityDelegationAuthSig = await getCapacityDelegationAuthSig(authToken)
  
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

        console.log("✅ Got PKP Session Sigs");

        setSessionSigs(sessionSigs);

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
      }
    } catch (err) {
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
      console.log("Dataa", data)
      if (data.success) {
        return data.capacityDelegationAuthSig
      }
    } catch (err) {
      console.log("Something went wrong!")
    }
  }

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
