import { useDispatch, useSelector } from "react-redux";
import { selectCurrentStep } from "../selectors/stepperSelector";
import { goToStep } from "../Slice/stepperSlice";
import { setLoadingState } from "../Slice/userDataSlice";
import { message } from "antd";
import { ErrorMessages, LoaderMessages } from "../utils/Constants";
import axios from "axios";
import { API_BASE_URL } from '../utils/EnvConfig';

export default function useStychLogin(email: string, setEmailId?: (id: string) => void) {

    const currentStep = useSelector(selectCurrentStep)
    const dispatch = useDispatch()

    const sendPasscode = async () => {
        try {
            dispatch(setLoadingState({ loadingState: true, text: LoaderMessages.STYCH_OTP_SEND }))

            localStorage.setItem("user", email);

            const url = `${API_BASE_URL}/user/auth/otp/login`
            const { data } = await axios.post(url, { email })
            console.log(data)
            setEmailId?.(data?.emailId)
            // localStorage.setItem("emailId", response?.data?.emailId)

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


