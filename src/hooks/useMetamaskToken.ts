/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { domain, origin, statement } from '../utils/Constants';
import { API_BASE_URL, CLIENT_ID } from '../utils/EnvConfig';
import { useLogoutUser } from './useLogoutUser';
import { useStepper } from './useStepper';

function isEthereumError(err: unknown): err is { code: number; info?: { error?: { code?: number } } } {
    return typeof err === 'object' && err !== null && 'code' in err;
}

export const useMetamaskToken = (walletAddress: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [ceramicError, setCeramicError] = useState(false);

    const handleLogoutUser = useLogoutUser()
    const { goToStep } = useStepper()

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

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
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                const message = await createSiweMessage(userAddress, nonce);
                const signature = await signer.signMessage(message);

                const existingDataString = localStorage.getItem(`clientID-${clientId}`)
                let existingData = existingDataString ? JSON.parse(existingDataString) : {}

                existingData = {
                    ...existingData,
                    tool: 'metamask',
                }
                localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
                return { message, signature };
            } catch (err: unknown) {
                if (isEthereumError(err)) {
                    if (err.code === 4001 || err.info?.error?.code === 4001) {
                        setError(true);
                    }
                }
            }
        }
    }, [walletAddress]);

    // Handle MetaMask sign-in using nonce
    const generateMetamaskToken = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/auth/siwe/login`, { address: walletAddress });
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
    }, [walletAddress]);

    // Post signature response to API
    const signatureResponseApi = useCallback(async (msg: string, sig: string) => {
        try {
            const headersData = JSON.stringify({ 'siwe': sig, 'message': msg })
            const headers = { 'x-siwe': headersData }

            const { data } = await axios.post(`${API_BASE_URL}/auth/siwe/authenticate`,
                { 
                    address: walletAddress, 
                    clientAppId: clientId 
                },
                { headers }
            );

            const { success } = data;

            if (success) {
                const existingDataString = localStorage.getItem(`clientID-${clientId}`)
                let existingData = existingDataString ? JSON.parse(existingDataString) : {}

                existingData = {
                    ...existingData,
                    token: data.token,
                }
                localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
                goToStep("verification")
            } else {
                handleLogoutUser("Authentication failed. Please try signing in again.");
            }
        } catch (err) {
            handleLogoutUser("Something went wrong. Please try again.");
            console.error("Error posting signature response:", err);
        }
    }, [walletAddress]);

    return {
        generateMetamaskToken,
        isLoading,
        error,
        ceramicError,
        setError,
        setCeramicError
    };
};
