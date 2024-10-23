import { ethers, verifyMessage } from 'ethers';
import React, { useEffect } from 'react';

const EventListener: React.FC = () => {
    const receiveMessage = async (event: MessageEvent) => {
        const parentUrl = window.location.ancestorOrigins.length > 0 ? window.location.ancestorOrigins[0] : window.location.origin
        console.log("Inside EventListener", event.origin, parentUrl, event.data.type)
        if (event.origin === parentUrl && event.data.type === 'metamaskRequest') {
            const data = event.data;
            let signer = null;

            let provider;
            if (window.ethereum == null) {
                console.log("Please install metamask");
                window.parent.postMessage({ type: 'noEthersProvider', data: "Please install metamask" }, parentUrl);
                return;
            } else {
                try {
                    provider = new ethers.BrowserProvider(window.ethereum);
                    signer = await provider.getSigner();
                }
                catch (error) {
                    console.log((error as Error).toString())
                    window.parent.postMessage({ type: 'noEthersProvider', data: (error as Error).toString() }, parentUrl);
                    return;
                }
            }

            if (data.method === 'getAllAccounts') {
                try {
                    const accounts = await provider.listAccounts();
                    window.parent.postMessage({ id: data.id, eventName: 'getAllAccounts', data: accounts }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getConnectedAccount') {
                try {
                    const accounts = await provider.listAccounts();
                    window.parent.postMessage({ eventName: 'getConnectedAccount', data: accounts[0] }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }

            else if (data.method === 'getMessageSignature' && data.message) {
                try {
                    const signature = await signer.signMessage(data.message);
                    window.parent.postMessage({ eventName: 'getMessageSignature', data: signature }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'verifyMessageSignature' && data.signature && data.message) {
                try {
                    const signerAddress = verifyMessage(data.message, data.signature);
                    if (signerAddress == await signer.getAddress()) {
                        window.parent.postMessage({ eventName: 'verifyMessageSignature', data: "true" }, parentUrl);
                    }
                    else {
                        window.parent.postMessage({ eventName: 'verifyMessageSignature', data: "false" }, parentUrl);
                    }
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getBalance') {
                try {
                    const connectedAddress = await signer.getAddress();
                    console.log("Connected address: " + connectedAddress)
                    const balance = await provider.getBalance(connectedAddress);
                    window.parent.postMessage({ eventName: 'getBalance', data: balance.toString() + 'n' }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'sendTransaction' && data.sendTo && data.value) {
                try {
                    //let connectedAddress= await signer.getAddress();
                    // TODO : Error handling - value > 0 , address valid
                    const tx = await signer.sendTransaction({
                        to: data.sendTo,
                        value: data.value
                    });
                    const receipt = await tx.wait();
                    console.log(receipt);
                    window.parent.postMessage({ eventName: 'sendTransaction', data: receipt!.toString() }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getBlockNumber') {
                try {
                    const blockNumber = await provider.getBlockNumber();
                    window.parent.postMessage({ eventName: 'getBlockNumber', data: blockNumber }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getTransactionCount' && data.address) {
                try {
                    const transactionCount = await provider.getTransactionCount(data.address);
                    window.parent.postMessage({ eventName: 'getTransactionCount', data: transactionCount }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'readFromContract' && data.contractAddress && data.abi && data.methodName) {
                // to be implemented
                const contract = new ethers.Contract(data.contractAddress, data.abi, provider);
                if (!contract[data.methodName]) {
                    window.parent.postMessage({ eventName: 'readFromContract', data: "Method name does not exist on this contract" }, parentUrl);
                    throw new Error(`Method ${data.methodName} does not exist on the contract.`);
                }
                try {
                    let result;
                    if (!data.methodParams) {
                        result = await contract[data.methodName]();
                    }
                    else {
                        result = await contract[data.methodName](...data.methodParams);
                    }
                    window.parent.postMessage({ eventName: 'readFromContract', data: result.toString() }, parentUrl);
                } catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'writeToContract' && data.contractAddress && data.abi && data.methodName) {
                const contract = new ethers.Contract(data.contractAddress, data.abi, signer);
                if (!contract[data.methodName]) {
                    window.parent.postMessage({ eventName: 'writeToContract', data: "Method name does not exist on this contract" }, parentUrl);
                    throw new Error(`Method ${data.methodName} does not exist on the contract.`);
                }
                try {
                    let result;
                    if (!data.methodParams) {
                        result = await contract[data.methodName]();
                    }
                    else {
                        result = await contract[data.methodName](...data.methodParams);
                    }
                    window.parent.postMessage({ eventName: 'writeToContract', data: JSON.stringify(result) }, parentUrl);
                } catch (error) {
                    console.error(error);
                    window.parent.postMessage({ eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
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
    }, []); // Empty dependency array ensures the effect runs only once
    return <div></div>;
};

export default EventListener;