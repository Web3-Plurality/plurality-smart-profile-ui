/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount } from "wagmi";
import { message } from "antd";
import { CLIENT_ID } from "../utils/EnvConfig";
import { getLocalStorageValueofClient } from "../utils/Helpers";
import { useStepper } from "./useStepper";

export const useMetamaskPublicKey = () => {

    const { address } = useAccount();
    const { goToStep } = useStepper()

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { publicKey } = getLocalStorageValueofClient(clientId)

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

            const existingDataString = localStorage.getItem(`clientID-${clientId}`)
            let existingData = existingDataString ? JSON.parse(existingDataString) : {}

            existingData = {
                ...existingData,
                publicKey: encryptionPublicKey,
            }
            localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
            return encryptionPublicKey;

        } catch (error: any) {
            if (error.code === -32603) {
                // User rejected the request
                console.log("Please connect to MetaMask.");
                goToStep('success');
            } else {
                goToStep('success');
                message.error('Something went wrong!')
                console.error("An error occurred while getting the encryption public key:", error);
            }
        }

    };

    return {
        getPublicKey
    };
};