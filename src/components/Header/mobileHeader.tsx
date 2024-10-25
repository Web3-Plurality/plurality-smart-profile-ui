/* eslint-disable react-hooks/exhaustive-deps */
import { useAccount, useDisconnect } from 'wagmi';
import classNames from 'classnames';
import { isProfileConnectPlatform, isRsmPlatform, showHeader } from './../../utils/Helpers'
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import Drawer from './Drawer';
import CustomIcon from '../customIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentStep } from '../../selectors/stepperSelector';
import { goToStep } from '../../Slice/stepperSlice';
import { selectShouldUpdate } from '../../selectors/headerSelector';
import { useEffect, useState } from 'react';

const isIframe = window.location !== window.parent.location

const MobileHeader = ({ isSmallScreen }: { isSmallScreen: boolean }) => {
    const [toggle, setToggle] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const currentStep = useSelector(selectCurrentStep);
    const shouldUpdate = useSelector(selectShouldUpdate);
    const isHeaderVisible = showHeader(currentStep)

    const litAccount = localStorage.getItem('lit-wallet-sig')
    const litAddress = litAccount ? JSON.parse(litAccount).address : '';

    const { disconnectAsync } = useDisconnect();
    const { address: metamaskAddress } = useAccount();

    useEffect(() => {
        setToggle(!toggle)
    }, [shouldUpdate])


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
        dispatch(goToStep('home'))
        navigate(path, { replace: true });
        window.location.reload();
    }


    const userOrbisData = localStorage.getItem('smartProfileData')
    const parssedUserOrbisData = userOrbisData ? JSON.parse(userOrbisData) : ''

    const incentiveType = localStorage.getItem('incentives')

    // const name = parssedUserOrbisData?.data?.smartProfile?.username
    const score = parssedUserOrbisData?.data?.smartProfile?.scores?.[0]?.score_value + parssedUserOrbisData?.data?.smartProfile?.scores?.[1]?.score_value
    const ratingValue = parssedUserOrbisData?.data?.smartProfile?.connected_platforms?.length

    return (
        <div className={classNames('mobile-header-wrapper', { iframeHeader: isIframe })}>
            <div className='user-detail-mobile'>
                <Drawer
                    handleLogout={handleLogout}
                    address={metamaskAddress || litAddress}
                    isSmallScreen={isSmallScreen}
                />
            </div>
            {currentStep !== "profileSettings" && (<div className='mobile-scores'>
                {incentiveType && incentiveType === 'POINTS' && (
                    <>
                        <span>{score || 0}</span>
                        <CustomIcon path={BadgeIcon} />
                    </>
                )}
                {incentiveType && incentiveType === 'STARS' && <Rating initialValue={ratingValue} iconsCount={3} readonly={true} size={15} />}

            </div>)}
        </div>
    )
}

export default MobileHeader
