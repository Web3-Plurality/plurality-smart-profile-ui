import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import OtpInput from "react-otp-input";
import useStychLogin from "../hooks/useStychLogin";
import { LoaderMessages } from "../utils/Constants";
import { setLoadingState } from "../Slice/userDataSlice";
import CustomButtom from "./customButton";
import styled from "styled-components";
import { PayloadDataType } from "../types";
import axios from "axios";
import { API_BASE_URL } from "../utils/EnvConfig";
import { getLocalStorageValue, setLocalStorageValue } from "./../utils/Helpers";
import { message } from "antd";
import { goBack, resetSteps } from "../Slice/stepperSlice";

interface OTPVerificationProps {
    emailId: string;
    handleFinalPayload: (data: PayloadDataType) => void;
}


const OtpField = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
`;

const Input = styled.input`
    width: 3rem;
    height: 2.7rem;
    outline: none;
    padding: 0.3rem 0.45rem;
    font-size: 2.3rem;
    font-weight: 500;
    border-radius: 10px;
    border: none;
    margin-left: 1rem;
    background-color: white;
    color: black;
    box-shadow:
        2px 2px 5px rgba(128, 128, 128, 1),
        4px 4px 10px rgba(128, 128, 128, 0.4),
        6px 6px 15px rgba(128, 128, 128, 0.2);
    
    &:first-child {
        margin-left: 0;
    }

    &.input-filled {
        background-color: black;
        color: white;
    }
`;

const CodeResend = styled.p`
    font-size: 12px;

    span {
        color: #177EF8;
        cursor: pointer;

        &:hover {
            color: #177EF8;
        }
    }
`;

const Error = styled.span`
    color: red;
    font-size: 0.9rem;
`;

const OTPVerification = ({ emailId, handleFinalPayload }: OTPVerificationProps) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(false);
    const [timer, setTimer] = useState(30);
    const [timerExpired, setTimerExpired] = useState(false);
    const email = localStorage.getItem('user');

    const dispatch = useDispatch();
    const { sendPasscode } = useStychLogin(email || '');

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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleResendCode = () => {
        setTimer(30);
        setTimerExpired(false);
        sendPasscode();
    };

    const handleOTPVerification = async () => {
        try {
            dispatch(setLoadingState({ loadingState: true, text: LoaderMessages.STYCH_OTP_VERFICATION }));
            const url = `${API_BASE_URL}/user/auth/otp/authenticate`
            const payload = {
                code: otp,
                email_id: emailId,
                email: getLocalStorageValue('user'),
                subscribe: true,
                clientId: getLocalStorageValue("clientId")
            };

            const response = await axios.post(url, payload)

            if (!response) {
                setError(true);
                message.error('Invalid code entered, if this behavior persists, please contact us')
                return
            }

            if (response.data?.success && response.data?.stytchToken) {
                setLocalStorageValue("token", response.data?.pluralityToken)
                handleFinalPayload({ session: response.data?.stytchToken, userId: response.data?.userId, method: 'email' });
                localStorage.setItem('tool', 'lit');
            }
        } catch (err) {
            setError(true);
            console.log(err);
        } finally {
            dispatch(setLoadingState({ loadingState: false, text: '' }));
        }
    };

    return (
        <>
            <OtpField>
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    containerStyle="otp-field"
                    renderInput={(props, index) => (
                        <Input
                            {...props}
                            onKeyPress={handleKeyPress}
                            className={otp[index] ? 'input-filled' : ''}
                        />
                    )}
                />
            </OtpField>
            {error && <Error>Invalid code entered, if this behavior persists, please contact us</Error>}
            <CustomButtom text="Verify" handleClick={handleOTPVerification} isDisable={otp.length < 5} />
            {timerExpired ? (
                <CodeResend>Didn't get the code? <span onClick={handleResendCode}>Try again</span></CodeResend>
            ) : (
                <CodeResend>Resend code in {timer} seconds</CodeResend>
            )}
        </>
    );
};

export default OTPVerification;
