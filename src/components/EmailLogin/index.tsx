import CustomButtom from "../CustomButton"
import CustomInputField from "../CustomInputField"

import './styles.css'

const EmailLogin = () => {
    return (
        <div className="email-login">
            <CustomInputField InputType={'email'} />
            <CustomButtom text="Submit" showIcon={false} />
        </div>

    )
}

export default EmailLogin
