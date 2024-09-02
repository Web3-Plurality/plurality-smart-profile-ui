/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import axios from 'axios';
import { providers } from 'ethers';
import { SiweMessage } from 'siwe';
import { useAccount } from 'wagmi';
import { useAuth } from '../context/AuthContext';

// Define constants and provider outside the hook
const domain = window.location.host;
const origin = window.location.origin;
const statement = "I am the owner of this address";

export const useMetamaskToken = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);


    const { address } = useAccount();
    const { setUser } = useAuth()



    // Create Siwe message
    const createSiweMessage = useCallback(async (address: string, nonce: string) => {
        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: 1,
            nonce
        });
        return message.prepareMessage();
    }, []);


    // Sign in with Ethereum
    const signInWithEthereum = useCallback(async (nonce: string) => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new providers.Web3Provider(window.ethereum);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                const message = await createSiweMessage(userAddress, nonce);
                const signature = await signer.signMessage(message);
                return { message, signature };
            } catch (err) {
                if (err.code === 4001) {
                    setError(true)
                }
            }
        }
    }, [createSiweMessage]);

    // Handle MetaMask sign-in using nonce
    const generateMetamaskToken = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/user/nonce/${address}`);
            if (data.nonce) {
                const signInResponse = await signInWithEthereum(data.nonce);
                if (signInResponse) {
                    const { message, signature } = signInResponse;
                    await signatureResponseApi(encodeURIComponent(message), signature);
                }
            }
        } catch (err) {
            console.error("Error during MetaMask sign-in:", err);
        } finally {
            setIsLoading(false);
        }
    }, [address, signInWithEthereum]);

    // Post signature response to API
    const signatureResponseApi = useCallback(async (msg: string, sig: string) => {
        try {
            const headersData = JSON.stringify({ 'siwe': sig, 'message': msg })
            const headers = { 'x-siwe': headersData }

            const { data } = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/user`,
                { data: { address } },
                { headers }
            );

            const { success, user } = data;

            if (success) {
                setUser(user)
                localStorage.setItem('token', data.token)
            }
        } catch (err) {
            console.error("Error posting signature response:", err);
        }
    }, [address]);

    return {
        generateMetamaskToken,
        isLoading,
        error,
        setError
    };
};
