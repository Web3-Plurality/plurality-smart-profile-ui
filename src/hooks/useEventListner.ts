import { useState } from 'react'
import axios from 'axios'
import { useMetamaskPublicKey } from './useMetamaskPublicKey'
import { API_BASE_URL, CLIENT_ID } from '../utils/EnvConfig'
import { RouteMapper, getLocalStorageValueofClient, reGenerateUserDidAddress, setLocalStorageValue } from '../utils/Helpers'
import { encryptData } from '../services/EncryptionDecryption/encryption'
import { updateSmartProfile } from '../services/orbis/updateQuery'
import { setLoadingState } from '../Slice/userDataSlice'
import { useDispatch } from 'react-redux'
import { updateHeader } from '../Slice/headerSlice'
import { useStepper } from './useStepper'

export const useRegisterEvent = () => {
    const [emailId, setEmailId] = useState<string>('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')

    const { goToStep } = useStepper()
    const dispatch = useDispatch()

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    let existingData = getLocalStorageValueofClient(`clientID-${clientId}`)


    const { getPublicKey } = useMetamaskPublicKey()

    const registerEvent = async (appName: string) => {
        try {
            const evtSource = new EventSource(`${API_BASE_URL}/register-event`, { withCredentials: true });
            evtSource.onmessage = function (event) {
                console.log(JSON.parse(event?.data))
                const { message, app, id, auth, googleJwtToken, token, emailId } = JSON.parse(event?.data);
                setMessage(message);
                setApp(app);
                if (message === "received" && app === 'google' && emailId) {
                    // if emailId is comming  means this user already been logged in with stytch but now trying to login with google,
                    // so we have to redirect him to otp page
                    existingData = {
                        ...existingData,
                        emailId
                    }
                    setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(existingData))
                    goToStep('otp');
                    setEmailId(emailId)
                } else if (message === "received" && app === 'google') {
                    existingData = {
                        ...existingData,
                        token,
                        googleJwtToken
                    }
                    setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(existingData))
                    goToStep('verification');
                } else if (message === "received") {
                    fetchUserInfo(app, auth)
                } else if (appName === '') {
                    console.log("Gooogle o oauth")
                    setLocalStorageValue('sseId', id)
                    handleGoogleConnect(id)
                } else {
                    socialConnect(id, appName)
                }
            };

            evtSource.onerror = function (err) {
                console.log('Event Source error', err)
                setError('EventSource failed');
                evtSource.close();
            };

            return () => {
                evtSource.close();
            };
        } catch (error) {
            console.error('Error setting up EventSource:', error);
        }
    };

    const handleGoogleConnect = (sseID: number) => {
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2.5

        window.open(
            `${API_BASE_URL}/auth/google/login?sse_id=${sseID}`,
            "Google Authentication",
            `width=${width},height=${height},left=${left},top=${top}`
        )
    }

    const socialConnect = (id: string, appName: string) => {
        const AppRoute = RouteMapper(appName)
        const newWindow = window.open(`/auth-start?sse_id=${id}&route=${AppRoute}`, `oauth-${appName}`, 'width=500,height=600');
        if (!newWindow) {
            alert('Failed to open window. It might be blocked by a popup blocker.');
        }
    }

    const fetchUserInfo = async (appName: string, auth: string) => {
        const AppRoute = RouteMapper(appName)
        const infoUrl = `${API_BASE_URL}${AppRoute}/info`
        const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
        try {
            dispatch(setLoadingState({ loadingState: true, text: "Updating your profile" }));
            const { data } = await axios.get(infoUrl, {
                headers: {
                    'x-token-id': auth,
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.message === 'success') {
                // const individualProfileData = data.individualProfile
                // const scores = individualProfileData.scores
                // const { signature: litSignature } = getLocalStorageValueofClient(`clientID-${clientId}`)

                // let publicKey;
                // if (!litSignature) {
                //     publicKey = await getPublicKey();
                // }
                // const encryptedIndividualProfile = await encryptData(JSON.stringify(data.individualProfile), publicKey)

                // await reGenerateUserDidAddress()
                // const updationResult = await insertIndividualProfile(JSON.stringify(encryptedIndividualProfile), JSON.stringify(scores), '1', data.app)

                // if (updationResult) {
                    const { profileTypeStreamId, token } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData: localSmartProfile } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    let payload;

                    if (localSmartProfile) {
                        payload = localSmartProfile.data.smartProfile
                    }

                    const { data: smartProfileResponse } = await axios.post(`${API_BASE_URL}/user/smart-profile`, { smartProfile: payload }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'x-profile-type-stream-id': profileTypeStreamId,
                        }
                    })

                    if (smartProfileResponse.success) {
                        // const litSignature = localStorage.getItem("signature")
                        const { signature: litSignature } = getLocalStorageValueofClient(`clientID-${clientId}`)
                        let publicKey
                        if (!litSignature) {
                            publicKey = await getPublicKey();
                        }
                        const result = await encryptData(JSON.stringify(smartProfileResponse.smartProfile), publicKey)
                        await reGenerateUserDidAddress()
                        const updationResult = await updateSmartProfile(JSON.stringify(result), JSON.stringify(smartProfileResponse.smartProfile.scores), '1', JSON.stringify(smartProfileResponse.smartProfile.connectedPlatforms), localSmartProfile.streamId)
                        // save smart profile in local storage along with the returned stream id
                        if (updationResult) {
                            const objData = {
                                streamId: updationResult?.id,
                                data: { smartProfile: smartProfileResponse.smartProfile }
                            }
                            const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                            const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
                            let existingData = existingDataString ? JSON.parse(existingDataString) : {}

                            existingData = {
                                ...existingData,
                                smartProfileData: objData,
                            }

                            localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
                        }
                    }
                // }
            }
        } catch (err) {
            setError('Error')
            console.log(err)
        } finally {
            dispatch(setLoadingState({ loadingState: false, text: "" }));
            dispatch(updateHeader())
        }
    }



    return {
        message,
        app,
        error,
        emailId,
        setEmailId,
        registerEvent,
    }

}


