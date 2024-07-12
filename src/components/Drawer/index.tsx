import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';



const Drawer = ({ handleLogout, handleStepper }: { handleLogout: () => void, handleStepper: (val: string) => void }) => {
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
                    <div className="avatar"></div>
                </Dropdown>
            </Space>
        </Space>
    )
}

export default Drawer;