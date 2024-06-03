import { useEffect, useState } from "react"
// import CustomButtom from "../CustomButton"
// import CustomInputField from "../CustomInputField"

import './styles.css'
import { Spin } from "antd"


interface EmailLoginProps {
    handleStepper: (step: string) => void
}

const EmailVerification = ({ handleStepper }: EmailLoginProps) => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])

    useEffect(() => {
        if (!isLoading) {
            handleStepper('success')
        }
    }, [isLoading, handleStepper])

    return (
        <div className="email-verification">
            {isLoading ? <h1>Verifiying Your Eamil</h1> : <h1>EmailVerified</h1>}
            {isLoading && <Spin />}
        </div>
    )
}

export default EmailVerification
