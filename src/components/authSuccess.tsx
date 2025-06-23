/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import CustomButtom from "./customButton"
import { useStepper } from "../hooks/useStepper"

const AuthSuccess = () => {
    const { address: metamaskAddress } = useAccount()
    const { disconnectAsync } = useDisconnect()
    const { goToStep } = useStepper()

    const handleNext = async () => {
        if (metamaskAddress) {
            try {
                await disconnectAsync()
            } catch (err) {
                console.error(err)
            }
        }
        goToStep('socialConnect')
    }

    useEffect(() => {
        const isInIframe = window.self !== window.top
        const detailsCard = document.querySelector(".details-card")

        if (!isInIframe && detailsCard) {
            detailsCard.classList.add("outside-iframe")
        } else if (detailsCard) {
            detailsCard.classList.remove("outside-iframe")
        }
    }, [])

    return (
        <CustomButtom text={`Let's Go`} handleClick={handleNext}/>
    )
}

export default AuthSuccess


