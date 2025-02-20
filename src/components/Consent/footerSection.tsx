import styled from 'styled-components'
import CustomButtom from '../customButton';
import { getLocalStorageValueofClient } from '../../utils/Helpers';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { sendProfileConnectedEvent, sendUserConsentEvent, sendUserDataEvent } from '../../utils/sendEventToParent';
import { useDispatch, useSelector } from 'react-redux';
import { selectSPDataId } from '../../selectors/userDataSelector';
import { setProfileDataID } from '../../Slice/userDataSlice';
import { updatePublicSmartProfileAction } from '../../utils/SmartProfile';
import { useState } from 'react';

const ConsentFooterWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const queryParams = new URLSearchParams(location.search);
const clientId = queryParams.get('client_id') || CLIENT_ID;

const ConsentFooter = () => {
    const [isAcceptLoading, setIsAcceptLoading] = useState(false)
    const [isRejectLoading, setIsRejectLoading] = useState(false)
    const dispatch = useDispatch()
    const id = useSelector(selectSPDataId)

    let event = ''
    if (id) {
        event = 'update'
    }

    const resetSPId = () => {
        dispatch(setProfileDataID(''));
    }

    const acceptUserConsent = async () => {
        setIsAcceptLoading(true); // Set loading state to true
    
        try {
            const existingClientData = getLocalStorageValueofClient(`clientID-${clientId}`);
            const { profileTypeStreamId } = existingClientData;
            const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);
            const smartProfile = smartProfileData.data.smartProfile;
            const extendedPublicData = smartProfile.extendedPublicData;
    
            extendedPublicData[clientId] = {
                ...extendedPublicData[clientId],
                consent: 'accepted',
            };
    
            await updatePublicSmartProfileAction(profileTypeStreamId, smartProfile);
            sendProfileConnectedEvent();
            sendUserConsentEvent();
            sendUserDataEvent(id, event, resetSPId);
        } catch (error) {
            console.error('Error during consent acceptance:', error);
        } finally {
            setIsAcceptLoading(false); // Set loading state to false after the operation completes
        }
    };
    
    const rejectUserConsent = async () => {
        setIsRejectLoading(true); // Set loading state to true
    
        try {
            const existingClientData = getLocalStorageValueofClient(`clientID-${clientId}`);
            const { profileTypeStreamId } = existingClientData;
            const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);
            const smartProfile = smartProfileData.data.smartProfile;
            const extendedPublicData = smartProfile.extendedPublicData;
    
            extendedPublicData[clientId] = {
                ...extendedPublicData[clientId],
                consent: 'rejected',
            };
    
            await updatePublicSmartProfileAction(profileTypeStreamId, smartProfile);
            sendProfileConnectedEvent();
            sendUserConsentEvent();
            sendUserDataEvent(id, event, resetSPId);
        } catch (error) {
            console.error('Error during consent rejection:', error);
        } finally {
            setIsRejectLoading(false); // Set loading state to false after the operation completes
        }
    };
    

    return (
        <ConsentFooterWrapper>
            <CustomButtom
                text='Reject'
                minWidth='150px'
                theme={'light'}
                consent={true}
                loader={isRejectLoading}
                handleClick={rejectUserConsent}
            />
            <CustomButtom
                text='Accept'
                minWidth='150px'
                theme={'dark'}
                consent={true}
                loader={isAcceptLoading}
                handleClick={acceptUserConsent}
            />
        </ConsentFooterWrapper>
    )
}

export default ConsentFooter
