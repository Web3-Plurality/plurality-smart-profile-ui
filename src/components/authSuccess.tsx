/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import CustomButtom from "./customButton"
import { CLIENT_ID } from "../utils/EnvConfig"
import { getLocalStorageValueofClient } from "../utils/Helpers"
import { useStepper } from "../hooks/useStepper"

const AuthSuccess = () => {
    const { address: metamaskAddress } = useAccount()
    const { disconnectAsync } = useDisconnect()
    const { goToStep } = useStepper()
    const queryParams = new URLSearchParams(location.search)
    const clientId = queryParams.get("client_id") || CLIENT_ID
    const { litSession, userDid } = getLocalStorageValueofClient(`clientID-${clientId}`)

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

    let isDisabled
    if (!litSession) {
        isDisabled = userDid
    } else {
        isDisabled = false
    }

    return (
        <CustomButtom text={`Let's Go`} handleClick={handleNext} isDisable={!isDisabled} />
    )
}

export default AuthSuccess


