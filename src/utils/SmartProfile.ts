import axios from "axios";
import { API_BASE_URL, CLIENT_ID } from "./EnvConfig";
import { deserializeSmartProfile, getLocalStorageValueofClient, safeParseLocalStorage } from "./Helpers"

export const createSmartProfileAction = async (
    profileTypeStreamId: string,
    logoutUser: () => void
): Promise<{ success: boolean; error?: string }> => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)

    try {
        const { data } = await axios.post(`${API_BASE_URL}/user/smart-profile`, { smartProfile: {}}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'x-profile-type-stream-id': profileTypeStreamId,
                'x-client-app-id': clientId,
            }
        })
        if (data.success) {
            const privateDataObj = data.smartProfile.privateData
            // Save smart profile in local storage with attestation UID as identifier
            await deserializeSmartProfile(data.smartProfile, privateDataObj);
            const objData = {
                attestationUID: data.smartProfile.onchainAttestationUID,
                data: { smartProfile: data.smartProfile }
            }
            const existingData = safeParseLocalStorage(`streamID-${profileTypeStreamId}`)
            existingData.smartProfileData = objData
            localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
            return { success: true };
        }
        return { success: false, error: 'Profile creation failed' };
    } catch (err: any) {
        if (err?.response?.status === 402) {
            return { success: false, error: 'insufficient_credits' };
        }
        return { success: false, error: err?.message || 'Unknown error' };
    }
}  

export const resetSmartProfileAction = async (profileTypeStreamId: string, attestationUID: string, logoutUser: () => void) =>{
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
        // Save smart profile in local storage with attestation UID as identifier
        await deserializeSmartProfile(data.smartProfile, privateDataObj);
        const objData = {
            attestationUID: data.smartProfile.onchainAttestationUID,
            data: { smartProfile: data.smartProfile }
        }
        const existingData = safeParseLocalStorage(`streamID-${profileTypeStreamId}`)
        existingData.smartProfileData = objData
        localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
    }
}

export const updateSmartProfileAction = async (profileTypeStreamId: string, smartProfile: any, handleLogoutUser: () => void) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)

    // Call backend to update profile and create new attestation (with plain privateData)
    const { data } = await axios.put(`${API_BASE_URL}/user/smart-profile`, { smartProfile: smartProfile }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'x-profile-type-stream-id': profileTypeStreamId,
            'x-client-app-id': clientId,
        }
    })

    // Save smart profile in local storage with attestation UID as identifier
    if (data.success) {
        const privateDataObj = data.smartProfile.privateData
        await deserializeSmartProfile(data.smartProfile, privateDataObj);
        const objData = {
            attestationUID: data.smartProfile.onchainAttestationUID,
            data: { smartProfile: data.smartProfile }
        }
        const existingData = safeParseLocalStorage(`streamID-${profileTypeStreamId}`)
        existingData.smartProfileData = objData
        localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))

        // Store privateData to backend (now stored in Sapphire confidential contract)
        if (privateDataObj && Object.keys(privateDataObj).length > 0) {
            try {
                await axios.post(`${API_BASE_URL}/user/smart-profile/store-private-data`, {
                    privateData: privateDataObj
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-profile-type-stream-id': profileTypeStreamId,
                        'x-client-app-id': clientId,
                    }
                })
                console.log("=== privateData stored to Sapphire ===")
            } catch (storeError) {
                console.error("Failed to store privateData:", storeError)
                // Don't fail the whole operation - attestation already succeeded
            }
        }
    }
}

// export const updatePublicSmartProfileAction = async (profileTypeStreamId: string, smartProfile: any, logoutUser: () => void) => {
//     const queryParams = new URLSearchParams(location.search);
//     const clientId = queryParams.get('client_id') || CLIENT_ID;
//     const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
//     const streamData = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
//     const updationResult = await updateSmartProfile(smartProfile, streamData.smartProfileData.streamId, token, logoutUser)
//     console.log("Updation result", updationResult)
//     // save smart profile in local storage along with the returned stream id
//     if (updationResult) {
//         await deserializeSmartProfile(updationResult);
//         const { id, ...rest } = updationResult;
//         const objData = {
//             streamId: id,
//             data: { smartProfile: rest }
//         }
//         const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
//         let existingData = existingDataString ? JSON.parse(existingDataString) : {}

//         existingData = {
//             ...existingData,
//             smartProfileData: objData,
//         }
//         localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
//     }
// }
