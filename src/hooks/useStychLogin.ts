import { useStytch } from "@stytch/react";
import { OTPCodeEmailOptions } from "@stytch/vanilla-js";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentStep } from "../selectors/stepperSelector";
import { goToStep } from "../Slice/stepperSlice";
import { setLoadingState } from "../Slice/userDataSlice";
import { message } from "antd";
import { ErrorMessages, LoaderMessages } from "../utils/Constants";

export default function useStychLogin(email: string, setMethodId?: (id: string) => void) {

    const currentStep = useSelector(selectCurrentStep)
    const dispatch = useDispatch()
    const stytchClient = useStytch();

    const sendPasscode = async () => {
        try {
            dispatch(setLoadingState({ loadingState: true, text: LoaderMessages.STYCH_OTP_SEND }))

            const templateId = import.meta.env.VITE_APP_EMAIL_TEMPLATE_ID!;
            const options: OTPCodeEmailOptions = {
                login_template_id: templateId,
                expiration_minutes: 2
            }

            localStorage.setItem("user", email);
            const response = await stytchClient.otps.email.loginOrCreate(email, options);
            setMethodId?.(response.method_id);

            if (currentStep !== 'otp') {
                dispatch(goToStep('otp'))
            }
            dispatch(setLoadingState({ loadingState: false, text: '' }))
        } catch (err: unknown) {
            message.error(ErrorMessages.STYCH_EMAIL_LOGIN_ERROR);
            dispatch(goToStep('litEmail'))
            console.log(err)
        } finally {
            dispatch(setLoadingState({ loadingState: false, text: '' }))
        }
    }

    return { sendPasscode }
}


