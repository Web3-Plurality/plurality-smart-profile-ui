import styled from "styled-components";

const FooterButtonWrapper = styled.div`
    cursor: pointer;
    color: gray;
    margin-bottom: 16px;
    margin-top: auto;
`;

const BackButton = ({ text, handleClick }: { text: string, handleClick: () => void }) => {
    return (
        <FooterButtonWrapper
            id="footer-btn"
            role='button'
            tabIndex={0}
            onClick={handleClick}
        >
            {text || 'Back'}
        </FooterButtonWrapper>
    )
}

export default BackButton
