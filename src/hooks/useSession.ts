import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { litNodeClient } from '../common/lit';
import { LitAbility, LitPKPResource } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { ethers } from 'ethers';

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();


  /**
   * Generate session sigs and store new session data
   */
  const initSession = useCallback(
    async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        // owner wallet which has the capacity NFT
        const DAPP_OWNER_WALLET = new ethers.Wallet(import.meta.env.VITE_APP_PUBLIC_DAPP_OWNER_WALLET_PRIVATE_KEY);
        // create capacity nft delegation
        const { capacityDelegationAuthSig } =
          await litNodeClient.createCapacityDelegationAuthSig({
            uses: '1000',
            dAppOwnerWallet: DAPP_OWNER_WALLET,
            capacityTokenId: import.meta.env.VITE_APP_PUBLIC_CAPACITY_TOKEN_ID,
            delegateeAddresses: [pkp.ethAddress],
            domain: window.location.host
          });

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

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
