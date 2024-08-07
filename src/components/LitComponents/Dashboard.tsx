import CustomButtom from '../CustomButton';

interface DashboardProps {
    currentAccount: string;
    handleStepper: (val: string) => void
}

export default function Dashboard({
    currentAccount,
    handleStepper
}: DashboardProps) {

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
