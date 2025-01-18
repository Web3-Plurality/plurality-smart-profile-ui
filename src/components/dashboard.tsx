/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import CustomButtom from "./customButton";
import { connectOrbisDidPkh } from '../services/orbis/getOrbisDidPkh';
import { AuthUserInformation } from '@useorbis/db-sdk';
import { useDispatch } from "react-redux"
import { setLoadingState } from "../Slice/userDataSlice";
import { LoaderMessages } from '../utils/Constants';
import { CLIENT_ID } from '../utils/EnvConfig';
import { getLocalStorageValueofClient } from '../utils/Helpers';
import { useStepper } from '../hooks/useStepper';
import { useAccount, useDisconnect } from 'wagmi';
// import { sendProfileConnectedEvent } from '../utils/sendEventToParent';

interface DashboardProps {
    currentAccount: string;
}

export default function Dashboard({
    currentAccount
}: DashboardProps) {
    const dispatch = useDispatch()
    const { address: metamaskAddress } = useAccount();
    const { disconnectAsync } = useDisconnect();
    const { goToStep } = useStepper()
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { userDid } = getLocalStorageValueofClient(`clientID-${clientId}`)

    useEffect(() => {
        const connectToOris = async () => {
            dispatch(setLoadingState({ loadingState: true, text: LoaderMessages.LIT_PROFILE_SETUP }))
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
            if (result === "error") {
                dispatch(setLoadingState({ loadingState: false, text: '' }))
            } else if (result && result.did) {
                const existingDataString = localStorage.getItem(`clientID-${clientId}`)
                let existingData = existingDataString ? JSON.parse(existingDataString) : {}

                existingData = {
                    ...existingData,
                    userDid: result.did
                }
                localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
                dispatch(setLoadingState({ loadingState: false, text: '' }))
            } else {
                dispatch(setLoadingState({ loadingState: false, text: '' }))
            }
        }

        if (!userDid) {
            connectToOris()
            // if (!consent && !consent?.accepted && !consent?.rejected) {
            //     sendProfileConnectedEvent()
            // }
        }

        const disconnectMetamask = async () => {
            if (metamaskAddress) {
                try {
                    await disconnectAsync();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        disconnectMetamask()
    }, [])

    useEffect(() => {
        const isInIframe = window.self !== window.top;

        const detailsCard = document.querySelector('.details-card');

        if (!isInIframe && detailsCard) {
            detailsCard.classList.add('outside-iframe');
        } else if (detailsCard) {
            detailsCard.classList.remove('outside-iframe');
        }
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Ready for the open web</h1>
            <div className="details-card">
                <span>My address: </span>
                <p>{currentAccount?.toLowerCase()}</p>
            </div>
            <div className="divider"></div>
            <div className="message-card">
                <CustomButtom text='Next' handleClick={() => goToStep('success')} />
            </div>
        </div>
    );
}
