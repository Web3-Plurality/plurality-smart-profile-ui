/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount } from 'wagmi';
import classNames from 'classnames';
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { Rating } from 'react-simple-star-rating';
import { getLocalStorageValueofClient, showHeader } from '../../utils/Helpers';
import CustomIcon from '../customIcon';
import { useSelector } from 'react-redux';
import Drawer from './Drawer';
import { selectShouldUpdate } from '../../selectors/headerSelector';
import { useEffect, useState } from 'react';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { useLogoutUser } from '../../hooks/useLogoutUser';
import { useStepper } from '../../hooks/useStepper';

const isIframe = window.location !== window.parent.location

const Header = () => {
    const [toggle, setToggle] = useState(false)
    const handleLogoutUser = useLogoutUser()

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { currentStep } = useStepper()
    const shouldUpdate = useSelector(selectShouldUpdate);
    const isHeaderVisible = showHeader(currentStep)

    const { profileTypeStreamId, litWalletSig: litAccount, incentives: incentiveType } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const {
        smartProfileData: parssedUserOrbisData,
    } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const litAddress = litAccount ? JSON.parse(litAccount).address : '';

    const name = parssedUserOrbisData?.data?.smartProfile?.username
    const score = parssedUserOrbisData?.data?.smartProfile?.scores?.[0]?.scoreValue + parssedUserOrbisData?.data?.smartProfile?.scores?.[1]?.scoreValue
    const ratingValue = parssedUserOrbisData?.data?.smartProfile?.connectedPlatforms?.length

    const { address: metamaskAddress } = useAccount();

    useEffect(() => {
        setToggle(!toggle)
    }, [shouldUpdate])

    if (!isHeaderVisible) return

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
                    handleLogout={handleLogoutUser}
                    address={metamaskAddress || litAddress}
                />
            </div>
        </div>
    )
}

export default Header
