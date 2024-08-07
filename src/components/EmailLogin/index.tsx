import { useState } from "react"
import CustomButtom from "../CustomButton"
import CustomInputField from "../CustomInputField"

import './styles.css'
import useStychLogin from "../../hooks/useStychLogin"
import Loading from "../LitComponents/Loading"


interface EmailLoginProps {
    handleStepper: (step: string) => void
    handleMethodId: (id: string) => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailLogin = ({ handleMethodId }: EmailLoginProps) => {
    const [email, setEmail] = useState('')
    const widgetHeader = document.getElementById('w-header');

    const {
        sendPasscode,
        setError,
        loading,
        error,
    } = useStychLogin(email, handleMethodId)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (error) setError('')
        setEmail(e.target.value)
    }

    const handleEmailSubmit = () => {
        if (!email) {
            setError('Email Field Cannot Be Empty')
        } else if (!emailRegex.test(email)) {
            setError('Inval Email! Please Enter a Valid Email')
        } else {
            sendPasscode()
        }
    }

    if (loading) {
        widgetHeader?.classList.add('toogleShow')
        return <Loading copy={'Sendind OTP to your Email...'} />;
    } else {
        widgetHeader?.classList.remove('toogleShow')
    }

    return (
        <div className="email-login">
            <CustomInputField
                InputType={'email'}
                name="email"
                placeholderText="Enter your email"
                value={email}
                handleChange={handleChange}
            />
            <p className="error">{error}</p>
            <CustomButtom
                text="Submit"
                handleClick={handleEmailSubmit}
            />
        </div>

    )
}

export default EmailLogin
