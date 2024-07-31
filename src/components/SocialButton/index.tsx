import { Button } from "antd"
import CustomIcon from "../CustomIcon";
import forwardIcon from './../../assets/svgIcons/forward-icon.svg'

import './styles.css'
import classNames from "classnames";

interface CustomButtomProps {
    text: string,
    icon: string,
    handleClick?: () => void
}

const defaultProps = {
    handleClick: () => { }
};

const SocialButton = ({ text, icon, handleClick }: CustomButtomProps) => {
    return (
        <Button
            className={classNames("social-btn")}
            type="default"
            icon={<CustomIcon path={forwardIcon} />}
            iconPosition="end"
            onClick={handleClick}
        >
            <div className="button-content-left">
                <CustomIcon path={icon} />
                <p>{text}</p>
            </div>

        </Button >
    )
}

SocialButton.defaultProps = defaultProps;
export default SocialButton
