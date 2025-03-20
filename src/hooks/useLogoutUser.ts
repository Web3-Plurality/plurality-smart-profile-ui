import { useAccount, useDisconnect } from "wagmi";
import { handleLocalStorageOnLogout, redirectUserOnLogout } from "../utils/Helpers";
import { CLIENT_ID } from "../utils/EnvConfig";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useStepper } from "./useStepper";
import { setSurprisedData } from "../Slice/userDataSlice";
import { useDispatch } from "react-redux";

export const useLogoutUser = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { goToStep, resetSteps } = useStepper()

    const { address: metamaskAddress } = useAccount();
    const { disconnectAsync } = useDisconnect();

    const queryParams = new URLSearchParams(location.search);
    const appClientId = queryParams.get('client_id')
    const clientId = appClientId || CLIENT_ID;

    const disconnectMetamask = async () => {
        try {
            await disconnectAsync();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLogout(errorMessage = '', litRedirect = false) {
        // Check if user is cinnected via Metamask
        if (metamaskAddress) {
            await disconnectMetamask()
        }

        // Update Local Storage on Logout
        handleLocalStorageOnLogout(clientId)

        // Get Redirect path to specific ClientID
        const redirectPath = redirectUserOnLogout(clientId, appClientId)

        // Error Message in case any API fails
        if (errorMessage) {
            message.error(errorMessage)
        }

        // Reset Stepper on logout
        // Set Current Step to Email field in case of lit login
        resetSteps()
        dispatch(setSurprisedData(false))
        navigate(redirectPath, { replace: true });
        if (!litRedirect) {
            // Relaod the page to get Fresh States and Data
            window.location.reload()
            return
        }
        goToStep("litLogin")
    }

    return handleLogout

}