import React, { useState } from "react";
import OtpInput from "react-otp-input";
import CustomButtom from "../CustomButton";

import './styles.css'

interface OTPVerificationProps {
    handleStepper: (step: string) => void
}

const OTPVerification = ({ handleStepper }: OTPVerificationProps) => {
    const [otp, setOtp] = useState("");

    // Function to handle key press events
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleOTPVerification = () => {
        handleStepper('verification')
    }

    return (
        <>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={5}
                containerStyle="otp-field"
                renderInput={(props) => (
                    <input
                        {...props}
                        onKeyPress={handleKeyPress}
                    />
                )}
            />
            <CustomButtom text="Verify" handleClick={handleOTPVerification} />
            <p className="code-resend">Didn't get the code? <span>Try again</span></p>
        </>
    );
};

export default OTPVerification;
