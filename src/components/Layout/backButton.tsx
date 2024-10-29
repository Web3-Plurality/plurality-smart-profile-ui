import styled from "styled-components";

interface FooterButtonWrapperProps {
    isIframe: boolean;
}

const FooterButtonWrapper = styled.div<FooterButtonWrapperProps>`
    cursor: pointer;
    color: gray;
    margin-bottom: 16px;
    margin-top: auto;
    margin-top: ${({ isIframe }) => (isIframe ? '55px' : '')};
`;

const BackButton = ({ text, handleClick }: { text: string, handleClick: () => void }) => {
    const isIframe = window.self !== window.top;
    return (
        <FooterButtonWrapper
            id="footer-btn"
            role='button'
            tabIndex={0}
            isIframe={isIframe}
            onClick={handleClick}
        >
            {text || 'Back'}
        </FooterButtonWrapper>
    )
}

export default BackButton
