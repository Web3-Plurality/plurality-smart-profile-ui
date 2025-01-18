import { ReactNode } from "react";
import styled from "styled-components";
import WidgetHeader from "./header";
import { getBtntext, getPlatformImage, isBackBtnVisible } from "../../utils/Helpers";
import MobileHeader from "../Header/mobileHeader";
import useResponsive from "../../hooks/useResponsive";
import Loader from "../Loader";
import { selectLoader } from "../../selectors/userDataSelector";
import { useSelector } from "react-redux";
import BackButton from "./backButton";
import { useStepper } from "../../hooks/useStepper";


interface WidgetContentWrapperProps {
    isIframe: boolean;
    currentStep: string;
}

const WidgetContentWrapper = styled.div<WidgetContentWrapperProps>`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 60px 0;

    .app-logo {
        position: absolute;
        bottom: ${({ isIframe, currentStep }) => ((isIframe && currentStep === 'home') ? '80%' : (isIframe && currentStep !== 'home') ? '87%' : '100%')};
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
    const { goBack, currentStep } = useStepper()
    const showLoader = useSelector(selectLoader)
    const plaformImg = getPlatformImage()
    const showWidgetLogo = !isIframe ? currentStep !== 'socialConnect' && currentStep !== 'profile' :
        (currentStep !== 'socialConnect' && currentStep !== 'profileSettings' && currentStep !== 'profile')
    const { isTabScreen, isMobileScreen } = useResponsive()
    const isVisible = isBackBtnVisible(currentStep, showLoader.loadingState)
    const text = getBtntext(currentStep)


    const isSmallScreen = isTabScreen || isMobileScreen

    return (
        <WidgetContentWrapper isIframe={isIframe} currentStep={currentStep}>
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
