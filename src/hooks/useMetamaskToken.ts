/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { message } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import { connectOrbisDidPkh } from '../services/orbis/getOrbisDidPkh';
import { AuthUserInformation } from '@useorbis/db-sdk';
import { useNavigate } from 'react-router-dom';
import { isProfileConnectPlatform, isRsmPlatform } from '../utils/Helpers';
import { domain, origin, statement } from '../utils/Constants';
import { useDispatch } from 'react-redux';
import { resetSteps } from '../Slice/stepperSlice';


export const useMetamaskToken = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [ceramicError, setCeramicError] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { address } = useAccount();
    const { disconnectAsync } = useDisconnect();

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
                localStorage.setItem('tool', 'metamask');
                return { message, signature };
            } catch (err: unknown) {
                if (err && typeof err === 'object') {
                    const errorWithCode = err as { code: number };
                    if (errorWithCode.code === 4001) {
                        setError(true);
                    }
                }
            }
        }
    }, [createSiweMessage]);

    // Handle MetaMask sign-in using nonce
    const generateMetamaskToken = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/user/auth/siwe/login`, { address });
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

            const { data } = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/user/auth/siwe/authenticate`,
                { address, clientId: localStorage.getItem("clientId") },
                { headers }
            );

            const { success, user } = data;

            if (success) {
                console.log('User: ', user)
                localStorage.setItem('token', data.token)
                const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
                if (result === "error") {
                    // Handle error case if needed
                    console.error("Error connecting to Orbis");
                    setCeramicError(true)
                } else if (result && result.did) {
                    localStorage.setItem('userDid', JSON.stringify(result?.did))
                    setCeramicError(false)
                } else {
                    setCeramicError(true)
                }
            } else {
                handleLogout();
            }
        } catch (err) {
            handleLogout();
            console.error("Error posting signature response:", err);
        }
    }, [address]);

    async function handleLogout() {
        const litSignature = localStorage.getItem("signature")
        if (!litSignature) {
            try {
                await disconnectAsync();
            } catch (err) {
                console.error(err);
            }
        }
        const smartprofileData = localStorage.getItem("smartProfileData")
        const tool = localStorage.getItem("tool")
        const clientId = localStorage.getItem("clientId")
        localStorage.clear();
        localStorage.setItem("smartProfileData", smartprofileData || '')
        localStorage.setItem("tool", tool || '')
        let path = '/'
        if (isRsmPlatform()) {
            path = `/rsm?clientId=${clientId}`;
        } else if (isProfileConnectPlatform()) {
            path = `/profile-connect?clientId=${clientId}`;
        }

        dispatch(resetSteps())
        navigate(path, { replace: true });
        message.error("Something went wrong, please contact the team")
    }

    return {
        generateMetamaskToken,
        isLoading,
        error,
        ceramicError,
        setError,
        setCeramicError
    };
};
