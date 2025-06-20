/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useStepper } from '../hooks/useStepper';
import { useAccount, useDisconnect } from 'wagmi';
import CustomButtom from './customButton';
// import { sendProfileConnectedEvent } from '../utils/sendEventToParent';

interface DashboardProps {
    currentAccount: string;
}

export default function Dashboard({
    currentAccount
}: DashboardProps) {
    const { address: metamaskAddress } = useAccount();
    const { disconnectAsync } = useDisconnect();
    const { goToStep } = useStepper()

    useEffect(() => {

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
