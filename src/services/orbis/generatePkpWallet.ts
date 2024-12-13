import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { litNodeClient } from '../Lit';
import { getLocalStorageValueofClient } from '../../utils/Helpers';
import { CLIENT_ID } from '../../utils/EnvConfig';

export const generatePkpWalletInstance = async () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { signature: sessionSigs, pkpKey: pkp } = getLocalStorageValueofClient(`clientID-${clientId}`)

    if (sessionSigs && pkp) {
        const pkpWallet = new PKPEthersWallet({
            controllerSessionSigs: sessionSigs,
            pkpPubKey: pkp.publicKey,
            litNodeClient: litNodeClient,
            debug: true
        });
        await pkpWallet.init();
        return pkpWallet
    }
}
