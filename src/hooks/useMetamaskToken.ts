/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { domain, origin, statement } from '../utils/Constants';
import { API_BASE_URL, CLIENT_ID } from '../utils/EnvConfig';
import { useLogoutUser } from './useLogoutUser';
import { useStepper } from './useStepper';
import { useDispatch } from 'react-redux';
import { setLoadingState } from '../Slice/userDataSlice';
import { deriveEncryptionKey } from '../services/EncryptionDecryption/crypto';
import { getParentUrl } from '../utils/Helpers';

function isEthereumError(err: unknown): err is { code: number; info?: { error?: { code?: number } } } {
    return typeof err === 'object' && err !== null && 'code' in err;
}

export const useMetamaskToken = (walletAddress: string) => {
    const [error, setError] = useState(false);
    const [ceramicError, setCeramicError] = useState(false);

    const dispatch = useDispatch()

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
        dispatch(setLoadingState({ loadingState: true, text: 'Connecting your Metamask account...' }))
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
                    userId: data.user.id,
                    walletAddress: walletAddress,
                }
                localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))

                // Pre-derive encryption key during login so it's cached for later use
                // This avoids a second MetaMask popup when connecting platforms
                try {
                    dispatch(setLoadingState({ loadingState: true, text: 'Setting up encryption...' }))
                    await deriveEncryptionKey(walletAddress)
                    console.log('Encryption key derived and cached successfully')
                } catch (encryptionError) {
                    console.error('Failed to derive encryption key:', encryptionError)
                    // Don't fail login if encryption key derivation fails
                    // User will be prompted again when they connect a platform
                }

                dispatch(setLoadingState({ loadingState: false, text: '' }))

                // Notify parent window (wallet repo) that user is connected
                // This sets localStorage 'lit' to true in the parent, enabling API functions
                const parentUrl = getParentUrl()
                window.parent.postMessage({
                    eventName: 'litConnection',
                    data: { isConnected: true, token: data.token }
                }, parentUrl)

                // Go directly to success - MetaMask authentication is complete
                goToStep("success")
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
        error,
        ceramicError,
        setError,
        setCeramicError
    };
};
