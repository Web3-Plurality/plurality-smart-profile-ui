import { Dropdown, Menu, Space } from 'antd';
import { UserAvatar } from '../Avatar';

import './styles.css'

interface DrawerProps {
    handleLogout: () => void;
    handleStepper: (val: string) => void;
    address: `0x${string}` | undefined
}

const Drawer = ({ handleLogout, handleStepper, address }: DrawerProps) => {
    const handleMenuClick = (key: string) => {
        if (key === '1') {
            handleLogout();
        } else if (key === '2') {
            handleStepper('digitalWardrobe');
        }
    };

    const menu = (
        <Menu onClick={({ key }) => handleMenuClick(key)}>
            <Menu.Item key="1">Logout</Menu.Item>
            <Menu.Item key="2">Digital Wardrobe</Menu.Item>
        </Menu>
    );

    return (
        <Space direction="vertical">
            <Space wrap>
                <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
                    <div className="avatar">
                        <UserAvatar address={address} />
                    </div>
                </Dropdown>
            </Space>
        </Space>
    )
}

export default Drawer;