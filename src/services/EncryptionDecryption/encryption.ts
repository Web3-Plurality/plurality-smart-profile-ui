import { litEncryptData } from "./litEncryption"
import { metamaskEncryptData } from "./metamaskEncryption"

export const encryptData = async (dataToEncrypt: string, publicKey: string | undefined) => {
    const sessionSigs = localStorage.getItem("signature")
    if (sessionSigs) {
        const result = await litEncryptData(dataToEncrypt)
        return result
    } else {
        if (publicKey) {
            const result = metamaskEncryptData(publicKey, dataToEncrypt)
            return result
        }
    }
}