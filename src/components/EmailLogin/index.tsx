import { useState } from "react"
import CustomButtom from "../CustomButton"
import CustomInputField from "../CustomInputField"

import './styles.css'
import useStychLogin from "../../hooks/useStychLogin"


interface EmailLoginProps {
    handleStepper: (step: string) => void
    handleMethodId: (id: string) => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailLogin = ({ handleMethodId }: EmailLoginProps) => {
    const [email, setEmail] = useState('')

    const {
        sendPasscode,
        setError,
        loading,
        error,
    } = useStychLogin(email, handleMethodId)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        return <div>Loading...</div>
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
