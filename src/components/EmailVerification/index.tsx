import { useEffect, useRef } from "react"

import { PayloadDataType } from "../../globalTypes"
import useAuthenticate from "../../hooks/useAuthenticate"
import Loading from "../LitComponents/Loading"
import useAccounts from "../../hooks/useAccount"
import { useNavigate } from "react-router-dom"
import useSession from "../../hooks/useSession"
import Dashboard from "../LitComponents/Dashboard"

import './styles.css'


interface EmailLoginProps {
    finalPayload: PayloadDataType
    handleStepper: (step: string) => void
}

const EmailVerification = ({ finalPayload, handleStepper }: EmailLoginProps) => {
    const isEntered = useRef<boolean>(false);
    const navigate = useNavigate();
    const {
        authMethod,
        authWithStytch,
        loading: authLoading,
        error: authError,
    } = useAuthenticate();

    const {
        createAccount,
        fetchAccounts,
        setCurrentAccount,
        currentAccount,
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

    useEffect(() => {
        const registerInBackend = async () => {
            console.log("data", finalPayload.session, finalPayload.session, finalPayload.method)
            await authWithStytch(finalPayload.session, finalPayload.userId, finalPayload.method);
        }
        registerInBackend()
    }, [])

    const goToSignUp = () => {
        navigate(window.location.pathname, { replace: true });
        createAccount(authMethod!);
    }

    useEffect(() => {
        // If user is authenticated, fetch accounts
        if (authMethod) {
            navigate(window.location.pathname, { replace: true });
            fetchAccounts(authMethod);
        }
    }, [authMethod, fetchAccounts, navigate])

    useEffect(() => {
        // If user is authenticated and has selected an account, initialize session
        if (authMethod && accounts.length) {
            initSession(authMethod, accounts[0]);
        }
    }, [authMethod, JSON.stringify(accounts), initSession])

    if (authLoading) {
        return (
            <Loading copy={'Authenticating your credentials...'} error={error} />
        );
    }

    if (accountsLoading) {
        return <Loading copy={'Looking up your accounts...'} error={error} />;
    }

    if (sessionLoading) {
        return <Loading copy={'Securing your session...'} error={error} />;
    }
    if (accounts.length && sessionSigs) {
        return (
            <Dashboard currentAccount={accounts[0]} handleStepper={handleStepper} />
        );
    }

    if (authMethod && accounts.length === 0 && !isEntered.current) {
        isEntered.current = true;
        goToSignUp();
    }
}

export default EmailVerification
