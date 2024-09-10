/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount } from "wagmi";

export const useMetamaskPublicKey = () => {
    const { address } = useAccount();

    const publicKey = localStorage.getItem('publicKey')



    const getPublicKey = async () => {
        try {
            if (!address) {
                console.error("No accounts found. Please connect your MetaMask account.");
                return;
            }
            if (publicKey) return publicKey

            // Request the encryption public key for the active account
            const encryptionPublicKey = await window.ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [address], // Use the active account address
            });

            localStorage.setItem('publicKey', encryptionPublicKey)
            return encryptionPublicKey;

        } catch (error: any) {
            if (error.code === 4001) {
                // User rejected the request
                console.log("Please connect to MetaMask.");
            } else {
                console.error("An error occurred while getting the encryption public key:", error);
            }
        }

    };

    return {
        getPublicKey
    };
};