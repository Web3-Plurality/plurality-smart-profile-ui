import { useState } from "react"
import CustomButtom from "../CustomButton"
import CustomInputField from "../CustomInputField"

import './styles.css'
import { useStytch } from "@stytch/react"
import { OTPCodeEmailOptions } from "@stytch/vanilla-js"


interface EmailLoginProps {
    handleStepper: (step: string) => void
    handleMethodId: (id: string) => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailLogin = ({ handleMethodId, handleStepper }: EmailLoginProps) => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const stytchClient = useStytch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError('')
        setEmail(e.target.value)
    }

    const sendPasscode = async () => {
        try {
            setLoading(true)

            const templateId = import.meta.env.VITE_APP_EMAIL_TEMPLATE_ID!;
            const options: OTPCodeEmailOptions = {
                login_template_id: templateId,
                expiration_minutes: 2
            }

            const response = await stytchClient.otps.email.loginOrCreate(email, options);
            console.log("response", response);

            handleMethodId(response.method_id);
            handleStepper('otp')

        } catch (err: unknown) {
            setError("Something goes wrong while sending the passcode, please try it again");
        } finally {
            setLoading(false);
        }
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
