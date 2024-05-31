import { Button } from "antd"
import CustomIcon from "../CustomIcon";
import forwardIcon from './../../assets/svgIcons/forward-icon.svg'

import './styles.css'
import classNames from "classnames";

interface CustomButtomProps {
    text: string,
    icon?: string,
    showIcon?: boolean,
    handleClick?: () => void
}

const defaultProps = {
    icon: '',
    showIcon: true,
    handleClick: () => { }
};

const CustomButtom = ({ text, icon, showIcon, handleClick }: CustomButtomProps) => {
    return (
        <Button
            className={classNames("custom-btn", { smallBtn: !showIcon })}
            type="default"
            icon={showIcon ? <CustomIcon path={forwardIcon} /> : ''}
            iconPosition="end"
            onClick={handleClick}
        >
            <div className="button-content-left">
                {showIcon && icon && <CustomIcon path={icon} />}
                <p>{text}</p>
            </div>

        </Button >
    )
}

CustomButtom.defaultProps = defaultProps;
export default CustomButtom
