import { useState } from 'react'
import axios from 'axios'
import { useMetamaskPublicKey } from './useMetamaskPublicKey'
import { API_BASE_URL } from '../utils/EnvConfig'
import { RouteMapper, setLocalStorageValue } from '../utils/Helpers'
import { encryptData } from '../services/EncryptionDecryption/encryption'
import { autoConnect } from '../services/orbis/autoConnect'
import { insertIndividualProfile, insertSmartProfile } from '../services/orbis/insertQueries'
import { setLoadingState } from '../Slice/userDataSlice'
import { useDispatch } from 'react-redux'
import { updateHeader } from '../Slice/headerSlice'
import { goToStep } from '../Slice/stepperSlice'

export const useRegisterEvent = () => {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')


    const dispatch = useDispatch()


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
                    localStorage.setItem('emailId', emailId)
                    dispatch(goToStep('otp'))
                } else if (message === "received" && app === 'google') {
                    localStorage.setItem('token', token)
                    localStorage.setItem('googleJwtToken', googleJwtToken)
                    dispatch(goToStep('verification'))
                }else if (message === "received") {
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
            `${API_BASE_URL}/user/auth/google/login?sse_id=${sseID}`,
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
        const token = localStorage.getItem('token')
        try {
            dispatch(setLoadingState({ loadingState: true, text: "Updating your profile" }));
            const { data } = await axios.get(infoUrl, {
                headers: {
                    'x-token-id': auth,
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.message === 'success') {
                const individualProfileData = data.individualProfile
                const scores = individualProfileData.scores
                const litSignature = localStorage.getItem("signature")

                let publicKey;
                if (!litSignature) {
                    publicKey = await getPublicKey();
                }
                const encryptedIndividualProfile = await encryptData(JSON.stringify(data.individualProfile), publicKey)
                await autoConnect()
                const individualresult = await insertIndividualProfile(JSON.stringify(encryptedIndividualProfile), JSON.stringify(scores), '1', data.app)

                if (individualresult) {
                    const token = localStorage.getItem('token')
                    const localSmartProfile = localStorage.getItem('smartProfileData')
                    let payload;

                    if (localSmartProfile) {
                        payload = JSON.parse(localSmartProfile).data.smartProfile
                    }
                    const profileTypeStreamId = localStorage.getItem("profileTypeStreamId")

                    const { data: smartProfileResponse } = await axios.post(`${API_BASE_URL}/user/smart-profile`, { smartProfile: payload }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'x-profile-type-stream-id': profileTypeStreamId,
                        }
                    })

                    if (smartProfileResponse.success) {
                        const litSignature = localStorage.getItem("signature")
                        let publicKey
                        if (!litSignature) {
                            publicKey = await getPublicKey();
                        }
                        const result = await encryptData(JSON.stringify(smartProfileResponse.smartProfile), publicKey)
                        await autoConnect()
                        const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(smartProfileResponse.smartProfile.scores), '1', JSON.stringify(smartProfileResponse.smartProfile.connectedPlatforms), profileTypeStreamId!)
                        // save smart profile in local storage along with the returned stream id
                        if (insertionResult) {
                            const objData = {
                                streamId: insertionResult?.id,
                                data: { smartProfile: smartProfileResponse.smartProfile }
                            }
                            localStorage.setItem('smartProfileData', JSON.stringify(objData))
                        }
                    }
                }
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
        registerEvent,
    }

}


