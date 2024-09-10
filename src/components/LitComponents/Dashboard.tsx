import { useEffect, useState } from 'react';
import CustomButtom from '../CustomButton';
import { connectOrbisDidPkh } from '../../common/orbis';
import { AuthUserInformation } from '@useorbis/db-sdk';
import Loading from './Loading';

interface DashboardProps {
    currentAccount: string;
    handleStepper: (val: string) => void
}

export default function Dashboard({
    currentAccount,
    handleStepper
}: DashboardProps) {
    const [btnDisable, setBtnDisable] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
            if (result === "error") {
                console.error("Error connecting to Orbis");
                setBtnDisable(true)
                setIsLoading(false)
            } else if (result && result.did) {
                setBtnDisable(false)
                localStorage.setItem('userDid', JSON.stringify(result.did))
                setIsLoading(false)
            }
        })()
    }, [])

    if (isLoading) {
        const widgetHeader = document.getElementById('w-header');
        widgetHeader?.classList.add('toogleShow')
        return <Loading copy={'Setting up your profiles...'} />;
    } else {
        const widgetHeader = document.getElementById('w-header');
        widgetHeader?.classList.remove('toogleShow')
    }

    return (
        <div className="dashboard-container">
            <h1>Ready for the open web</h1>
            <div className="details-card">
                <p>My address: {currentAccount?.toLowerCase()}</p>
            </div>
            <div className="divider"></div>
            <div className="message-card">
                <CustomButtom text='Next' isDisable={btnDisable} handleClick={() => handleStepper('success')} />
            </div>
        </div>
    );
}
