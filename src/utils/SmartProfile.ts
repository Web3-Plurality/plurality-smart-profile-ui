import axios from "axios";
import { encryptData } from "../services/EncryptionDecryption/encryption"
import { API_BASE_URL, CLIENT_ID } from "./EnvConfig";
import { deserializeSmartProfile, getLocalStorageValueofClient } from "./Helpers"
import { updateSmartProfile} from "../services/orbisMap/updateQuery";
import { insertSmartProfile} from "../services/orbisMap/insertQueries";

export const createSmartProfileAction = async (profileTypeStreamId: string, logoutUser: () => void) =>{
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
        // data.smartProfile.privateData=''
        const insertionResult = await insertSmartProfile(data.smartProfile, token, logoutUser)

        // save smart profile in local storage along with the returned stream id
        await deserializeSmartProfile(insertionResult, privateDataObj);
        const {id, ...rest} = insertionResult
        if (insertionResult) {
            const objData = {
                streamId: id,
                data: { smartProfile: rest }
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

export const resetSmartProfileAction = async (profileTypeStreamId: string, streamId: string, logoutUser: () => void) =>{
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
        const updationResult = await updateSmartProfile(data.smartProfile, streamId, token, logoutUser)
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

export const updateSmartProfileAction = async (profileTypeStreamId: string, smartProfile: any, handleLogoutUser: () => void) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { signature: litSignature, token } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const streamData = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    if (!litSignature) {
        console.log("Lit signatures not found")
    }
    const privateDataObj = smartProfile.privateData
    const encryptedPrivateData = await encryptData(JSON.stringify(privateDataObj))
    smartProfile.privateData = encryptedPrivateData
    const updationResult = await updateSmartProfile(smartProfile, streamData.smartProfileData.streamId, token, handleLogoutUser)
    // save smart profile in local storage along with the returned stream id
    if (updationResult) {
        await deserializeSmartProfile(updationResult, privateDataObj);
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

export const updatePublicSmartProfileAction = async (profileTypeStreamId: string, smartProfile: any, logoutUser: () => void) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const streamData = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
    const updationResult = await updateSmartProfile(smartProfile, streamData.smartProfileData.streamId, token, logoutUser)
    console.log("Updation result", updationResult)
    // save smart profile in local storage along with the returned stream id
    if (updationResult) {
        await deserializeSmartProfile(updationResult);
        const { id, ...rest } = updationResult;
        const objData = {
            streamId: id,
            data: { smartProfile: rest }
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
