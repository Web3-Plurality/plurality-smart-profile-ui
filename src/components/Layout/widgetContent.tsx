import { ReactNode } from "react";
import styled from "styled-components";
import WidgetHeader from "./header";
import { getPlatformImage } from "../../utils/Helpers";
import MobileHeader from "../Header/mobileHeader";
import useResponsive from "../../hooks/useResponsive";
import Loader from "../Loader";
import { selectLoader } from "../../selectors/userDataSelector";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "../../selectors/stepperSelector";


interface WidgetContentWrapperProps {
    isIframe: boolean;
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
        bottom: ${({ isIframe }) => (isIframe ? '87%' : '100%')};
        left: 50%;
        transform: translate(-50%, 50%);
        height: 120px;
        width: auto;
        object-fit: contain;
        z-index: 100;
    }

    h1 {
        margin-top: 0;
    }
`;

const WidgetContent = ({ children }: { children: ReactNode }) => {
    const showLoader = useSelector(selectLoader)
    const currentStep = useSelector(selectCurrentStep)
    const plaformImg = getPlatformImage()
    const showWidgetLogo = currentStep !== 'socialConnect'
    const { isTabScreen, isMobileScreen } = useResponsive()

    const isSmallScreen = isTabScreen || isMobileScreen
    const isIframe = window.self !== window.top;

    return (
        <WidgetContentWrapper isIframe={isIframe}>
            {showWidgetLogo && plaformImg && <img className="app-logo" src={plaformImg} alt='' />}
            {showLoader && showLoader.loadingState ? (
                <Loader message={showLoader.text} />
            ) : (
                <>
                    {isSmallScreen && <MobileHeader isSmallScreen={isSmallScreen} />}
                    <WidgetHeader />
                    {children}
                </>
            )}

        </WidgetContentWrapper>
    )
}

export default WidgetContent
