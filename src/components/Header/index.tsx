/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount } from 'wagmi';
import classNames from 'classnames';
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg';
import './styles.css';
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
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { MenuOutlined } from '@ant-design/icons';
// import hamburgerIcon from './../../assets/svgIcons/hamburger.svg';

const isIframe = window.location !== window.parent.location;

const Header = () => {
    const [toggle, setToggle] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleLogoutUser = useLogoutUser();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { currentStep, goToStep } = useStepper();
    const shouldUpdate = useSelector(selectShouldUpdate);
    const isHeaderVisible = showHeader(currentStep);

    const { profileTypeStreamId, litWalletSig: litAccount, incentives: incentiveType } = getLocalStorageValueofClient(`clientID-${clientId}`);
    const { smartProfileData: parsedUserOrbisData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);

    const litAddress = litAccount ? JSON.parse(litAccount).address : '';
    const name = parsedUserOrbisData?.data?.smartProfile?.username;
    const score = parsedUserOrbisData?.data?.smartProfile?.scores?.[0]?.scoreValue + 
                 parsedUserOrbisData?.data?.smartProfile?.scores?.[1]?.scoreValue;
    const ratingValue = parsedUserOrbisData?.data?.smartProfile?.connectedPlatforms?.length;

    const { address: metamaskAddress } = useAccount();
    const route = window.location.pathname;
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        setToggle(!toggle);
    }, [shouldUpdate]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (!isHeaderVisible) return null;

    return (
        <div className={classNames('header-wrapper', { 
            iframeHeader: isIframe, 
            dashboard: route === '/dashboard',
            'mobile-view': isMobile
        })}>
            {route === '/dashboard' && (
                <img src={'/header-logo.png'} alt='logo' className='dashboard-logo' />
            )}

            {/* Desktop View - show full header */}
            {!isMobile  && (
                <>
                    {route === '/dashboard' && <div className='dashboard-header-links'>
                        <p className='link-1' onClick={() => navigate(`/?client_id=${clientId}`)}>Earn Points</p>
                        <p className='link-2'>Discover<span className='discover-coming-soon'>(Coming Soon)</span></p>
                    </div>}
                    <div className={classNames('user-detail', { userDetailDashboard: route === '/dashboard' })}>
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
                </>
            )}

            {/* Mobile Dashboard View - show hamburger menu */}
            {isMobile && route === '/dashboard' && (
                <>
                    <button className="hamburger-menu" onClick={toggleMobileMenu}>
                       {/* <BadgeIcon /> */}
                       <MenuOutlined />
                    </button>
                    
                    {mobileMenuOpen && (
                        <div className="mobile-dashboard-menu">
                            <div className="mobile-user-info">
                                <span className="mobile-user-name">{name || 'John Doe'}</span>
                                {incentiveType && incentiveType === 'POINTS' && (
                                    <div className='mobile-icon-box'>
                                        <span>{score || 0}</span>
                                        <CustomIcon path={BadgeIcon} />
                                    </div>
                                )}
                                {incentiveType && incentiveType === 'STARS' && (
                                    <div className="mobile-rating">
                                        <Rating initialValue={ratingValue} iconsCount={3} readonly={true} size={15} />
                                    </div>
                                )}
                            </div>
                            <div className="mobile-menu-links">
                                <p className='mobile-link' onClick={() => navigate(`/?client_id=${clientId}`)}>Earn Points</p>
                                <p className='mobile-link'>Discover<span className='discover-coming-soon'>(Coming Soon)</span></p>
                                <p className='mobile-link' onClick={() => goToStep('profileSettings')}>Profile Settings</p>
                                <p className='mobile-link' role='button' onClick={() => handleLogoutUser()}>Logout</p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Non-dashboard mobile view */}
            {isMobile && route !== '/dashboard' && (
                <div className='mobile-user-detail'>
                    <Drawer
                        handleLogout={handleLogoutUser}
                        address={metamaskAddress || litAddress}
                        isSmallScreen={true}
                    />
                </div>
            )}
        </div>
    );
};

export default Header;