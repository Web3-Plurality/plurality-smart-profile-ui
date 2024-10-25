import { litDecryptData } from "./litDecryption";
import { metamaskDecryptData } from "./metamaskDecryption";

export const decryptData = async (encryptedData: string) => {
    let decryptionResult;
    const sessionSigs = localStorage.getItem("signature")
    if (sessionSigs) {
        if (encryptedData) {
            const result = await litDecryptData(JSON.parse(sessionSigs), JSON.parse(encryptedData).ciphertext, JSON.parse(encryptedData).dataToEncryptHash);
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
        console.log("Resulst", result)
        decryptionResult = JSON.parse(result)

    }
    return decryptionResult
}