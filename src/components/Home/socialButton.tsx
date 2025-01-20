import { Button } from "antd"
import styled from "styled-components";

import CustomIcon from "./../customIcon";
import forwardIcon from './../../assets/svgIcons/forward-icon.svg'



interface CustomButtomProps {
    text: string
    icon: string
    style?: string
    handleClick?: () => void
}

const defaultProps = {
    handleClick: () => { },
    style: ''
};

const SocialButtonWrapper = styled(Button) <{ styleProp?: string }>`
    width: 100%; /* Full width */
    min-width: 350px; /* Minimum width */
    height: auto;
    padding: 0 20px;
    border-radius: 10px;
    border: none;
    background-color: #ffffff;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.09);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;

    &:hover{
        background-color: #e9e9e9 !important;
    }

    .button-content-left {
        display: flex;
        align-items: center;
        gap: 10px;

        p {
            padding: 0 !important;
            color: #4F4F4F;
            font-size: 17px;
            font-family: 'Lexend';
            transform: ${({ styleProp }) => styleProp};
        }
    }

    @media (max-width: 420px) {
        min-width: calc(100% + 30px);
    }

    @media (max-width: 370px) {
        min-width: calc(100% - 30px);
    }

    @media (max-width: 340px) {
        min-width: calc(100% - 50px);
        padding: 0 10px;
    }

    @media (max-width: 320px) {
        min-width: 100%;
    }
`;

const SocialButton = ({ text, icon, style, handleClick }: CustomButtomProps) => {
    return (
        <SocialButtonWrapper
            type="default"
            icon={<CustomIcon path={forwardIcon} />}
            iconPosition="end"
            onClick={handleClick}
            styleProp={style}
        >
            <div className="button-content-left">
                <CustomIcon path={icon} />
                <p>{text}</p>
            </div>

        </SocialButtonWrapper >
    )
}

SocialButton.defaultProps = defaultProps;
export default SocialButton