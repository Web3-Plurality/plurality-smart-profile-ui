/* eslint-disable react-hooks/exhaustive-deps */
import { useAccount } from 'wagmi';
import classNames from 'classnames';
import { getLocalStorageValueofClient, showHeader } from './../../utils/Helpers'
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'
import { Rating } from 'react-simple-star-rating';
import Drawer from './Drawer';
import CustomIcon from '../customIcon';
import { useSelector } from 'react-redux';
import { selectShouldUpdate } from '../../selectors/headerSelector';
import { useEffect, useState } from 'react';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { useLogoutUser } from '../../hooks/useLogoutUser';
import { useStepper } from '../../hooks/useStepper';

const isIframe = window.location !== window.parent.location

const MobileHeader = ({ isSmallScreen }: { isSmallScreen: boolean }) => {
    const [toggle, setToggle] = useState(false)
    const handleLogoutUser = useLogoutUser()

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { profileTypeStreamId, litWalletSig: litAccount, incentives: incentiveType } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const { currentStep } = useStepper()
    const shouldUpdate = useSelector(selectShouldUpdate);
    const isHeaderVisible = showHeader(currentStep)


    const litAddress = litAccount ? JSON.parse(litAccount).address : '';
    const { address: metamaskAddress } = useAccount();

    const {
        smartProfileData: parssedUserOrbisData,

    } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    useEffect(() => {
        setToggle(!toggle)
    }, [shouldUpdate])


    if (!isHeaderVisible) return

    const score = parssedUserOrbisData?.data?.smartProfile?.scores?.[0]?.scoreValue + parssedUserOrbisData?.data?.smartProfile?.scores?.[1]?.scoreValue
    const ratingValue = parssedUserOrbisData?.data?.smartProfile?.connectedPlatforms?.length

    return (
        <>
            {isIframe ? <Drawer
                handleLogout={handleLogoutUser}
                address={metamaskAddress || litAddress}
                isSmallScreen={isSmallScreen}
            /> : (
                <div className={classNames('mobile-header-wrapper', { iframeHeader: isIframe })}>
                    <div className='user-detail-mobile'>
                        <Drawer
                            handleLogout={handleLogoutUser}
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
            )}
        </>

    )
}

export default MobileHeader