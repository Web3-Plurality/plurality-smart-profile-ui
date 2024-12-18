import { CLIENT_ID } from "../../utils/EnvConfig";
import { getLocalStorageValueofClient } from "../../utils/Helpers";
import { litDecryptData } from "./litDecryption";
import { metamaskDecryptData } from "./metamaskDecryption";

export const decryptData = async (encryptedData: string) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { signature: sessionSigs } = getLocalStorageValueofClient(`clientID-${clientId}`)
    let decryptionResult;
    if (sessionSigs) {
        if (encryptedData) {
            const result = await litDecryptData(sessionSigs, JSON.parse(encryptedData).ciphertext, JSON.parse(encryptedData).dataToEncryptHash);
            if (result && typeof result === 'object') {
                decryptionResult = JSON.parse(result.decryptedMessage);
            } else {
                throw new Error("Invalid result fom Lit decryption");
            }
        }
    } else {
        const result = await metamaskDecryptData(encryptedData)
        if (result.code && result.code === -32603) {
            return result
        }
        decryptionResult = JSON.parse(result)

    }
    return decryptionResult
}