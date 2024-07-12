import { useEffect } from "react"

import { PayloadDataType } from "../../globalTypes"
import useAuthenticate from "../../hooks/useAuthenticate"
import Loading from "../LitComponents/Loading"
import useAccounts from "../../hooks/useAccount"
import { useNavigate } from "react-router-dom"
import CreateAccount from "../LitComponents/CreateAccount"
import useSession from "../../hooks/useSession"
import Dashboard from "../LitComponents/Dashboard"
import AccountSelection from "../LitComponents/AccountSelection"

import './styles.css'


interface EmailLoginProps {
    finalPayload: PayloadDataType
    handleStepper: (step: string) => void
}

const EmailVerification = ({ finalPayload, handleStepper }: EmailLoginProps) => {
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
            await authWithStytch(finalPayload.session, finalPayload.session, finalPayload.method);
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
        if (authMethod && currentAccount) {
            initSession(authMethod, currentAccount);
        }
    }, [authMethod, currentAccount, initSession])

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
    if (currentAccount && sessionSigs) {
        return (
            <Dashboard currentAccount={currentAccount} handleStepper={handleStepper} />
        );
    }
    if (authMethod && accounts.length > 0) {
        return (
            <AccountSelection
                accounts={accounts}
                setCurrentAccount={setCurrentAccount}
                error={error}
            />
        );
    }

    if (authMethod && accounts.length === 0) {
        return <CreateAccount signUp={goToSignUp} error={error} />;
    }
}

export default EmailVerification
