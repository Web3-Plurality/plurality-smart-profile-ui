import axios from "axios";
import { encryptData } from "../services/EncryptionDecryption/encryption"
import { updatePublicSmartProfile, updateSmartProfile } from "../services/orbis/updateQuery";
import { API_BASE_URL, CLIENT_ID } from "./EnvConfig";
import { deserializeSmartProfile, getLocalStorageValueofClient, reGenerateUserDidAddress } from "./Helpers"
import { insertSmartProfile } from "../services/orbis/insertQueries";

export const createSmartProfileAction = async (profileTypeStreamId: string) =>{
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { data } = await axios.post(`${API_BASE_URL}/user/smart-profile`, { smartProfile: {}}, {
        headers: {
            Authorization: `Bearer ${token}`,
            'x-profile-type-stream-id': profileTypeStreamId,
            'x-client-app-id': clientId,
        }
    })
    if (data.success) {
        const privateDataObj = data.smartProfile.privateData
        data.smartProfile.privateData=''
        await reGenerateUserDidAddress()
        const insertionResult = await insertSmartProfile(data.smartProfile)
        // save smart profile in local storage along with the returned stream id
        if (insertionResult) {
            await deserializeSmartProfile(data.smartProfile, privateDataObj);
            const objData = {
                streamId: insertionResult?.id,
                data: { smartProfile: data.smartProfile }
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
}  

export const resetSmartProfileAction = async (profileTypeStreamId: string, streamId: string) =>{
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { data } = await axios.post(`${API_BASE_URL}/user/smart-profile`, { smartProfile: {}}, {
        headers: {
            Authorization: `Bearer ${token}`,
            'x-profile-type-stream-id': profileTypeStreamId,
            'x-client-app-id': clientId,
        }
    })
    if (data.success) {
        const privateDataObj = data.smartProfile.privateData
        data.smartProfile.privateData=''
        await reGenerateUserDidAddress()
        const updationResult = await updateSmartProfile(data.smartProfile, streamId)
        // save smart profile in local storage along with the returned stream id
        if (updationResult) {
            await deserializeSmartProfile(data.smartProfile, privateDataObj);
            const objData = {
                streamId: updationResult?.id,
                data: { smartProfile: data.smartProfile }
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
}

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

export const updatePublicSmartProfileAction = async (profileTypeStreamId: string, smartProfile: any) => {
    const streamData = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
    await reGenerateUserDidAddress()
    const updationResult = await updatePublicSmartProfile(smartProfile, streamData.smartProfileData.streamId)
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
