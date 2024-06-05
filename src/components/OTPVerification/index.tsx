import React, { useState } from "react";
import OtpInput from "react-otp-input";
import CustomButtom from "../CustomButton";

import './styles.css'

interface OTPVerificationProps {
    handleStepper: (step: string) => void
}

const OTPVerification = ({ handleStepper }: OTPVerificationProps) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(false)

    // Function to handle key press events
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleOTPVerification = () => {
        if (otp !== '123456') {
            setError(true)
        } else {
            handleStepper('verification')
        }
    }

    return (
        <>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle="otp-field"
                renderInput={(props) => (
                    <input
                        {...props}
                        onKeyPress={handleKeyPress}
                    />
                )}
            />
            {error && <span className="error">Invalid OTP</span>}
            <CustomButtom text="Verify" handleClick={handleOTPVerification} isDisable={otp.length < 5} />
            <p className="code-resend">Didn't get the code? <span>Try again</span></p>
        </>
    );
};

export default OTPVerification;
