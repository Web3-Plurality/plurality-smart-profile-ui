import React, { useEffect } from 'react';
import { getLocalStorageValueofClient, getParentUrl, handleLocalStorageOnLogout, redirectUserOnLogout} from '../utils/Helpers';
import { CLIENT_ID } from '../utils/EnvConfig';
import { useNavigate } from 'react-router-dom';
import { useStepper } from '../hooks/useStepper';
import { updateSmartProfileAction } from '../utils/SmartProfile';
import { useDispatch } from 'react-redux';
import { setProfileDataID, setSignatureMessage, setSocialConnectPath } from '../Slice/userDataSlice';
import { sendExtentedPublicData, sendProfileConnectedEvent, sendUserDataEvent } from '../utils/sendEventToParent';
import { useLogoutUser } from '../hooks/useLogoutUser';

const EventListener: React.FC = () => {
    const queryParams = new URLSearchParams(location.search);
    const appClientId = queryParams.get('client_id')
    const clientId = appClientId || CLIENT_ID;

    const { goToStep, resetSteps } = useStepper()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleLogoutUser =  useLogoutUser()

    const receiveMessage = async (event: MessageEvent) => {
        const parentUrl = getParentUrl()
        if (event.origin === parentUrl) {
            const data = event.data;
            if (data.method === 'getMessageSignature' && data.message) {
                const signatureData = {
                    message: data.message,
                    id: data.id
                }
                dispatch(setSignatureMessage(signatureData))
                goToStep('signing')
            } else if (data.method === 'updateConsentData') {
                dispatch(setProfileDataID(data.id))
                goToStep('consent')
            } else if (data.method === 'getSmartProfile') {
                sendUserDataEvent(data.id, 'get')
            } else if (data.method === 'getLoginInfo') {
                sendProfileConnectedEvent(data.id)
            } else if (data.method === 'getAppData') {
                sendExtentedPublicData(data.id, data.key)
            }else if (data.method === 'navigateTo') {
                const {step} = data
                dispatch(setSocialConnectPath(true))
                goToStep(step)
            } else if (data.method === 'setAppData') {
                try {
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`);
                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);
                    const smartProfile = smartProfileData.data.smartProfile;
                    const extendedPublicData = smartProfile.extendedPublicData;

                    if (!extendedPublicData[clientId]) {
                        extendedPublicData[clientId] = { consent: 'not given' };
                    }

                    if(!data?.key || !data?.value) {
                        window.parent.postMessage({ id: data.id, eventName: 'setAppData', data: "Invalid data!" }, parentUrl);
                        return
                    }
                    
                    smartProfile.extendedPublicData[clientId][data.key] = data.value;
        
                    await updateSmartProfileAction(profileTypeStreamId, smartProfile, handleLogoutUser);
                    window.parent.postMessage({ id: data.id, eventName: 'setAppData', data: "received" }, parentUrl);                  
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            // EAS Event
            else if (data.method === 'setPublicData') {
                try {
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    const smartProfile = smartProfileData.data.smartProfile
                    smartProfile.extendedPublicData[data?.key] = data?.value;
                    await updateSmartProfileAction(profileTypeStreamId, smartProfile, handleLogoutUser)
                    window.parent.postMessage({ id: data.id, eventName: 'setPublicData', data: "recieved" }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getPublicData') {
                try {

                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData: localSmartProfile } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    if (localSmartProfile?.data?.smartProfile?.extendedPublicData[data?.key]) {
                        window.parent.postMessage({ id: data.id, eventName: 'getPublicData', data: localSmartProfile?.data?.smartProfile?.extendedPublicData[data?.key] }, parentUrl);
                    } else {
                        window.parent.postMessage({ id: data.id, eventName: 'getPublicData', data: "no data found against this key" }, parentUrl);
                    }
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'setPrivateData') {
                try {
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    const smartProfile = smartProfileData.data.smartProfile
                    smartProfile.privateData.extendedPrivateData[data?.key] = data?.value;
                    await updateSmartProfileAction(profileTypeStreamId, smartProfile, handleLogoutUser)
                    window.parent.postMessage({ id: data.id, eventName: 'setPrivateData', data: "recieved" }, parentUrl);
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (data.method === 'getPrivateData') {
                try {
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                    const smartProfile = smartProfileData.data.smartProfile
                    if (smartProfile.privateData.extendedPrivateData[data?.key]) {
                        window.parent.postMessage({ id: data.id, eventName: 'getPrivateData', data: smartProfile.privateData.extendedPrivateData[data?.key] }, parentUrl);
                    } else {
                        window.parent.postMessage({ id: data.id, eventName: 'getPrivateData', data: "no data found against this key" }, parentUrl);
                    }
                }
                catch (error) {
                    console.error(error);
                    window.parent.postMessage({ id: data.id, eventName: 'errorMessage', data: (error as Error).toString() }, parentUrl);
                }
            }
            else if (event.data.type === 'logoutRequest') {
                window.parent.postMessage({ eventName: 'walletConnection', data: { isConnected: false, logout: true } }, parentUrl);

                handleLocalStorageOnLogout(clientId)

                const redirectPath = redirectUserOnLogout(clientId, appClientId)

                resetSteps()
                navigate(redirectPath, { replace: true });
                window.location.reload()
            }
            else if (event.data.type === 'goToStep') {
                const { step, action } = event.data
                // Set iframeToProfiles to true for socialConnect and profileSettings with 'profile' action
                // This allows these components to render properly in iframe context
                if(step === 'socialConnect' || (step === 'profileSettings' && action === 'profile')){
                    dispatch(setSocialConnectPath(true))
                }else{
                    dispatch(setSocialConnectPath(false))
                }
                goToStep(step)
            }
        }
    };
    useEffect(() => {
        window.addEventListener('message', receiveMessage, false);
        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, []);
    return <div></div>;
};

export default EventListener;