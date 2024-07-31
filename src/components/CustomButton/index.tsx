import { Button } from "antd"
import styled from "styled-components";

import './styles.css'
import classNames from "classnames";

interface CustomButtomProps {
    text: string,
    isDisable?: boolean,
    handleClick?: () => void
}

const defaultProps = {
    isDisable: false,
    handleClick: () => { }
};

const Wrapper = styled.div`
    .custom-btn{    min-width: 392px;
    height: 20px;
    padding: 23px 0;
    border-radius: 10px;
    border: none;
    background-color: #565656;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    &:not(:disabled):hover {
        border: none;
        color: #ffffff !important;
        background-color: #000000 !important;
    }
}
`

const CustomButtom = ({ text, isDisable, handleClick }: CustomButtomProps) => {
    return (
        <Wrapper>
            <Button
                className={classNames("custom-btn")}
                type="default"
                iconPosition="end"
                disabled={isDisable}
                onClick={handleClick}
            >

                {text}
            </Button >
        </Wrapper>
    )
}

CustomButtom.defaultProps = defaultProps;
export default CustomButtom
