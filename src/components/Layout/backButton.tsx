import styled from "styled-components";
import { useStepper } from "../../hooks/useStepper";

interface FooterButtonWrapperProps {
    isIframe: boolean;
    currentStep: string
}

const FooterButtonWrapper = styled.div<FooterButtonWrapperProps>`
    cursor: pointer;
    color: gray;
    margin-bottom: ${({ isIframe, currentStep }) => (isIframe && currentStep === 'socialConnect' ? '50px' : '16px')};
    margin-top: ${({ isIframe, currentStep }) => (isIframe && currentStep !== 'socialConnect' ? '25px' : isIframe && currentStep === 'socialConnect' ? '-55px' : '')};
`;

const BackButton = ({ text, handleClick }: { text: string, handleClick: () => void }) => {
    const isIframe = window.self !== window.top;
    const { currentStep } = useStepper()

    return (
        <FooterButtonWrapper
            id="footer-btn"
            role='button'
            tabIndex={0}
            isIframe={isIframe}
            currentStep={currentStep}
            onClick={handleClick}
        >
            {text || 'Back'}
        </FooterButtonWrapper>
    )
}

export default BackButton
