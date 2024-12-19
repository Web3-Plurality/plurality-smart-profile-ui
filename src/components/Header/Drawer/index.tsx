import { Dropdown, Menu, Space, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import settingsIcon from './../../../assets/svgIcons/settings.svg'

import './styles.css'
import { UserAvatar } from '../../Avatar';
import { CLIENT_ID } from '../../../utils/EnvConfig';
import { getLocalStorageValueofClient, getParentUrl } from '../../../utils/Helpers';
import { useEffect } from 'react';
import { useStepper } from '../../../hooks/useStepper';


interface DrawerProps {
    handleLogout: () => void;
    address: `0x${string}` | string
    isSmallScreen?: boolean
}

const isIframe = window.location !== window.parent.location
const Drawer = ({ handleLogout, address, isSmallScreen }: DrawerProps) => {
    const { goToStep } = useStepper()
    const parentUrl = getParentUrl()
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { smartProfileData: parssedUserOrbisData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const userAvatar = parssedUserOrbisData?.data?.smartProfile.avatar
    const username = parssedUserOrbisData?.data?.smartProfile.username
    const ratingValue = parssedUserOrbisData?.data?.smartProfile?.connectedPlatforms?.length

    useEffect(() => {
        window.parent.postMessage({ eventName: 'userData', data: { name: username, avatar: userAvatar, rating: ratingValue } }, parentUrl);
    }, [userAvatar, username, ratingValue, parentUrl])

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address);
        message.success('Address copied!');
    };

    const handleMenuClick = (key: string) => {
        if (key === '1') {
            handleCopyAddress()
        } else if (key === '2') {
            goToStep('digitalWardrobe');
        } else if (key === '3') {
            goToStep('profileSettings');
        } else if (key === '4') {
            handleLogout();
        }
    };



    const shortenAddress = (address: string): string => {
        const startChars = address.slice(0, 6); // Take first 6 characters
        const endChars = address.slice(-4); // Take last 4 characters
        return `${startChars}...${endChars}`;
    };

    const menu = (
        <Menu onClick={({ key }) => handleMenuClick(key)}>
            <Menu.Item key="1">
                {shortenAddress(address)} <CopyOutlined />
            </Menu.Item>
            {/* <Menu.Item key="2">Digital Wardrobe</Menu.Item> */}

            <Menu.Item key="3">Profile Settings</Menu.Item>
            <Menu.Item key="4">Logout</Menu.Item>
        </Menu>
    );


    return (
        <>
            {isIframe ? <></> : (
                <Space direction="vertical" className='options-wrapper'>
                    <Space wrap>
                        <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
                            <div>
                                {isSmallScreen && <img src={settingsIcon} className='mobile-header-icon' />}
                                {!isSmallScreen && <div className="avatar">
                                    {userAvatar ? <img src={userAvatar} /> : <UserAvatar address={address} size={46} />}
                                </div>}
                            </div>
                        </Dropdown>
                    </Space>
                </Space>
            )}
        </>

    )
}

export default Drawer;