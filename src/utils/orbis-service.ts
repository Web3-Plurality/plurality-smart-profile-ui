import { encryptData } from "../services/EncryptionDecryption/encryption"
import { updatePublicDataSmartProfile, updateSmartProfile } from "../services/orbis/updateQuery";
import { CLIENT_ID } from "./EnvConfig";
import { deserializeSmartProfile, getLocalStorageValueofClient, reGenerateUserDidAddress } from "./Helpers"



export const updateSmartProfileAction = async (profileTypeStreamId: string, smartProfile: any) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { signature: litSignature } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const streamData = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    if (!litSignature) {
        console.log("Lit signatures not found")
    }
    const privateDataObj = smartProfile.privateData
    const encryptedPrivateData = await encryptData(JSON.stringify(privateDataObj))
    smartProfile.privateData = encryptedPrivateData
    await reGenerateUserDidAddress()
    const updationResult = await updateSmartProfile(smartProfile, streamData.smartProfileData.streamId)
    // save smart profile in local storage along with the returned stream id
    if (updationResult) {
        await deserializeSmartProfile(smartProfile, privateDataObj);
        const objData = {
            streamId: updationResult?.id,
            data: { smartProfile: smartProfile }
        }
        const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
        let existingData = existingDataString ? JSON.parse(existingDataString) : {}

        existingData = {
            ...existingData,
            smartProfileData: objData,
        }
        localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
    }
}



export const updatePublicDataSmartProfileAction = async (profileTypeStreamId: string, smartProfile: any) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { signature: litSignature } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const streamData = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    if (!litSignature) {
        console.log("Lit signatures not found")
    }

    await reGenerateUserDidAddress()
    const updationResult = await updatePublicDataSmartProfile(smartProfile, streamData.smartProfileData.streamId)
    // save smart profile in local storage along with the returned stream id
    if (updationResult) {
        await deserializeSmartProfile(smartProfile);
        const objData = {
            streamId: updationResult?.id,
            data: { smartProfile: smartProfile }
        }
        const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
        let existingData = existingDataString ? JSON.parse(existingDataString) : {}

        existingData = {
            ...existingData,
            smartProfileData: objData,
        }
        localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
    }
}
