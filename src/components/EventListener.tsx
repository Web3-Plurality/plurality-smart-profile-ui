import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { getLocalStorageValueofClient, getParentUrl, handleLocalStorageOnLogout, isProfileConnectPlatform, isRsmPlatform } from '../utils/Helpers';
import { useDisconnect } from 'wagmi';
import { CLIENT_ID } from '../utils/EnvConfig';
import { useNavigate } from 'react-router-dom';
import { useStepper } from '../hooks/useStepper';
import { generatePkpWalletInstance } from '../services/orbis/generatePkpWallet';
import * as ethersV5 from 'ethers-v5'


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
                    const signerAddress = ethers.verifyMessage(data.message, data.signature);
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

            else if (data.method === 'sendTransaction' && data.sendTo && data.amount) {
                try {  
                    const rawTransaction = {
                        from: await pkpWallet!.getAddress(),
                        to: data.sendTo,
                        value: ethers.parseEther(data.amount),
                        gasLimit: 21000,
                        gasPrice: ethers.parseUnits("50", "gwei"),
                        chainId: chainId ? Number(chainId) : 175188 // default lit testnet
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
                    const transactionCount = await pkpWallet?.getTransactionCount();
                    window.parent.postMessage({ id: data.id, eventName: 'getTransactionCount', data: transactionCount }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'switchNetwork' && data.rpc && data.chainId) {
                localStorage.setItem(`rpc`, data.rpc)
                localStorage.setItem(`chainId`, data.chainId)
            }
            else if (data.method === 'readFromContract' && data.address && data.abi && data.method_name) {
                const pkpEthersWallet = await generatePkpWalletInstance();
                await pkpEthersWallet!.setRpc("https://ethereum-sepolia.rpc.subquery.network/public")
                await pkpEthersWallet!.setChainId(11155111);
                const hardabi = '[{"inputs":[],"name":"retrieve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"store","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
                const hardaddress = "0x8E26aa0b6c7A396C92237C6a87cCD6271F67f937"
                let contract = new ethersV5.Contract(
                    hardaddress,
                    hardabi,
                    pkpEthersWallet
                );
                let response;
                response = await contract.retrieve({
                    blockTag: "latest",
                });
                console.log("contract read response: ", response)
                //readFromContract(data.address, data.abi, data.method_name, pkp.publicKey, sessionSigs, data.param)
            }
            else if (data.method === 'writeToContract' && data.address && data.abi && data.method_name) {
                const { signature: sessionSigs, pkpKey: pkp } = getLocalStorageValueofClient(`clientID-${clientId}`)
                // const v7EthersWallet = await generatePKPWallet(pkp.publicKey, sessionSigs)
                // writeToContract(data.address, data.abi, data.method_name, v7EthersWallet, data.param)
            }
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