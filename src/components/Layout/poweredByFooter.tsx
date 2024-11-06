import styled from 'styled-components';
import footerLogo from './../../assets/images/footer-logo.png';


const FooterWrapper = styled.div`
    position: absolute;
    bottom: 2.9%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    span {
        color: #4F4F4F;
    }
    img{
        width: 80px;
        margin-top: 2px;
    }
`;

const PoweredByFooter = () => {
    return (
        <FooterWrapper
            role="button"
            tabIndex={0}
            onClick={() => window.open('https://plurality.network/', '_blank', 'noopener,noreferrer')}
        >
            <span>Powered By</span>
            <img src={footerLogo} alt="" />
        </FooterWrapper>
    );
};

export default PoweredByFooter;
