import { useAccount, useDisconnect } from 'wagmi';
import classNames from 'classnames';
import { showHeader } from '../../common/utils';
import { useStep } from '../../context/StepContext';
import CustomIcon from '../CustomIcon'
import Drawer from '../Drawer';
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { useNavigate } from 'react-router-dom';

const isIframe = window.location !== window.parent.location

const MobileHeader = ({ isSmallScreen }: { isSmallScreen: boolean }) => {
    const navigate = useNavigate()

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
        const smartprofileData = localStorage.getItem("smartProfileData")
        const tool = localStorage.getItem("tool")
        localStorage.clear();
        localStorage.setItem("smartProfileData", smartprofileData || '')
        localStorage.setItem("tool", tool || '')
        handleStepper("initial")
        navigate('/', { replace: true });
        window.location.reload();
    }


    const userOrbisData = localStorage.getItem('smartProfileData')
    const parssedUserOrbisData = userOrbisData ? JSON.parse(userOrbisData) : ''

    // const name = parssedUserOrbisData?.data?.smartProfile?.username
    const score = parssedUserOrbisData?.data?.smartProfile?.scores?.[0]?.score_value + parssedUserOrbisData?.data?.smartProfile?.scores?.[1]?.score_value


    return (
        <div className={classNames('mobile-header-wrapper', { iframeHeader: isIframe })}>
            <div className='user-detail-mobile'>
                <Drawer
                    handleLogout={handleLogout}
                    handleStepper={handleStepper}
                    address={metamaskAddress || litAddress}
                    isSmallScreen={isSmallScreen}
                />
            </div>
            <div className='mobile-scores'>
                <span>{score || 0}</span>
                <CustomIcon path={BadgeIcon} />
            </div>
        </div>
    )
}

export default MobileHeader
