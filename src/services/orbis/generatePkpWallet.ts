import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { litNodeClient } from '../Lit';

export const generatePkpWalletInstance = async () => {
    const sessionSigs = localStorage.getItem("signature")
    const pkp = localStorage.getItem("pkpKey")
    if (sessionSigs && pkp) {
        const pkpWallet = new PKPEthersWallet({
            controllerSessionSigs: JSON.parse(sessionSigs),
            pkpPubKey: JSON.parse(pkp).publicKey,
            litNodeClient: litNodeClient,
            debug: true
        });
        await pkpWallet.init();
        return pkpWallet
    }
}
