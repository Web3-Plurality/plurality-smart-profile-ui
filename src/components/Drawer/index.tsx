import { Dropdown, Menu, Space } from 'antd';



const Drawer = ({ handleLogout, handleStepper }: { handleLogout: () => void, handleStepper: (val: string) => void }) => {
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
                    <div className="avatar"></div>
                </Dropdown>
            </Space>
        </Space>
    )
}

export default Drawer;