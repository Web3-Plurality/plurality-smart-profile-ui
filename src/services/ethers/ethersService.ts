import { message } from "antd";
import { getLocalStorageValueofClient, getParentUrl } from "../../utils/Helpers";
import { ethers } from "ethers";
import * as ethersV5 from 'ethers-v5';
import { sendUserConsentEvent } from "../../utils/sendEventToParent";
import { ContractData } from "../../types";
import { CLIENT_ID } from "../../utils/EnvConfig";

const parentUrl = getParentUrl()

interface CustomError extends Error {
    code?: string;
}

interface WriteToContractData {
    rpc: string;
    chain_id: string;
    address: string;
    abi: string;
    method_name: string;
    method_params: string;
    options: string;
}

interface VerifyMessageSignatureData {
    message: string;
    signature: string;
}

interface SendTransactionData {
    rpc?: string;
    chain_id?: string;
    raw_transaction?: string;
    id?: string;
    isWallet?: boolean
}

interface TransactionCountData {
    rpc: string;
    chain_id: string;
}

// Helper function to get MetaMask signer
const getMetaMaskSigner = async () => {
    if (!window.ethereum) {
        throw new Error('MetaMask not installed');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer;
}

// Helper function to get stored wallet address
const getStoredWalletAddress = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { walletAddress } = getLocalStorageValueofClient(`clientID-${clientId}`);
    return walletAddress;
}

export const getAccount = async () => {
    const signer = await getMetaMaskSigner();
    const account = await signer.getAddress();
    return account;
}

export const getBalance = async (rpc: string) => {
    if (!window.ethereum) {
        throw new Error('MetaMask not installed');
    }

    let provider;
    if (rpc) {
        provider = new ethers.JsonRpcProvider(rpc);
    } else {
        provider = new ethers.BrowserProvider(window.ethereum);
    }

    const address = getStoredWalletAddress() || await (await getMetaMaskSigner()).getAddress();
    const balance = await provider.getBalance(address);
    return balance;
}

export const sendTransaction = async (data: SendTransactionData) => {
    const signer = await getMetaMaskSigner();

    if (!data.rpc) {
        throw new Error("rpc is empty");
    }
    if (!data.chain_id) {
        throw new Error("chain id is empty");
    }

    try {
        const raw = JSON.parse(data.raw_transaction || '');
        if (raw.value) {
            const bigIntValue = BigInt(raw.value);
            raw.value = bigIntValue;
        }
        if (raw.gasPrice) {
            const bigIntGasPrice = BigInt(raw.gasPrice);
            raw.gasPrice = bigIntGasPrice;
        }
        if (raw.gasLimit) {
            const bigIntGasLimit = BigInt(raw.gasLimit);
            raw.gasLimit = bigIntGasLimit;
        }

        const rawTransaction = {
            ...raw,
            chainId: +data.chain_id
        };

        const sentTransaction = await signer.sendTransaction(rawTransaction);
        const receipt = await sentTransaction.wait();

        return receipt;

    } catch (error) {
        const customError = error as CustomError;
        if (customError.code === "INSUFFICIENT_FUNDS" || customError.code === "SERVER_ERROR" || customError.code === "REPLACEMENT_UNDERPRICED") {
            window.parent.postMessage({ id: data.id, eventName: !data.id ? 'walletSendTransaction' : 'errorMessage', data: customError.code }, parentUrl);
        } else {
            message.error("Something went wrong, please try again");
            window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: customError.code }, parentUrl);
        }
        sendUserConsentEvent()
    }
};




export const verifyMessageSignature = async (data: VerifyMessageSignatureData) => {
    const signer = await getMetaMaskSigner();
    const signerAddress = ethersV5.utils.verifyMessage(data.message, data.signature);
    return signerAddress.toLowerCase() === (await signer.getAddress()).toLowerCase();
}


export const getTransactionCount = async (data: TransactionCountData) => {
    if (!data.rpc) {
        throw new Error("rpc is empty")
    }
    if (!data.chain_id) {
        throw new Error("chain id is empty")
    }

    const provider = new ethers.JsonRpcProvider(data.rpc);
    const address = getStoredWalletAddress() || await (await getMetaMaskSigner()).getAddress();
    const transactionCount = await provider.getTransactionCount(address);
    return transactionCount;
}

export const readFromContract = async (data: WriteToContractData) => {
    if (!data.rpc) {
        throw new Error("rpc is empty")
    }
    if (!data.chain_id) {
        throw new Error("chain id is empty")
    }

    const provider = new ethersV5.providers.JsonRpcProvider(data.rpc);

    // contract initialization
    const contract = new ethersV5.Contract(
        data.address,
        data.abi,
        provider
    );
    const response = await contract[data.method_name]({
        blockTag: "latest",
    });
    return response;
}


export const writeToContract = async (data: ContractData | null) => {
    if (!data?.rpc) {
        throw new Error("rpc is empty")
    }
    if (!data.chain_id) {
        throw new Error("chain id is empty")
    }

    try {
        // Use MetaMask signer with ethers v5 for contract interactions
        if (!window.ethereum) {
            throw new Error('MetaMask not installed');
        }

        const provider = new ethersV5.providers.Web3Provider(window.ethereum as ethersV5.providers.ExternalProvider);
        const signer = provider.getSigner();

        const contract = new ethersV5.Contract(
            data.address,
            data.abi,
            signer
        );
        const methodParams = JSON.parse(data.method_params)
        const txOptions = JSON.parse(data.options)
        const response = await contract[data.method_name](...methodParams, {
            ...txOptions
        });
        return response;
    } catch (error) {
        const customError = error as CustomError;
        window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: customError.message }, parentUrl);
        sendUserConsentEvent()
    }

}
