import { ReactNode } from 'react';

import PoweredByFooter from './poweredByFooter';
import BackButton from './backButton';
import WidgetContent from './widgetContent';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getBtntext, isBackBtnVisible } from '../../utils/Helpers';
import { selectCurrentWalletTab, selectLoader, selectProfileConnected } from '../../selectors/userDataSelector';
import { useStepper } from '../../hooks/useStepper';

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
    connectedPlatforms,
    children,
}: { connectedPlatforms:number,children: ReactNode }) => {

    const { goToStep, goBack, currentStep } = useStepper()
    const showLoader = useSelector(selectLoader)
    const profileConnected = useSelector(selectProfileConnected)
    const activeWalletTab = useSelector(selectCurrentWalletTab)

    const text = getBtntext(currentStep)
    const isVisible = isBackBtnVisible(currentStep, showLoader.loadingState)

    const isIframe = window.self !== window.top;

    return (
        <WidgetLayoutWrapper isIframe={isIframe}>
            <div className='widget'>
                {currentStep !== 'onboardingForm' ?  <WidgetContent children={children} /> : children}
                {isVisible && !isIframe && <BackButton text={text} handleClick={() => goBack()} />}
                {isIframe && currentStep === 'socialConnect' && <BackButton text={profileConnected || connectedPlatforms ? 'Continue' : 'Skip for now'} handleClick={() => goToStep('consent')} />}
                {isIframe &&
                    currentStep !== 'consent' &&
                    currentStep !== 'signing' &&
                    currentStep !== 'contract' &&
                    currentStep !== 'profile' &&
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