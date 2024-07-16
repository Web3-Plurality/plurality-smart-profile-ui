import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import CustomButtom from "../CustomButton";

import './styles.css'
import { useStytch } from "@stytch/react";
import { PayloadDataType } from "../../globalTypes";
import useStychLogin from "../../hooks/useStychLogin";

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
    const [timer, setTimer] = useState(30);
    const [timerExpired, setTimerExpired] = useState(false);
    const email = localStorage.getItem('user')

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearTimeout(countdown);
        } else {
            setTimerExpired(true);
        }
    }, [timer]);

    const stytchClient = useStytch();

    const {
        sendPasscode,
        loading: isLoading,
    } = useStychLogin(email ?? '')

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleResendCode = () => {
        setTimer(30);
        setTimerExpired(false);
        sendPasscode()
    }

    const handleOTPVerification = async () => {
        try {
            setLoading(true)
            const response = await stytchClient.otps.authenticate(otp, methodId, {
                session_duration_minutes: 60,
            });

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

    if (loading || isLoading) {
        document.getElementsByClassName('widget-header')
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
            {timerExpired && <p className="code-resend">Didn't get the code? <span role="button" tabIndex={0} onClick={handleResendCode}>Try again</span></p>}
            {!timerExpired && <p className="code-resend">Resend code in {timer} seconds</p>}
        </>
    );
};

export default OTPVerification;
