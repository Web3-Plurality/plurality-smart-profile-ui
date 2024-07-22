import { useAccount, useDisconnect } from 'wagmi';
import { showHeader } from '../../common/utils';
import { useStep } from '../../context/StepContext';
import CustomIcon from '../CustomIcon'
import Drawer from '../Drawer';
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()

    const { stepHistory, handleStepper } = useStep();
    const currentStep = stepHistory[stepHistory.length - 1];
    const isHeaderVisible = showHeader(currentStep)

    const litAccount = localStorage.getItem('lit-wallet-sig')
    let litAddress = ''
    if (litAccount) {
        litAddress = JSON.parse(litAccount).address
    }

    const { disconnectAsync } = useDisconnect();
    const { address: metamaskAddress } = useAccount();

    if (!isHeaderVisible) return

    async function handleLogout() {
        try {
            await disconnectAsync();
        } catch (err) {
            console.error(err);
        }
        localStorage.clear();
        handleStepper("initial")
        navigate('/', { replace: true });
    }



    return (
        <div className='header-wrapper'>
            <div className='user-detail'>
                <div className='user-info'>
                    <span>John Doe</span>
                    <div className='icon-box'>
                        <CustomIcon path={BadgeIcon} />
                    </div>
                </div>
                <Drawer
                    handleLogout={handleLogout}
                    handleStepper={handleStepper}
                    address={metamaskAddress ?? litAddress ?? ''}
                />
            </div>
        </div>
    )
}

export default Header
