import { message } from "antd";
import { getParentUrl } from "../../utils/Helpers";
import { generatePkpWalletInstance } from "../orbis/generatePkpWallet"
import * as ethersV5 from 'ethers-v5';

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
    rpc: string;
    chain_id: string;
    raw_transaction: string;
    id?: string;
    isWallet?: boolean
}

interface TransactionCountData {
    rpc: string;
    chain_id: string;
}


export const getAccount = async () => {
    const pkpWallet = await generatePkpWalletInstance();
    const account = await pkpWallet!.getAddress();
    return account;
}

export const getBalance = async (rpc: string) => {
    const pkpWallet = await generatePkpWalletInstance();
    if (rpc) {
        await pkpWallet!.setRpc(rpc);
    }
    const balance = await pkpWallet?.getBalance();
    return balance;
}

export const sendTransaction = async (data: SendTransactionData) => {
    const pkpWallet = await generatePkpWalletInstance();
    if (!data.rpc) {
        throw new Error("rpc is empty");
    }
    await pkpWallet!.setRpc(data.rpc);
    if (!data.chain_id) {
        throw new Error("chain id is empty");
    }

    try {
        const raw = JSON.parse(data.raw_transaction);
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
            from: await pkpWallet!.getAddress(),
            ...raw,
            chainId: +data.chain_id
        };

        const signedTransaction = await pkpWallet!.signTransaction(rawTransaction);
        const sentTransaction = await pkpWallet!.sendTransaction(signedTransaction);
        const receipt = await sentTransaction.wait();

        return receipt;

    } catch (error) {
        const customError = error as CustomError;
        if (customError.code === "INSUFFICIENT_FUNDS" || customError.code === "SERVER_ERROR") {
            if (data.isWallet) {
                message.error("Insufficient funds");
                // hmmm are we expecting the dapp to have a event listener to show the error msg?
                window.parent.postMessage({ eventName: 'walletSendTransaction', data: customError.code }, parentUrl);
            }
        } else {
            message.error("Something went wrong, please try again");
            window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: customError.code }, parentUrl);
        }
    }
};




export const verifyMessageSignature = async (data: VerifyMessageSignatureData) => {
    const pkpWallet = await generatePkpWalletInstance()
    const signerAddress = ethersV5.utils.verifyMessage(data.message, data.signature);
    return signerAddress == await pkpWallet!.getAddress()
}


export const getTransactionCount = async (data: TransactionCountData) => {
    const pkpWallet = await generatePkpWalletInstance()
    if (!data.rpc) {
        throw new Error("rpc is empty")
    }
    await pkpWallet!.setRpc(data.rpc)
    if (!data.chain_id) {
        throw new Error("chain id is empty")
    }
    await pkpWallet!.setChainId(+data.chain_id);
    const transactionCount = await pkpWallet?.getTransactionCount();
    return transactionCount
}

export const readFromContract = async (data: WriteToContractData) => {
    const pkpWallet = await generatePkpWalletInstance()
    if (!data.rpc) {
        throw new Error("rpc is empty")
    }
    await pkpWallet!.setRpc(data.rpc)
    if (!data.chain_id) {
        throw new Error("chain id is empty")
    }
    await pkpWallet!.setChainId(+data.chain_id);
    // contract initialization           
    const contract = new ethersV5.Contract(
        data.address,
        data.abi,
        pkpWallet
    );
    const response = await contract[data.method_name]({
        blockTag: "latest",
    });
    return response;
}


export const writeToContract = async (data: WriteToContractData) => {
    const pkpWallet = await generatePkpWalletInstance()
    if (!data.rpc) {
        throw new Error("rpc is empty")
    }
    await pkpWallet!.setRpc(data.rpc)
    if (!data.chain_id) {
        throw new Error("chain id is empty")
    }
    await pkpWallet!.setChainId(+data.chain_id);
    const contract = new ethersV5.Contract(
        data.address,
        data.abi,
        pkpWallet
    );
    const methodParams = JSON.parse(data.method_params)
    const txOptions = JSON.parse(data.options)
    const response = await contract[data.method_name](...methodParams, {
        ...txOptions
    });
    return response;
}