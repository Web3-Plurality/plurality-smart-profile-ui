import { useState } from "react"
import CustomButtom from "../CustomButton"
import CustomInputField from "../CustomInputField"

import './styles.css'


interface EmailLoginProps {
    prevStep: string
    handleStepper: (step: string) => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailLogin = ({ prevStep, handleStepper }: EmailLoginProps) => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError('')
        setEmail(e.target.value)
    }


    const handleEmailSubmit = () => {
        if (!email) {
            setError('Email Field Cannot Be Empty')
        } else if (!emailRegex.test(email)) {
            setError('Inval Email! Please Enter a Valid Email')
        } else if (prevStep === 'register') {
            handleStepper('otp')
        } else {
            handleStepper('socialConnect')
        }
    }


    return (
        <div className="email-login">
            <CustomInputField
                InputType={'email'}
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
