import { useState } from 'react'
import { encryptData, RouteMapper } from './utils'
import { BASE_URL } from './constants'
import axios from 'axios'
import { useMetamaskPublicKey } from '../hooks/useMetamaskPublicKey'
import { autoConnect, insertIndividualProfile, insertSmartProfile } from './orbis'

export const useRegisterEvent = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')


    const { getPublicKey } = useMetamaskPublicKey()

    const registerEvent = async (appName: string) => {
        try {
            const evtSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/register-event`, { withCredentials: true });
            evtSource.onmessage = function (event) {
                const { message, app, id, auth } = JSON.parse(event?.data);
                setMessage(message);
                setApp(app);
                console.log('Message: ', event.data)
                if (message === "received") {
                    fetchUserInfo(app, auth)
                } else {
                    socialConnect(id, appName)
                }
            };

            evtSource.onerror = function (err) {
                console.error('EventSource failed:', err);
                setError('EventSource failed'); // Ensure you're setting the error correctly
                evtSource.close();
            };

            return () => {
                evtSource.close();
            };
        } catch (error) {
            console.error('Error setting up EventSource:', error);
        }
    };


    const socialConnect = (id: string, appName: string) => {
        const AppRoute = RouteMapper(appName)
        const newWindow = window.open(`/auth-start?sse_id=${id}&route=${AppRoute}`, `oauth-${appName}`, 'width=500,height=600');
        if (!newWindow) {
            alert('Failed to open window. It might be blocked by a popup blocker.');
        }
    }

    const fetchUserInfo = async (appName: string, auth: string) => {
        const AppRoute = RouteMapper(appName)
        const infoUrl = `${BASE_URL}${AppRoute}/info`
        const token = localStorage.getItem('token')
        try {
            setIsLoading(true)
            const { data } = await axios.get(infoUrl, {
                headers: {
                    'x-token-id': auth,
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.message === 'success')
                console.log(data)

            const individualProfileData = data.individualProfile
            const scores = individualProfileData.scores

            const publicKey = await getPublicKey()
            const encryptedIndividualProfile = await encryptData(JSON.stringify(data), publicKey)
            console.log("Individual profile encryption: ", encryptedIndividualProfile)
            await autoConnect()
            const individualresult = await insertIndividualProfile(JSON.stringify(encryptedIndividualProfile), JSON.stringify(scores), '1', data.app)

            if (individualresult) {
                const token = localStorage.getItem('token')
                const localSmartProfile = localStorage.getItem('smartProfileData')
                let payload;

                if (localSmartProfile) {
                    payload = JSON.parse(localSmartProfile).data.smartProfile
                }

                const { data: smartProfileResponse } = await axios.post(`${BASE_URL}/user/smart-profile`, { smartProfile: payload }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (smartProfileResponse.success) {
                    console.log("Data of smart profile: ", smartProfileResponse)
                    const litSignature = localStorage.getItem("signature")
                    let publicKey;
                    if (!litSignature) {
                        publicKey = await getPublicKey()
                    }
                    const result = await encryptData(JSON.stringify(smartProfileResponse), publicKey)
                    console.log("encryption result: ", result)
                    //const decryptedData = decryptData(JSON.stringify(result), '')
                    //console.log("encryption result: ", decryptedData)
                    await autoConnect()
                    const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(smartProfileResponse.smartProfile.scores), '1', JSON.stringify(smartProfileResponse.smartProfile.connected_profiles))
                    console.log("insertion result: ", insertionResult)
                    // save smart profile in local storage along with the returned stream id
                    if (insertionResult) {
                        const objData = {
                            streamId: insertionResult?.id,
                            data: smartProfileResponse
                        }
                        localStorage.setItem('smartProfileData', JSON.stringify(objData))
                        // setLoading(false)
                    }
                }
            }
        } catch (err) {
            setError('Error')
        } finally {
            setIsLoading(false)
        }
    }



    return {
        message,
        app,
        isLoading,
        error,
        registerEvent,
    }

}


