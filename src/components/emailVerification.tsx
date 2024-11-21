/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthenticate from "../hooks/useAuthenticate"
import useAccounts from "../hooks/useAccount"
import useSession from "../hooks/useSession"

import Loader from "./Loader"
import { PayloadDataType } from "../types"
import { useDispatch } from "react-redux"
import { goToStep } from "../Slice/stepperSlice"
import { message } from "antd"
import { ErrorMessages } from "../utils/Constants"
import { getLocalStorageValue, isProfileConnectPlatform, isRsmPlatform } from "../utils/Helpers"
import { AuthMethodType } from "@lit-protocol/constants"
interface EmailLoginProps {
    finalPayload: PayloadDataType
}

const EmailVerification = ({ finalPayload }: EmailLoginProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const googleToken = getLocalStorageValue('googleAccessToken')

    const handleNavigation = () => {
        const clientId = localStorage.getItem('clientId')
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
                authMethodType: AuthMethodType.Google,
                accessToken: googleToken
            })
        } else {
            registerInBackend()
        }
    }, [googleToken])

    useEffect(() => {
        // If user is authenticated, fetch accounts
        console.log('Enyere here 1')
        if (authMethod) {
            console.log('Enyere here')
            handleNavigation()
            fetchAccounts(authMethod);
        }
    }, [authMethod, fetchAccounts, navigate])

    useEffect(() => {
        // If user is authenticated and has selected an account, initialize session
        if (authMethod && accounts.length) {
            initSession(authMethod, accounts[0]);
            localStorage.setItem("pkpKey", JSON.stringify(accounts[0]))
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
        dispatch(goToStep("dashboard"))
    }

    if (error) {
        dispatch(goToStep("home"))
        message.error(ErrorMessages.GENERAL_ERROR);
        return null
    }

    return
}

export default EmailVerification