/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount, useDisconnect } from 'wagmi';
import classNames from 'classnames';
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { isProfileConnectPlatform, isRsmPlatform, showHeader } from '../../utils/Helpers';
import CustomIcon from '../customIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentStep } from '../../selectors/stepperSelector';
import { resetSteps } from '../../Slice/stepperSlice';
import Drawer from './Drawer';
import { selectShouldUpdate } from '../../selectors/headerSelector';
import { useEffect, useState } from 'react';

const isIframe = window.location !== window.parent.location

const Header = () => {
    const [toggle, setToggle] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const currentStep = useSelector(selectCurrentStep)
    const shouldUpdate = useSelector(selectShouldUpdate);
    const isHeaderVisible = showHeader(currentStep)

    const litAccount = localStorage.getItem('lit-wallet-sig')
    const litAddress = litAccount ? JSON.parse(litAccount).address : '';

    const userOrbisData = localStorage.getItem('smartProfileData')
    const parssedUserOrbisData = userOrbisData ? JSON.parse(userOrbisData) : ''

    const name = parssedUserOrbisData?.data?.smartProfile?.username
    const score = parssedUserOrbisData?.data?.smartProfile?.scores?.[0]?.scoreValue + parssedUserOrbisData?.data?.smartProfile?.scores?.[1]?.scoreValue
    const ratingValue = parssedUserOrbisData?.data?.smartProfile?.connected_platforms?.length

    const incentiveType = localStorage.getItem('incentives')

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
        dispatch(resetSteps())
        navigate(path, { replace: true });
        window.location.reload();
    }



    return (
        <div className={classNames('header-wrapper', { iframeHeader: isIframe })}>
            <div className='user-detail'>
                <div className='user-info'>
                    <span>{name || 'John Doe'}</span>
                    {incentiveType && incentiveType === 'POINTS' && (
                        <div className='icon-box'>
                            <span>{score || 0}</span>
                            <CustomIcon path={BadgeIcon} />
                        </div>
                    )}

                    {incentiveType && incentiveType === 'STARS' && (
                        <div>
                            <Rating initialValue={ratingValue} iconsCount={3} readonly={true} size={15} />
                        </div>
                    )}

                </div>
                <Drawer
                    handleLogout={handleLogout}
                    address={metamaskAddress || litAddress}
                />
            </div>
        </div>
    )
}

export default Header
