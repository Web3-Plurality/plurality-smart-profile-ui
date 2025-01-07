import { CLIENT_ID } from "../../utils/EnvConfig";
import { getLocalStorageValueofClient } from "../../utils/Helpers";
import { litEncryptData } from "./litEncryption"

export const encryptData = async (dataToEncrypt: string) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { signature: sessionSigs } = getLocalStorageValueofClient(`clientID-${clientId}`)
    if (sessionSigs) {
        const result = await litEncryptData(dataToEncrypt)
        return result
    } else {
        console.log('Lit signatures not found')
    }
}