import { useState } from "react";
import CustomButtom from "../CustomButton";
import CustomInputField from "../CustomInputField";
import './styles.css';
import useStychLogin from "../../hooks/useStychLogin";
import Loading from "../LitComponents/Loading";
import { Checkbox, CheckboxProps } from "antd";

interface EmailLoginProps {
    handleMethodId: (id: string) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailLogin = ({ handleMethodId }: EmailLoginProps) => {
    const [email, setEmail] = useState('');
    const [acceptance, setAcceptance] = useState(false);
    const widgetHeader = document.getElementById('w-header');

    const {
        sendPasscode,
        setError,
        loading,
        error,
    } = useStychLogin(email, handleMethodId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (error) setError('');
        setEmail(e.target.value);
    };

    const handleEmailSubmit = () => {
        sendPasscode();
    };

    if (loading) {
        widgetHeader?.classList.add('toogleShow');
        return <Loading copy={'Sending OTP to your Email...'} />;
    } else {
        widgetHeader?.classList.remove('toogleShow');
    }

    const onChange: CheckboxProps['onChange'] = (e) => {
        console.log(`checked = ${e.target.checked}`);
        setAcceptance(e.target.checked);
    };

    return (
        <div className="email-login">
            <CustomInputField
                InputType={'email'}
                name="email"
                placeholderText="Enter your email"
                value={email}
                handleChange={handleChange}
            />
            <div className="checkbox-container">
                <Checkbox checked={acceptance} onChange={onChange} />
                <span>
                    I accept the <a href="https://plurality.network/user-terms-of-service/">terms of service</a>{" "}
                    and subscribe to receive updates from the DFDC and Plurality Network
                </span>
            </div>
            <CustomButtom
                text="Submit"
                handleClick={handleEmailSubmit}
                isDisable={!emailRegex.test(email) || !acceptance}
            />
        </div>
    );
};

export default EmailLogin;
