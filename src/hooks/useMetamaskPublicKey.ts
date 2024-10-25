/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount } from "wagmi";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { goToStep } from "../Slice/stepperSlice";

export const useMetamaskPublicKey = () => {
    const { address } = useAccount();

    const publicKey = localStorage.getItem('publicKey')
    const dispatch = useDispatch()



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
            if (error.code === -32603) {
                // User rejected the request
                console.log("Please connect to MetaMask.");
                dispatch(goToStep('success'))
            } else {
                dispatch(goToStep('success'))
                message.error('Something went wrong!')
                console.error("An error occurred while getting the encryption public key:", error);
            }
        }

    };

    return {
        getPublicKey
    };
};