import { useAccount, useDisconnect } from 'wagmi';
import classNames from 'classnames';
import { showHeader } from '../../common/utils';
import { useStep } from '../../context/StepContext';
import CustomIcon from '../CustomIcon'
import Drawer from '../Drawer';
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const isIframe = window.location !== window.parent.location

const Header = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const { stepHistory, handleStepper } = useStep();
    const currentStep = stepHistory[stepHistory.length - 1];
    const isHeaderVisible = showHeader(currentStep)

    const litAccount = localStorage.getItem('lit-wallet-sig')
    const litAddress = litAccount ? JSON.parse(litAccount).address : '';

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
        <div className={classNames('header-wrapper', { iframeHeader: isIframe })}>
            <div className='user-detail'>
                <div className='user-info'>
                    <span>{user?.username || 'John Doe'}</span>
                    <div className='icon-box'>
                        <CustomIcon path={BadgeIcon} />
                    </div>
                </div>
                <Drawer
                    handleLogout={handleLogout}
                    handleStepper={handleStepper}
                    address={metamaskAddress || litAddress}
                />
            </div>
        </div>
    )
}

export default Header
