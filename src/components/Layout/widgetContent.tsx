import { ReactNode } from "react";
import styled from "styled-components";
import WidgetHeader from "./header";
import { getBtntext, getPlatformImage, isBackBtnVisible, platformCount } from "../../utils/Helpers";
import MobileHeader from "../Header/mobileHeader";
import useResponsive from "../../hooks/useResponsive";
import Loader from "../Loader";
import { selectLoader } from "../../selectors/userDataSelector";
import { useSelector } from "react-redux";
import BackButton from "./backButton";
import { useStepper } from "../../hooks/useStepper";
import { hideBackButtonforSteps, hideBackButtonforStepsInIframe } from "../../utils/Constants";


interface WidgetContentWrapperProps {
    isIframe: boolean;
    currentStep: string;
    mobileHeader: boolean;
    loader: boolean;
}

const WidgetContentWrapper = styled.div<WidgetContentWrapperProps>`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 60px 0;
    padding: ${({ isIframe, currentStep}) => ((!isIframe && currentStep === 'profileSettings') ? '0' : '60px 0' )};

    .app-logo {
        position: absolute;
        bottom: ${({ isIframe, currentStep, mobileHeader, loader }) => ((isIframe && currentStep === 'home') || (isIframe && currentStep === 'verification')  || (loader && currentStep === 'success')? '80%' : (mobileHeader && currentStep === 'home') ? '85%' :((isIframe || mobileHeader) && currentStep !== 'home') ? '87%' : '100%')};
        left: 50%;
        transform: translate(-50%, 50%);
        height: 120px;
        width: auto;
        object-fit: contain;
        z-index: 100;

        @media (max-width: 380px) {
            height: 90px;
        }
    }

    h1 {
        margin-top: 0;
    }

    
`;

const WidgetContent = ({ children }: { children: ReactNode }) => {
    const isIframe = window.self !== window.top;

    const platformsNum = platformCount()

    const { goBack, currentStep } = useStepper()
    const showLoader = useSelector(selectLoader)
    const plaformImg = getPlatformImage()

    const isSocialConnectWithFewPlatforms = currentStep === 'socialConnect' && platformsNum < 5;
    const isNotProfileOrSocialConnect = !hideBackButtonforSteps.includes(currentStep);
    const isNotProfileSettingsOrConsent = !hideBackButtonforStepsInIframe.includes(currentStep);

    const showWidgetLogo = !isIframe
        ? isSocialConnectWithFewPlatforms || isNotProfileOrSocialConnect
        : isSocialConnectWithFewPlatforms || isNotProfileSettingsOrConsent;

    const { isTabScreen, isMobileScreen, isExtraSmallScreen } = useResponsive()
    const isVisible = isBackBtnVisible(currentStep, showLoader.loadingState)
    const text = getBtntext(currentStep)

    const mobileHeader = isMobileScreen || isExtraSmallScreen

    const isSmallScreen = isTabScreen || isMobileScreen || isExtraSmallScreen 

    return (
        <WidgetContentWrapper isIframe={isIframe} currentStep={currentStep} mobileHeader={mobileHeader} loader={showLoader.loadingState}>
            {showWidgetLogo && plaformImg && <img className="app-logo" src={plaformImg} alt='' />}
            {showLoader && showLoader.loadingState ? (
                <Loader message={showLoader.text} />
            ) : (
                <>
                    {isSmallScreen && <MobileHeader isSmallScreen={isSmallScreen} />}
                    <WidgetHeader />
                    {children}
                    {isVisible && isIframe && <BackButton text={text} handleClick={() => goBack()} />}

                </>
            )}

        </WidgetContentWrapper>
    )
}

export default WidgetContent
