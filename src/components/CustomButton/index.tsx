import { Button } from "antd"

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

const CustomButtom = ({ text, isDisable, handleClick }: CustomButtomProps) => {
    return (
        <Button
            className={classNames("custom-btn")}
            type="default"
            iconPosition="end"
            disabled={isDisable}
            onClick={handleClick}
        >

            {text}
        </Button >
    )
}

CustomButtom.defaultProps = defaultProps;
export default CustomButtom
