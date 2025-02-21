import styled from "styled-components";
import { useStepper } from "../../hooks/useStepper";
import { platformCount } from "../../utils/Helpers";

interface FooterButtonWrapperProps {
    isIframe: boolean;
    currentStep: string;
    platforms:number;
}

const FooterButtonWrapper = styled.div<FooterButtonWrapperProps>`
    cursor: pointer;
    color: gray;
    margin-bottom: ${({ isIframe, currentStep, platforms }) => (isIframe && currentStep === 'socialConnect' ? platforms < 5 ? '85px': '50px': '16px')};
    margin-top: ${({ isIframe, currentStep }) => (isIframe && currentStep !== 'socialConnect' ? '25px' : isIframe && currentStep === 'socialConnect' ? '-55px' : '')};
`;

const BackButton = ({ text, handleClick }: { text: string, handleClick: () => void }) => {
    const isIframe = window.self !== window.top;
    const { currentStep } = useStepper()
    const platformsNum = platformCount()

    return (
        <FooterButtonWrapper
            id="footer-btn"
            role='button'
            tabIndex={0}
            isIframe={isIframe}
            currentStep={currentStep}
            platforms={platformsNum}
            onClick={handleClick}
        >
            {text || 'Back'}
        </FooterButtonWrapper>
    )
}

export default BackButton
