import React, { useState } from "react";
import OtpInput from "react-otp-input";
import CustomButtom from "../CustomButton";

import './styles.css'
import { useStytch } from "@stytch/react";
import { PayloadDataType } from "../../globalTypes";

interface OTPVerificationProps {
    methodId: string
    handleStepper: (step: string) => void
    handleFinalPayload: (data: PayloadDataType) => void
}

const OTPVerification = ({
    methodId,
    handleStepper,
    handleFinalPayload
}: OTPVerificationProps) => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const stytchClient = useStytch();

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleOTPVerification = async () => {
        try {
            setLoading(true)

            const response = await stytchClient.otps.authenticate(otp, methodId, {
                session_duration_minutes: 60,
            });

            console.log(response);

            if (response.status_code == 200 && response.session_jwt) {
                handleFinalPayload({ session: response.session_jwt, userId: response.user_id, method: 'email' })
                handleStepper('verification')
            }
        } catch (err: unknown) {
            setError(true);
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div>Loading...</div>
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
            {error && <span className="error">Invalid code entered, if this behavior persists, please contact us</span>}
            <CustomButtom text="Verify" handleClick={handleOTPVerification} isDisable={otp.length < 5} />
            <p className="code-resend">Didn't get the code? <span>Try again</span></p>
        </>
    );
};

export default OTPVerification;
