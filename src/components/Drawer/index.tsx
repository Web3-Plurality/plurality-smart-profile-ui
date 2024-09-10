import { Dropdown, Menu, Space, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { UserAvatar } from '../Avatar';

import './styles.css'
import { useAuth } from '../../context/AuthContext';

interface DrawerProps {
    handleLogout: () => void;
    handleStepper: (val: string) => void;
    address: `0x${string}` | string
}

const Drawer = ({ handleLogout, handleStepper, address }: DrawerProps) => {

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address);
        message.success('Address copied!');
    };

    const { user } = useAuth()

    const handleMenuClick = (key: string) => {
        if (key === '1') {
            handleCopyAddress()
        } else if (key === '2') {
            handleStepper('digitalWardrobe');
        } else if (key === '3') {
            handleStepper('profileSettings')
        } else if (key === '4') {
            handleLogout();
        }
    };

    const userOrbisData = localStorage.getItem('smartProfileData')
    const parssedUserOrbisData = userOrbisData ? JSON.parse(userOrbisData) : ''

    const userAvatar = parssedUserOrbisData?.data?.smartProfile.avatar

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
        <Space direction="vertical">
            <Space wrap>
                <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
                    <div className="avatar">
                        {/* <UserAvatar address={address} size={46} /> */}
                        {userAvatar ? <img src={userAvatar} /> : <UserAvatar address={address} size={46} />}
                    </div>
                </Dropdown>
            </Space>
        </Space>
    )
}

export default Drawer;