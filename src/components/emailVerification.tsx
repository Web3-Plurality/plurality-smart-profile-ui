/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthenticate from "../hooks/useAuthenticate"
import useAccounts from "../hooks/useAccount"
import useSession from "../hooks/useSession"

import Loader from "./Loader"
import { PayloadDataType } from "../types"
import { message } from "antd"
import { ErrorMessages } from "../utils/Constants"
import { getLocalStorageValueofClient, isProfileConnectPlatform, isRsmPlatform } from "../utils/Helpers"
import { AuthMethodType } from "@lit-protocol/constants"
import { CLIENT_ID } from "../utils/EnvConfig"
import { useStepper } from "../hooks/useStepper"
interface EmailLoginProps {
    finalPayload: PayloadDataType
}

const EmailVerification = ({ finalPayload }: EmailLoginProps) => {
    const navigate = useNavigate();
    const { goToStep } = useStepper()
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { googleJwtToken: googleToken } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const handleNavigation = () => {
        let path = window.location.pathname
        if (isRsmPlatform() || isProfileConnectPlatform()) {
            path = `${window.location.pathname}?client_id=${clientId}`
        }
        navigate(path, { replace: true });
    }


    const {
        authMethod,
        setAuthMethod,
        authWithStytch,
        loading: authLoading,
        error: authError,
    } = useAuthenticate();

    const {
        createAccount,
        fetchAccounts,
        isFetchTriggered,
        accounts,
        loading: accountsLoading,
        error: accountsError,
    } = useAccounts();

    const {
        initSession,
        sessionSigs,
        loading: sessionLoading,
        error: sessionError,
    } = useSession();

    const error = authError || accountsError || sessionError;

    const goToSignUp = () => {
        handleNavigation()
        createAccount(authMethod!);
    }

    useEffect(() => {
        const registerInBackend = async () => {
            await authWithStytch(finalPayload.session, finalPayload.userId, finalPayload.method);
        }
        if (googleToken) {
            setAuthMethod({
                authMethodType: AuthMethodType.GoogleJwt,
                accessToken: googleToken
            })
        } else {
            registerInBackend()
        }
    }, [googleToken])

    useEffect(() => {
        // If user is authenticated, fetch accounts
        if (authMethod) {
            handleNavigation()
            fetchAccounts(authMethod);
        }
    }, [authMethod, fetchAccounts, navigate])

    useEffect(() => {
        // If user is authenticated and has selected an account, initialize session
        if (authMethod && accounts.length) {
            initSession(authMethod, accounts[0]);
            const existingDataString = localStorage.getItem(`clientID-${clientId}`)
            let existingData = existingDataString ? JSON.parse(existingDataString) : {}

            existingData = {
                ...existingData,
                pkpKey: accounts[0]
            }
            localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
        } else if (authMethod && !accounts.length && isFetchTriggered) {
            goToSignUp();
        }
    }, [JSON.stringify(accounts), initSession, isFetchTriggered])

    if (authLoading) {
        return (
            <Loader message={'Authenticating your credentials...'} />
        );
    }

    if (accountsLoading) {
        return <Loader message={'Looking up your accounts...'} />;
    }

    if (sessionLoading) {
        return <Loader message={'Securing your session...'} />;
    }
    if (accounts.length && sessionSigs) {
        goToStep("dashboard")
    }

    if (error) {
        goToStep("home")
        message.error(ErrorMessages.GENERAL_ERROR);
        return null
    }

    return
}

export default EmailVerification