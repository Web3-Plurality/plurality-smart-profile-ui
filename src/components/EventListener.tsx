import React, { useEffect } from 'react';
import { getLocalStorageValueofClient, getParentUrl, handleLocalStorageOnLogout, isProfileConnectPlatform, isRsmPlatform, reGenerateUserDidAddress } from '../utils/Helpers';
import { useDisconnect } from 'wagmi';
import { CLIENT_ID } from '../utils/EnvConfig';
import { useNavigate } from 'react-router-dom';
import { useStepper } from '../hooks/useStepper';
import { generatePkpWalletInstance } from '../services/orbis/generatePkpWallet';
import * as ethersV5 from 'ethers-v5'
import { updatePublicSmartProfileAction, updateSmartProfileAction } from '../utils/SmartProfile';

const EventListener: React.FC = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { disconnectAsync } = useDisconnect();
    const { resetSteps } = useStepper()
    const navigate = useNavigate();

    const receiveMessage = async (event: MessageEvent) => {
        const parentUrl = getParentUrl()
        if (event.origin === parentUrl) {
            const data = event.data;
            const pkpWallet = await generatePkpWalletInstance()
            const rpc = localStorage.getItem(`rpc`)
            const chainId = localStorage.getItem(`chainId`)
            if (rpc && chainId) {
                await pkpWallet!.setRpc(rpc)
                await pkpWallet!.setChainId(Number(chainId));
            }
            if (data.method === 'getAllAccounts') {
                try {
                    // This doesnt make sense with Lit, so we return only 1 account as array
                    const account = await pkpWallet!.getAddress()
                    window.parent.postMessage({ id: data.id, eventName: 'getAllAccounts', data: [account] }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getConnectedAccount') {
                try {
                    const account = await pkpWallet!.getAddress()
                    window.parent.postMessage({ id: data.id, eventName: 'getConnectedAccount', data: account }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }

            else if (data.method === 'getMessageSignature' && data.message) {
                try {
                    const signature = await pkpWallet!.signMessage(data.message);
                    window.parent.postMessage({ id: data.id, eventName: 'getMessageSignature', data: signature }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'verifyMessageSignature' && data.signature && data.message) {
                try {
                    const signerAddress = ethersV5.utils.verifyMessage(data.message, data.signature);
                    if (signerAddress == await pkpWallet!.getAddress()) {
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
                    const balance = await pkpWallet?.getBalance();
                    window.parent.postMessage({ id: data.id, eventName: 'getBalance', data: balance!.toString() + 'n' }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }

            else if (data.method === 'sendTransaction' && data.raw_transaction) {
                try {
                    if (!data.rpc) {
                        throw new Error("rpc is empty")
                    }
                    await pkpWallet!.setRpc(data.rpc)
                    if (!data.chain_id) {
                        throw new Error("chain id is empty")
                    }
                    const raw = JSON.parse(data.raw_transaction)
                    if (!!raw.value) {
                        const bigIntValue = BigInt(raw.value)
                        raw.value = bigIntValue
                    }
                    if (!!raw.gasPrice) {
                        const bigIntGasPrice = BigInt(raw.gasPrice)
                        raw.gasPrice = bigIntGasPrice
                    }
                    if (!!raw.gasLimit) {
                        const bigIntGasLimit = BigInt(raw.gasLimit)
                        raw.gasLimit = bigIntGasLimit
                    }
                    const rawTransaction = {
                        from: await pkpWallet!.getAddress(),
                        ...raw,
                        chainId: +data.chain_id
                    }
                    const signedTransaction = await pkpWallet!.signTransaction(rawTransaction);
                    const sentTransaction = await pkpWallet!.sendTransaction(signedTransaction)
                    const receipt = await sentTransaction.wait();
                    window.parent.postMessage({ id: data.id, eventName: 'sendTransaction', data: JSON.stringify(receipt) }, parentUrl);
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
                    if (!data.rpc) {
                        throw new Error("rpc is empty")
                    }
                    await pkpWallet!.setRpc(data.rpc)
                    if (!data.chain_id) {
                        throw new Error("chain id is empty")
                    }
                    await pkpWallet!.setChainId(+data.chain_id);
                    const transactionCount = await pkpWallet?.getTransactionCount();
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
                    if (!data.rpc) {
                        throw new Error("rpc is empty")
                    }
                    await pkpWallet!.setRpc(data.rpc)
                    if (!data.chain_id) {
                        throw new Error("chain id is empty")
                    }
                    await pkpWallet!.setChainId(+data.chain_id);
                    // contract initialization           
                    let contract = new ethersV5.Contract(
                        data.address,
                        data.abi,
                        pkpWallet
                    );
                    const response = await contract[data.method_name]({
                        blockTag: "latest",
                    });
                    console.log("contract read response: ", response)
                    window.parent.postMessage({ id: data.id, eventName: 'readFromContract', data: response!.toString() }, parentUrl);
                } catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'readFromContract', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'writeToContract' && data.address && data.abi && data.method_name && data.method_params) {
                try {
                    if (!data.rpc) {
                        throw new Error("rpc is empty")
                    }
                    await pkpWallet!.setRpc(data.rpc)
                    if (!data.chain_id) {
                        throw new Error("chain id is empty")
                    }
                    await pkpWallet!.setChainId(+data.chain_id);
                    let contract = new ethersV5.Contract(
                        data.address,
                        data.abi,
                        pkpWallet
                    );
                    const methodParams = JSON.parse(data.method_params)
                    const txOptions = JSON.parse(data.options)
                    const response = await contract[data.method_name](...methodParams, {
                        ...txOptions
                    });
                    console.log("contract write response: ", response)
                    window.parent.postMessage({ id: data.id, eventName: 'writeToContract', data: response!.toString() }, parentUrl);
                } catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'writeToContract', data: (error as Error).toString() }, parentUrl);
                }
            }
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
        } else if (event.origin === parentUrl && event.data.type === 'logoutRequest') {
            console.log("Logout received", event.data)
            const { platform } = event.data

            if (platform !== 'lit') {
                try {
                    await disconnectAsync();
                } catch (err) {
                    console.error(err);
                }
                window.parent.postMessage({ eventName: 'litConnection', data: { isConnected: false } }, parentUrl);
            }

            handleLocalStorageOnLogout(clientId)

            let path = '/'
            if (isRsmPlatform()) {
                path = `/rsm?client_id=${clientId}`;
            } else if (isProfileConnectPlatform()) {
                path = `/profile-connect?client_id=${clientId}`;
            }
            resetSteps()
            navigate(path, { replace: true });
            window.location.reload()
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