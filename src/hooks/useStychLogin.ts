import { useDispatch } from "react-redux";
import { setLoadingState } from "../Slice/userDataSlice";
import { message } from "antd";
import { ErrorMessages, LoaderMessages } from "../utils/Constants";
import axios from "axios";
import { API_BASE_URL } from '../utils/EnvConfig';
import { CLIENT_ID } from "../utils/EnvConfig";
import { useRegisterEvent } from "./useEventListner";
import { useStepper } from "./useStepper";

export default function useStychLogin(email: string, setEmailId?: (id: string) => void) {

    const dispatch = useDispatch()
    const { goToStep, resetSteps, currentStep } = useStepper()

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const {
        registerEvent
    } = useRegisterEvent()
    const sendPasscode = async () => {
        try {
            dispatch(setLoadingState({ loadingState: true, text: LoaderMessages.STYCH_OTP_SEND }))

            const existingDataString = localStorage.getItem(`clientID-${clientId}`)
            let existingData = existingDataString ? JSON.parse(existingDataString) : {}

            existingData = {
                ...existingData,
                user: email
            }
            localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))

            const url = `${API_BASE_URL}/auth/otp/login`
            const { data } = await axios.post(url, { email })
            if (data?.redirectToGoogle) {
                // inform user to use google login method instead of stytch
                message.info(data?.message)
                resetSteps()
                registerEvent('');
                // open the google Login window
                return
            }
            setEmailId?.(data?.emailId)

            if (currentStep !== 'otp') {
                goToStep('otp')
            }
            dispatch(setLoadingState({ loadingState: false, text: '' }))
        } catch (err: unknown) {
            message.error(ErrorMessages.STYCH_EMAIL_LOGIN_ERROR);
            resetSteps()
            goToStep('litEmail')
            console.log(err)
        } finally {
            dispatch(setLoadingState({ loadingState: false, text: '' }))
        }
    }

    return { sendPasscode }
}


