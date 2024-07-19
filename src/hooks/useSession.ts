import { useCallback, useState } from 'react';
import { AuthCallbackParams, AuthMethod } from '@lit-protocol/types';
import { getSessionSigs, litNodeClient } from '../common/lit';
import { LitAbility, LitActionResource } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { ethers } from 'ethers';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';

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
          domain:window.location.host
        });

        const pkpAuthNeededCallback = async (params:AuthCallbackParams) => {
          console.log(params.expiration);
          console.log(params.resources);
          console.log(params.resourceAbilityRequests);
          console.log(params.statement);
          // -- validate
          if (!params.expiration) {
            throw new Error('expiration is required');
          }
  
          if (!params.resources) {
            throw new Error('resources is required');
          }
  
          const response = await litNodeClient.signSessionKey({
            statement: 'Free the web!',
            authMethods: [authMethod],  // authMethods for signing the sessionSigs
            pkpPublicKey: pkp.publicKey,  // public key of the wallet which is delegated
            expiration: params.expiration,
            resources: params.resources,
            chainId: 1,
          });
  
          return response.authSig;
        };
        
        // Prepare session sigs params
        const chain = 'ethereum';
        const resourceAbilities = [
          {
            resource: new LitActionResource('*'),
            ability: LitAbility.PKPSigning,
          },
        ];
        const expiration = new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7
        ).toISOString(); // 1 week

        // Generate session sigs
        const sessionSigs = await getSessionSigs({
          pkpPublicKey: pkp.publicKey,
          authMethod,
          //@ts-ignore
          sessionSigsParams: {
            chain,
            expiration,
            resourceAbilityRequests: resourceAbilities,
            authNeededCallback: pkpAuthNeededCallback,
            capacityDelegationAuthSig,
          },
        });

        setSessionSigs(sessionSigs);

        // Example of how to create a pkp wallet
        // const pkpWallet = new PKPEthersWallet({
        //   controllerSessionSigs: sessionSigs,
        //   pkpPubKey: pkp.publicKey,
        //   litNetwork: 'habanero',
        //   debug: true
        // });
        // await pkpWallet.init();
  
        // const signature = await pkpWallet.signMessage('Free the web!');  // -----> this returns timeout
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
