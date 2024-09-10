import { useEffect } from 'react';
import CustomButtom from '../CustomButton';
import { connectOrbisDidPkh } from '../../common/orbis';
import { AuthUserInformation } from '@useorbis/db-sdk';

interface DashboardProps {
    currentAccount: string;
    handleStepper: (val: string) => void
}

export default function Dashboard({
    currentAccount,
    handleStepper
}: DashboardProps) {
    useEffect(() => {
        (async () => {
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
            if (result === "error") {
                // Handle error case if needed
                console.error("Error connecting to Orbis");
            } else if (result && result.did) {
                localStorage.setItem('userDid', JSON.stringify(result.did))
            }
        })()
    }, [])

    return (
        <div className="dashboard-container">
            <h1>Ready for the open web</h1>
            <div className="details-card">
                <p>My address: {currentAccount?.toLowerCase()}</p>
            </div>
            <div className="divider"></div>
            <div className="message-card">
                <CustomButtom text='Next' handleClick={() => handleStepper('success')} />
            </div>
        </div>
    );
}
