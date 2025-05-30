import { Dropdown, Menu, Space, message, Drawer as AntDrawer } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import settingsIcon from './../../../assets/svgIcons/settings.svg';
import './styles.css';
import { UserAvatar } from '../../Avatar';
import { CLIENT_ID } from '../../../utils/EnvConfig';
import { getLocalStorageValueofClient } from '../../../utils/Helpers';
import { useStepper } from '../../../hooks/useStepper';
import { useState } from 'react';

interface DrawerProps {
    handleLogout: () => void;
    address: `0x${string}` | string;
    isSmallScreen?: boolean;
    isMobile: boolean;
    isTablet?: boolean;
}

const isIframe = window.location !== window.parent.location;

const Drawer = ({ handleLogout, address, isMobile, isTablet }: DrawerProps) => {
    const { goToStep } = useStepper();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const route= window.location.pathname;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`);
    const { smartProfileData: parsedUserOrbisData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);

    const userAvatar = parsedUserOrbisData?.data?.smartProfile.avatar;
    const username = parsedUserOrbisData?.data?.smartProfile.username;

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address);
        message.success('Address copied!');
    };

    const handleMenuClick = (key: string) => {
        if (key === '1') {
            handleCopyAddress();
        } else if (key === '2') {
            goToStep('digitalWardrobe');
        } else if (key === '3') {
            goToStep('profileSettings');
        } else if (key === '4') {
            handleLogout();
        }
    };

    const shortenAddress = (address: string): string => {
        const startChars = address.slice(0, 6);
        const endChars = address.slice(-4);
        return `${startChars}...${endChars}`;
    };

    const menu = (
        <Menu onClick={({ key }) => handleMenuClick(key)}>
            <Menu.Item key="1">
                {shortenAddress(address)} <CopyOutlined />
            </Menu.Item>
            <Menu.Item key="3">Profile Settings</Menu.Item>
            <Menu.Item key="4">Logout</Menu.Item>
        </Menu>
    );

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onClose = () => {
        setDrawerVisible(false);
    };

    // Mobile drawer content
    const mobileDrawerContent = (
        <div className="mobile-drawer-content">
            <div className="mobile-user-info">
                <div className="mobile-avatar">
                    {userAvatar ? (
                        <img src={userAvatar} alt="User avatar" />
                    ) : (
                        <UserAvatar address={address} size={64} />
                    )}
                </div>
                <div className="mobile-user-details">
                    <h3>{username || 'User'}</h3>
                    <p onClick={handleCopyAddress} className="address">
                        {shortenAddress(address)} <CopyOutlined />
                    </p>
                </div>
            </div>
            <div className="mobile-menu">
                <div className="mobile-menu-item" onClick={() => goToStep('profileSettings')}>
                    Profile Settings
                </div>
                {route === '/dashboard' && (
                    <>
                        <div className="mobile-menu-item" onClick={() => {}}>
                            Earn Points
                        </div>
                        <div className="mobile-menu-item" onClick={() => {}}>
                            Discover
                        </div>
                    </>
                )}
                <div className="mobile-menu-item" onClick={handleLogout}>
                    Logout
                </div>
            </div>
        </div>
    );

    if (isIframe) return null;

    return (
        <div className="drawer-wrapper">
            {/* Mobile View - Show drawer */}
            {isMobile ? (
                <>
                    <div className="mobile-trigger" onClick={showDrawer}>
                        {userAvatar ? (
                            <img src={userAvatar} alt="User avatar" className="mobile-avatar-img" />
                        ) : (
                            <UserAvatar address={address} size={32} />
                        )}
                    </div>
                    <AntDrawer
                        placement="right"
                        onClose={onClose}
                        visible={drawerVisible}
                        width="80%"
                        closable={false}
                        bodyStyle={{ padding: 0 }}
                    >
                        {mobileDrawerContent}
                    </AntDrawer>
                </>
            ) : (
                /* Tablet/Desktop View - Show dropdown */
                <Dropdown 
                    overlay={menu} 
                    placement="bottomRight" 
                    trigger={['click']}
                    overlayClassName={isTablet ? 'tablet-dropdown' : 'desktop-dropdown'}
                >
                    <div className="avatar-trigger">
                        {userAvatar ? (
                            <img 
                                src={userAvatar} 
                                alt="User avatar" 
                                className={isTablet ? 'tablet-avatar' : 'desktop-avatar'} 
                            />
                        ) : (
                            <UserAvatar 
                                address={address} 
                                size={isTablet ? 40 : 46} 
                            />
                        )}
                    </div>
                </Dropdown>
            )}
        </div>
    );
};

export default Drawer;