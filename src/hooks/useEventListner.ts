import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL, CLIENT_ID } from '../utils/EnvConfig'
import { RouteMapper, getLocalStorageValueofClient, setLocalStorageValue, deserializeSmartProfile, safeParseLocalStorage } from '../utils/Helpers'
import { setLoadingState, setProfileConnected } from '../Slice/userDataSlice'
import { useDispatch } from 'react-redux'
import { updateHeader } from '../Slice/headerSlice'
import { useStepper } from './useStepper'
import { useLogoutUser } from './useLogoutUser'

export const useRegisterEvent = () => {
    const [emailId, setEmailId] = useState<string>('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')

    const { goToStep } = useStepper()
    const dispatch = useDispatch()
    const handleLogout = useLogoutUser()

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    let existingData = getLocalStorageValueofClient(`clientID-${clientId}`)

    const registerEvent = async (appName: string) => {
        try {
            const evtSource = new EventSource(`${API_BASE_URL}/register-event`, { withCredentials: true });
            evtSource.onmessage = function (event) {
                const { message, app, id, auth, googleJwtToken, token, emailId, userId } = JSON.parse(event?.data);
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
                        googleJwtToken,
                        userId
                    }
                    setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(existingData))
                    goToStep('verification');
                } else if (message === "received") {
                    fetchUserInfo(app, auth)
                } else if (appName === '') {
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
        const newWindow = window.open(`/auth-start?sse_id=${sseID}`, "Google Authentication", 'width=500,height=600');
        if (!newWindow) {
            alert('Failed to open window. It might be blocked by a popup blocker.');
        }
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
                const { profileTypeStreamId, token } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const { smartProfileData: localSmartProfile } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                let payload;

                if (localSmartProfile) {
                    payload = localSmartProfile.data.smartProfile
                }

                if (payload) {
                    payload.profileTypeStreamId = profileTypeStreamId;
                }

                let smartProfileResponse;
                try {
                    const { data } = await axios.post(`${API_BASE_URL}/user/smart-profile/exchange-profile`, {
                        smartProfile: payload
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'x-profile-type-stream-id': profileTypeStreamId,
                            'x-client-app-id': clientId,
                        }
                    })
                    smartProfileResponse = data;
                } catch (exchangeError: any) {
                   throw exchangeError; // Re-throw to be caught by outer catch
                }

                if (smartProfileResponse.success) {
                    const smartProfile = smartProfileResponse.smartProfile
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)

                    // Backend now returns plain privateData (not encrypted)
                    // Deserialize if we have privateData
                    const privateDataObj = smartProfile.privateData
                    if (privateDataObj && Object.keys(privateDataObj).length > 0) {
                        await deserializeSmartProfile(smartProfile, privateDataObj)
                    }

                    // Save to localStorage (with plain privateData for UI use)
                    const objData = {
                        attestationUID: smartProfile.onchainAttestationUID,
                        data: { smartProfile: smartProfile }
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

                    dispatch(setProfileConnected())
                }

            }
        } catch (err: any) {
            if (err?.response?.status === 402) {
                setError('Insufficient credits to connect platform. Please deposit ROSE.');
            } else {
                setError('Failed to connect platform. Please try again.');
            }
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


