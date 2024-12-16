import { useDisconnect } from "wagmi";
import { getLocalStorageValueofClient, handleLocalStorageOnLogout, redirectUserOnLogout } from "../utils/Helpers";
import { CLIENT_ID } from "../utils/EnvConfig";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useStepper } from "./useStepper";

export const useLogoutUser = () => {
    const navigate = useNavigate()

    const { goToStep, resetSteps } = useStepper()

    const { disconnectAsync } = useDisconnect();

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const disconnectMetamask = async () => {
        try {
            await disconnectAsync();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLogout(errorMessage = '', litRedirect = false) {
        // Check if user is cinnected via Metamask
        const { metamaskAddress } = getLocalStorageValueofClient(`clientID-${clientId}`)
        if (metamaskAddress) {
            await disconnectMetamask()
        }

        // Update Local Storage on Logout
        handleLocalStorageOnLogout(clientId)

        // Get Redirect path to specific ClientID
        const redirectPath = redirectUserOnLogout(clientId)

        // Error Message in case any API fails
        if (errorMessage) {
            message.error(errorMessage)
        }

        // Reset Stepper on logout
        // Set Current Step to Email field in case of lit login
        resetSteps()
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