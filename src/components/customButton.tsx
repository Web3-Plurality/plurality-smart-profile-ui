import { Button } from "antd"
import styled from "styled-components";

interface CustomButtomProps {
    text: string,
    isDisable?: boolean,
    handleClick?: () => void
}

const defaultProps = {
    isDisable: false,
    handleClick: () => { }
};

const ButtonWrapper = styled(Button)`
        min-width: 392px;
        height: 20px;
        padding: 23px 0;
        border-radius: 10px;
        border: none;
        background-color: #565656 !important;
        color: #ffffff !important;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        
        &:not(:disabled):hover {
            border: none;
            color: #ffffff !important;
            background-color: #000000 !important;
        }
    
        @media (max-width: 441px) {
            min-width: 320px;
        }

        @media (max-width: 376px) {
            min-width: 270px;
        }
`

const CustomButtom = ({ text, isDisable, handleClick }: CustomButtomProps) => {
    return (
        <ButtonWrapper
            type="default"
            iconPosition="end"
            disabled={isDisable}
            onClick={handleClick}

        >
            {text}
        </ButtonWrapper >
    )
}

CustomButtom.defaultProps = defaultProps;
export default CustomButtom
