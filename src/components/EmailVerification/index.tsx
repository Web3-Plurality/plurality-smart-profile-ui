import { useEffect, useState } from "react"
import axios from "axios"
// import CustomButtom from "../CustomButton"
// import CustomInputField from "../CustomInputField"

import './styles.css'
import { Spin } from "antd"
import { PayloadDataType } from "../../globalTypes"


interface EmailLoginProps {
    finalPayload: PayloadDataType
    handleStepper: (step: string) => void
}

const EmailVerification = ({ finalPayload, handleStepper }: EmailLoginProps) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const registerInBackend = () => {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/stytch`

            setLoading(true)

            axios.post(apiUrl, {
                data: finalPayload
            })
                .then(function (response) {
                    if (response.status === 200) {
                        setLoading(false)
                        handleStepper('success')
                    }
                })
                .catch((err: Error) => {
                    setLoading(false)
                    console.log("Error:", err)
                    setError('Something goes wrong, please try again!')
                })
        }
        registerInBackend()
    }, [])


    return (
        <>
            {!error && (
                <div className="email-verification">
                    {loading ? <h1>Verifiying Your Eamil</h1> : <h1>EmailVerified</h1>}
                    {loading && <Spin />}
                </div>
            )}
        </>
    )
}

export default EmailVerification
