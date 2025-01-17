import styled from 'styled-components'
import { useSelector } from "react-redux"
import { useState } from 'react';

import CustomButtom from './../customButton';
import { selectMessageToBeSigned } from "../../selectors/userDataSelector"
import { sendMessageSignedEvent, sendUserConsentEvent } from '../../utils/sendEventToParent';
import { getParentUrl } from '../../utils/Helpers';

const ConsentFooterWrapper = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 100px;
`;

const SigningFooter = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { message, id } = useSelector(selectMessageToBeSigned)

    const parentUrl = getParentUrl()

    const handleMessageSign = async () => {
        setIsLoading(true);
        try {
            await sendMessageSignedEvent(message, id, () => setIsLoading(false));
        } catch (error) {
            setIsLoading(false);
            console.error('Error signing message:', error);
        }
    };

    const handleRejectMessageSign = async () => {
        sendUserConsentEvent()
        window.parent.postMessage({ id, eventName: 'getMessageSignature', data: 'User Cancelled Message Signature' }, parentUrl);
    }

    return (
        <ConsentFooterWrapper>
            <CustomButtom
                text='Cancel'
                minWidth='120px'
                theme={'light'}
                consent={true}
                handleClick={handleRejectMessageSign}
            />
            <CustomButtom
                text='Accept'
                minWidth='120px'
                theme={'dark'}
                consent={true}
                handleClick={handleMessageSign}
                loader={isLoading}
                isDisable={isLoading}
            />
        </ConsentFooterWrapper>
    )
}

export default SigningFooter

