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
    min-width: 350px;
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

    .button-content-left{
        display: flex;
        align-items: center;
        gap: 5px;

        p{
            padding: 0 !important;
            color: #4F4F4F;
            font-size: 17px;
            font-family: 'Lexend';
            transform: ${props => props.styleProp};
        }
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