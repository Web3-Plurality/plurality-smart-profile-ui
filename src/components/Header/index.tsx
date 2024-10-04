import { useAccount, useDisconnect } from 'wagmi';
import classNames from 'classnames';
import { isProfileConnectPlatform, isRsmPlatform, showHeader } from '../../common/utils';
import { useStep } from '../../context/StepContext';
import CustomIcon from '../CustomIcon'
import Drawer from '../Drawer';
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';

const isIframe = window.location !== window.parent.location

const Header = () => {
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
        const clientId = localStorage.getItem("clientId")
        localStorage.clear();
        localStorage.setItem("smartProfileData", smartprofileData || '')
        localStorage.setItem("tool", tool || '')
        let path = '/'
        if (isRsmPlatform()) {
            path = `/rsm?client_id=${clientId}`;
        } else if (isProfileConnectPlatform()) {
            path = `/profile-connect?client_id=${clientId}`;
        }
        handleStepper("initial")
        navigate(path, { replace: true });
        window.location.reload();
    }

    const userOrbisData = localStorage.getItem('smartProfileData')
    const parssedUserOrbisData = userOrbisData ? JSON.parse(userOrbisData) : ''

    const name = parssedUserOrbisData?.data?.smartProfile?.username
    const score = parssedUserOrbisData?.data?.smartProfile?.scores?.[0]?.score_value + parssedUserOrbisData?.data?.smartProfile?.scores?.[1]?.score_value
    const ratingValue = parssedUserOrbisData?.data?.smartProfile?.connected_platforms?.length + 1

    const incentiveType = localStorage.getItem('incentives')

    return (
        <div className={classNames('header-wrapper', { iframeHeader: isIframe })}>
            <div className='user-detail'>
                <div className='user-info'>
                    <span>{name || 'John Doe'}</span>
                    {incentiveType && incentiveType === 'Points' && (
                        <div className='icon-box'>
                            <span>{score || 0}</span>
                            <CustomIcon path={BadgeIcon} />
                        </div>
                    )}

                    {incentiveType && incentiveType === 'Stars' && (
                        <div>
                            <Rating initialValue={ratingValue} iconsCount={4} readonly={true} size={15} />
                        </div>
                    )}

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
