import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { UserAvatar } from '../Avatar';

interface DrawerProps {
    handleLogout: () => void;
    handleStepper: (val: string) => void;
    address: `0x${string}` | undefined
}

const Drawer = ({ handleLogout, handleStepper, address }: DrawerProps) => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span role='button' tabIndex={0} onClick={handleLogout}>Logout</span>
            ),
        },
        {
            key: '2',
            label: (
                <span role='button' tabIndex={0} onClick={() => handleStepper('digitalWardrobe')}>Digital Wardrobe</span>
            ),
        },

    ];

    return (
        <Space direction="vertical">
            <Space wrap>
                <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
                    <div className="avatar">
                        <UserAvatar address={address} />
                    </div>
                </Dropdown>
            </Space>
        </Space>
    )
}

export default Drawer;