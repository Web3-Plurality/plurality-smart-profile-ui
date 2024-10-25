import { useEffect, useState } from 'react';
import CustomButtom from "./customButton";
import { connectOrbisDidPkh } from '../services/orbis/getOrbisDidPkh';
import { AuthUserInformation } from '@useorbis/db-sdk';
import { useDispatch } from "react-redux"
import { goToStep } from "../Slice/stepperSlice"
import { setLoadingState } from "../Slice/userDataSlice";
import { LoaderMessages } from '../utils/Constants';

interface DashboardProps {
    currentAccount: string;
}

export default function Dashboard({
    currentAccount
}: DashboardProps) {
    const [btnDisable, setBtnDisable] = useState(true)
    const dispatch = useDispatch()
    useEffect(() => {
        const connectToOris = async () => {
            dispatch(setLoadingState({ loadingState: false, text: LoaderMessages.LIT_PROFILE_SETUP }))
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
            if (result === "error") {
                console.error("Error connecting to Orbis");
                setBtnDisable(true)
                dispatch(setLoadingState({ loadingState: false, text: '' }))
            } else if (result && result.did) {
                setBtnDisable(false)
                localStorage.setItem('userDid', JSON.stringify(result.did))
                dispatch(setLoadingState({ loadingState: false, text: '' }))
            }
        }
        connectToOris()
    }, [])

    return (
        <div className="dashboard-container">
            <h1>Ready for the open web</h1>
            <div className="details-card">
                <span>My address: </span>
                <p>{currentAccount?.toLowerCase()}</p>
            </div>
            <div className="divider"></div>
            <div className="message-card">
                <CustomButtom text='Next' isDisable={btnDisable} handleClick={() => dispatch(goToStep('success'))} />
            </div>
        </div>
    );
}
