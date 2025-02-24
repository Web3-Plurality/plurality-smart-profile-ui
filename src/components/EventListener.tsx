import React, { useEffect } from 'react';
import { getLocalStorageValueofClient, getParentUrl, handleLocalStorageOnLogout, redirectUserOnLogout} from '../utils/Helpers';
import { CLIENT_ID } from '../utils/EnvConfig';
import { useNavigate } from 'react-router-dom';
import { useStepper } from '../hooks/useStepper';
import { updatePublicSmartProfileAction, updateSmartProfileAction } from '../utils/SmartProfile';
import { useDispatch } from 'react-redux';
import { setContractData, setProfileDataID, setSignatureMessage, setTransactionData } from '../Slice/userDataSlice';
import { getAccount, getBalance, getTransactionCount, readFromContract, verifyMessageSignature } from '../services/ethers/ethersService';
import { sendExtentedPublicData, sendProfileConnectedEvent, sendUserDataEvent } from '../utils/sendEventToParent';

const EventListener: React.FC = () => {
    const queryParams = new URLSearchParams(location.search);
    const appClientId = queryParams.get('client_id')
    const clientId = appClientId || CLIENT_ID;

    const { goToStep, resetSteps } = useStepper()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const receiveMessage = async (event: MessageEvent) => {
        const parentUrl = getParentUrl()
        if (event.origin === parentUrl) {
            const data = event.data;
            if (data.method === 'getMessageSignature' && data.message) {
                const signatureData = {
                    message: data.message,
                    id: data.id
                }
                dispatch(setSignatureMessage(signatureData))
                goToStep('signing')
            } else if (data.method === 'sendTransaction') {
                dispatch(setTransactionData(data))
                goToStep('transaction')
            } else if (data.method === 'writeToContract') {
                dispatch(setContractData(data))
                goToStep('contract')
            } else if (data.method === 'updateConsentData') {
                dispatch(setProfileDataID(data.id))
                goToStep('consent')
            } else if (data.method === 'getSmartProfile') {
                sendUserDataEvent(data.id, 'get')
            } else if (data.method === 'getLoginInfo') {
                sendProfileConnectedEvent(data.id)
            } else if (data.method === 'getAppData') {
                sendExtentedPublicData(data.id)
            } else if (data.method === 'setAppData') {
                try {

                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)

                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    const smartProfile = smartProfileData.data.smartProfile
                    const extendedPublicData = smartProfile.extendedPublicData;

                    const parsedData = JSON.parse(data?.message)


                    if (extendedPublicData[clientId]) {
                        extendedPublicData[clientId] = {
                            ...extendedPublicData[clientId],
                            ...parsedData,
                        };
                    } else {
                        extendedPublicData[clientId] = { ...parsedData, consent: 'not given' };
                    }
                    await updatePublicSmartProfileAction(profileTypeStreamId, smartProfile)
                    window.parent.postMessage({ id: data.id, eventName: 'setAppData', data: "recieved" }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getAllAccounts') {
                try {
                    const account = await getAccount();
                    window.parent.postMessage({ id: data.id, eventName: 'getAllAccounts', data: [account] }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getConnectedAccount') {
                try {
                    const account = await getAccount();
                    window.parent.postMessage({ id: data.id, eventName: 'getConnectedAccount', data: account }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'verifyMessageSignature' && data.signature && data.message) {
                try {
                    const result = await verifyMessageSignature(data)
                    if (result) {
                        window.parent.postMessage({ id: data.id, eventName: 'verifyMessageSignature', data: "true" }, parentUrl);
                    }
                    else {
                        window.parent.postMessage({ id: data.id, eventName: 'verifyMessageSignature', data: "false" }, parentUrl);
                    }
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getBalance') {
                try {
                    const balance = await getBalance('https://eth-sepolia.public.blastapi.io');
                    window.parent.postMessage({ id: data.id, eventName: 'getBalance', data: balance!.toString() + 'n' }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getBlockNumber') {
                try {
                    //This method doesnt exist
                    window.parent.postMessage({ id: data.id, eventName: 'getBlockNumber', data: "not available yet" }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getTransactionCount' && data.address) {
                try {
                    const transactionCount = await getTransactionCount(data);
                    window.parent.postMessage({ id: data.id, eventName: 'getTransactionCount', data: transactionCount }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            // else if (data.method === 'switchNetwork' && data.rpc && data.chain_id) {
            //     try {
            //         localStorage.setItem(`rpc`, data.rpc)
            //         localStorage.setItem(`chainId`, data.chain_id)
            //         const returnMsg = "successfully switched rpc to: " + data.rpc + ", and chainId to: " + data.chain_id
            //         window.parent.postMessage({ id: data.id, eventName: 'switchNetwork', data: returnMsg }, parentUrl);
            //     }
            //     catch (error) {
            //         console.error(error);
            //         window.parent.postMessage({ id: data.id, eventName: 'switchNetwork', data: (error as Error).toString() }, parentUrl);
            //     }
            // }
            else if (data.method === 'readFromContract' && data.address && data.abi && data.method_name) {
                try {
                    const response = await readFromContract(data);
                    console.log("contract read response: ", response)
                    window.parent.postMessage({ id: data.id, eventName: 'readFromContract', data: response!.toString() }, parentUrl);
                } catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'readFromContract', data: (error as Error).toString() }, parentUrl);
                }
            }
            // else if (data.method === 'writeToContract' && data.address && data.abi && data.method_name && data.method_params) {
            //     try {
            //         const response = await writeToContract(data);
            //         console.log("contract write response: ", response)
            //         window.parent.postMessage({ id: data.id, eventName: 'writeToContract', data: response!.toString() }, parentUrl);
            //     } catch (error) {
            //         console.error(error);
            //         window.parent.postMessage({ id: data.id, eventName: 'writeToContract', data: (error as Error).toString() }, parentUrl);
            //     }
            // }
            // EAS Event
            else if (data.method === 'setPublicData') {
                try {
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    const smartProfile = smartProfileData.data.smartProfile
                    smartProfile.extendedPublicData[data?.key] = data?.value;
                    await updatePublicSmartProfileAction(profileTypeStreamId, smartProfile)
                    window.parent.postMessage({ id: data.id, eventName: 'setPublicData', data: "recieved" }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getPublicData') {
                try {

                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData: localSmartProfile } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    if (localSmartProfile?.data?.smartProfile?.extendedPublicData[data?.key]) {
                        window.parent.postMessage({ id: data.id, eventName: 'getPublicData', data: localSmartProfile?.data?.smartProfile?.extendedPublicData[data?.key] }, parentUrl);
                    } else {
                        window.parent.postMessage({ id: data.id, eventName: 'getPublicData', data: "no data found against this key" }, parentUrl);
                    }
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'setPrivateData') {
                try {
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    const smartProfile = smartProfileData.data.smartProfile
                    smartProfile.privateData.extendedPrivateData[data?.key] = data?.value;
                    await updateSmartProfileAction(profileTypeStreamId, smartProfile)
                    window.parent.postMessage({ id: data.id, eventName: 'setPrivateData', data: "recieved" }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getPrivateData') {
                try {
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    const smartProfile = smartProfileData.data.smartProfile
                    if (smartProfile.privateData.extendedPrivateData[data?.key]) {
                        window.parent.postMessage({ id: data.id, eventName: 'getPrivateData', data: smartProfile.privateData.extendedPrivateData[data?.key] }, parentUrl);
                    } else {
                        window.parent.postMessage({ id: data.id, eventName: 'getPrivateData', data: "no data found against this key" }, parentUrl);
                    }
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (event.data.type === 'logoutRequest') {
                window.parent.postMessage({ eventName: 'litConnection', data: { isConnected: false } }, parentUrl);

                handleLocalStorageOnLogout(clientId)

                const redirectPath = redirectUserOnLogout(clientId, appClientId)

                resetSteps()
                navigate(redirectPath, { replace: true });
                window.location.reload()
            }
            // else if (data.method === 'fetchNetwork') {
            //     try {
            //         const rpc = localStorage.getItem(`rpc`) ?? "https://chain-rpc.litprotocol.com/http"
            //         const chain_id = localStorage.getItem(`chainId`) ?? "175177"
            //         window.parent.postMessage({ id: data.id, eventName: 'fetchNetwork', data: {rpc, chain_id} }, parentUrl);
            //     }
            //     catch (error) {
            //         console.error(error);
            //         window.parent.postMessage({ id: data.id, eventName: 'fetchNetwork', data: (error as Error).toString() }, parentUrl);
            //     }
            // }
            else if (event.data.type === 'goToStep') {
                const { step } = event.data

                if (step) {
                    goToStep(step)
                }
            }
        }
    };
    useEffect(() => {
        window.addEventListener('message', receiveMessage, false);
        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, []);
    return <div></div>;
};

export default EventListener;