import { useState } from "react";
import { useStytch } from "@stytch/react";
import { OTPCodeEmailOptions } from "@stytch/vanilla-js";
import { useStep } from "../context/StepContext";

export default function useStychLogin(email: string, handleMethodId?: (id: string) =>  void) {
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const { handleStepper, stepHistory } = useStep();

    const stytchClient = useStytch();

    const sendPasscode = async () => {
        try {
            setLoading(true)
            setError('')

            const templateId = import.meta.env.VITE_APP_EMAIL_TEMPLATE_ID!;
            const options: OTPCodeEmailOptions = {
                login_template_id: templateId,
                expiration_minutes: 2
            }

                localStorage.setItem("user", email);

                const response = await stytchClient.otps.email.loginOrCreate(email, options);
    
                handleMethodId?.(response.method_id);

                if(stepHistory[stepHistory.length - 1] !== 'otp'){
                    handleStepper('otp')
                }
                setLoading(false)
        } catch (err: unknown) {
            setLoading(false)
            setError("Something goes wrong while sending the passcode, please try it again");
        } finally {
            setLoading(false);
        }
    }

    return {
        sendPasscode,
        setError,
        loading,
        error
    }
}


