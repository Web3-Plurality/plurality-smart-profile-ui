import { ReactNode } from 'react';

import PoweredByFooter from './poweredByFooter';
import BackButton from './backButton';
import WidgetContent from './widgetContent';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getBtntext, getLocalStorageValueofClient, isBackBtnVisible } from '../../utils/Helpers';
import { selectCurrentWalletTab, selectLoader, selectProfileConnected } from '../../selectors/userDataSelector';
import { useStepper } from '../../hooks/useStepper';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { useNavigate } from 'react-router-dom';
import { setSocialConnectPath } from '../../Slice/userDataSlice';

interface WidgetLayoutWrapperProps {
    isIframe: boolean;
}

const WidgetLayoutWrapper = styled.div<WidgetLayoutWrapperProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    background-color: ${({ isIframe }) => (isIframe ? 'transparent' : '#EFEFEF')};

    .widget {   
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 430px;
        min-height: 550px;
        max-height: 550px;
        background-color: #F9F9F9;
        border-radius: 25px;
        box-shadow: ${({ isIframe }) =>
        isIframe
            ? 'none'
            : '2px 2px 5px rgba(128, 128, 128, 0.2), 4px 4px 10px rgba(128, 128, 128, 0.2), 6px 6px 15px rgba(128, 128, 128, 0.2), -2px -2px 5px rgba(255, 255, 255, 0.8), -2px -2px 10px rgba(255, 255, 255, 0.8), -6px -6px 15px rgba(255, 255, 255, 0.8);'};
        
        @media (max-width: 440px) {
            width: calc(100% - 40px);
            max-width: 430px; 
        }

    }
`;



const WidgetLayout = ({
    currentStep1,
    connectedPlatforms,
    children,
}: { currentStep1: number, connectedPlatforms: number, children: ReactNode }) => {

    const { goToStep, goBack, currentStep } = useStepper()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const showLoader = useSelector(selectLoader)
    const profileConnected = useSelector(selectProfileConnected)
    const activeWalletTab = useSelector(selectCurrentWalletTab)

    const text = getBtntext(currentStep)
    const isVisible = isBackBtnVisible(currentStep, showLoader.loadingState)

    const isIframe = window.self !== window.top;

    const queryParams = new URLSearchParams(location.search)
    const clientId = queryParams.get("client_id") || CLIENT_ID

    const { onboardingQuestions: ONBOARDING_QUESTIONS } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const currentQuestion = ONBOARDING_QUESTIONS?.[currentStep1]
    const currentQuestionType = currentQuestion?.type

    return (
        <WidgetLayoutWrapper isIframe={isIframe}>
            <div className='widget'>
                {currentStep !== 'onboardingForm' ? <WidgetContent children={children} /> : children}
                {isVisible && !isIframe && <BackButton text={text} handleClick={() => goBack()} />}
                {currentStep === 'socialConnect' && <BackButton text={profileConnected || connectedPlatforms ? 'Continue' : 'Skip for now'} handleClick={() => {
                    if(isIframe) {
                        goToStep('consent')
                        dispatch(setSocialConnectPath(false))
                    }else{
                        navigate(`dashboard?client_id=${clientId}`);
                    }
                }} />}
                {isIframe &&
                    currentStep !== 'consent' &&
                    currentStep !== 'signing' &&
                    currentStep !== 'contract' &&
                    currentStep !== 'profile' &&
                    (currentStep !== 'onboardingForm' || currentQuestionType !== 'CATEGORY_QUESTION') &&
                    (currentStep !== 'wallet' || (activeWalletTab !== 'receive' && activeWalletTab !== 'send')) && (
                        <PoweredByFooter />
                    )
                }

            </div>
            {!isIframe && <PoweredByFooter />}
        </WidgetLayoutWrapper >
    );
};

export default WidgetLayout;