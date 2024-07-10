import { useEffect, useState } from "react"
import axios from "axios"
// import CustomButtom from "../CustomButton"
// import CustomInputField from "../CustomInputField"

import './styles.css'
import { Spin } from "antd"
import { PayloadDataType } from "../../globalTypes"
import useAuthenticate from "../../hooks/useAuthenticate"
import Loading from "../Loading"
import useAccounts from "../../hooks/useAccount"
import { useNavigate } from "react-router-dom"
import CreateAccount from "../CreateAccount"
import useSession from "../../hooks/useSession"
import Dashboard from "../Dashboard"
import AccountSelection from "../AccountSelection"


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
            // const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/stytch`

            // setLoading(true)

            // axios.post(apiUrl, {
            //     data: finalPayload
            // })
            //     .then(function (response) {
            //         if (response.status === 200) {
            //             setLoading(false)
            //             handleStepper('success')
            //         }
            //     })
            //     .catch((err: Error) => {
            //         setLoading(false)
            //         console.log("Error:", err)
            //         setError('Something goes wrong, please try again!')
            //     })

            await authWithStytch(finalPayload.session, finalPayload.session, finalPayload.method);
        }
        registerInBackend()
    }, [])

    const goToSignUp = () => {
        navigate(window.location.pathname, { replace: true });
        createAccount(authMethod);
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

    console.log(currentAccount, sessionSigs)

    if (currentAccount && sessionSigs) {
        return (
            <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
        );
    }

    return (
        <>
            Hello
            {/* {!error && (
                <div className="email-verification">
                    {authLoading ? <h1>Verifiying Your Eamil</h1> : <h1>EmailVerified</h1>}
                    {authLoading && <Spin />}
                </div>
            )} */}
        </>
    )
}

export default EmailVerification
