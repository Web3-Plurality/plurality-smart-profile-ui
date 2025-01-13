import styled from 'styled-components'
import CustomButtom from '../customButton';
import { getLocalStorageValueofClient, setLocalStorageValue } from '../../utils/Helpers';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { sendProfileConnectedEvent, sendUserConsentEvent, sendUserDataEvent } from '../../utils/sendEventToParent';

const ConsentFooterWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const queryParams = new URLSearchParams(location.search);
const clientId = queryParams.get('client_id') || CLIENT_ID;

const ConsentFooter = () => {
    const acceptUserConsent = () => {
        const existingClientData = getLocalStorageValueofClient(`clientID-${clientId}`)
        const updatedClientData = {
            ...existingClientData,
            consent: {
                accepted: true,
                rejected: false
            }
        }

        setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(updatedClientData))
        sendProfileConnectedEvent();
        sendUserConsentEvent();
        sendUserDataEvent()
    }

    const rejectUserConsent = () => {
        const existingClientData = getLocalStorageValueofClient(`clientID-${clientId}`)
        const updatedClientData = {
            ...existingClientData,
            consent: {
                accepted: false,
                rejected: true
            }
        }

        setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(updatedClientData))
        sendProfileConnectedEvent();
        sendUserConsentEvent()
        sendUserDataEvent()
    }

    return (
        <ConsentFooterWrapper>
            <CustomButtom
                text='Cancel'
                minWidth='150px'
                theme={'light'}
                consent={true}
                handleClick={rejectUserConsent}
            />
            <CustomButtom
                text='Accept'
                minWidth='150px'
                theme={'dark'}
                consent={true}
                handleClick={acceptUserConsent}
            />
        </ConsentFooterWrapper>
    )
}

export default ConsentFooter
