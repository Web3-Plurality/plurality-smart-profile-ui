/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useAccount, useDisconnect } from "wagmi"
import CustomButtom from "./customButton"
import { connectOrbisDidPkh } from "../services/orbis/getOrbisDidPkh"
import type { AuthUserInformation } from "@useorbis/db-sdk"
import { setLoadingState } from "../Slice/userDataSlice"
import { LoaderMessages } from "../utils/Constants"
import { CLIENT_ID } from "../utils/EnvConfig"
import { getLocalStorageValueofClient } from "../utils/Helpers"
import { useStepper } from "../hooks/useStepper"

const AuthSuccess = () => {
    const dispatch = useDispatch()
    const { address: metamaskAddress } = useAccount()
    const { disconnectAsync } = useDisconnect()
    const { goToStep } = useStepper()
    const queryParams = new URLSearchParams(location.search)
    const clientId = queryParams.get("client_id") || CLIENT_ID
    const { litSession, userDid } = getLocalStorageValueofClient(`clientID-${clientId}`)

    useEffect(() => {
        const connectToOris = async () => {
            dispatch(setLoadingState({ loadingState: true, text: LoaderMessages.LIT_PROFILE_SETUP }))
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh()
            if (result === "error") {
                dispatch(setLoadingState({ loadingState: false, text: "" }))
            } else if (result && result.did) {
                const existingDataString = localStorage.getItem(`clientID-${clientId}`)
                let existingData = existingDataString ? JSON.parse(existingDataString) : {}

                existingData = {
                    ...existingData,
                    userDid: result.did,
                }
                localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
                dispatch(setLoadingState({ loadingState: false, text: "" }))
            } else {
                dispatch(setLoadingState({ loadingState: false, text: "" }))
            }
        }

        if (!userDid) {
            connectToOris()
        }
    }, [])

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


