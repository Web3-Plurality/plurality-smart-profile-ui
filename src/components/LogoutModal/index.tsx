// import { Modal, Button } from 'antd';
// // import './styles.css'

// const customModalStyle = {
//     width: '300px', // Reduced width
//     borderRadius: '8px', // Rounded corners
//     padding: '16px',
//     backgroundColor: "red"
// };

// const buttonStyle = {
//     display: 'inline-block',
//     margin: '0 8px',
// };

// interface ModalProps {
//     isVisible: boolean
//     handleOk: () => void
//     handleCancel: () => void
// }

// const LogoutModal = ({ isVisible, handleOk, handleCancel }: ModalProps) => {
//     return (
//         <Modal
//             open={isVisible}
//             onOk={handleOk}
//             onCancel={handleCancel}
//             okText="Yes"
//             cancelText="No"
//             maskClosable={false}
//             closable={false}
//             style={customModalStyle}
//             footer={[
//                 <Button key="cancel" onClick={handleCancel} style={buttonStyle}>
//                     No
//                 </Button>,
//                 <Button key="ok" type="primary" onClick={handleOk} style={buttonStyle}>
//                     Yes
//                 </Button>,
//             ]}
//         >
//             <h1>User will be logged out. Try Again?</h1>
//         </Modal>
//     );
// };

// export default LogoutModal;

import { Modal, Button } from 'antd';
import './styles.css';

// Import the custom CSS
interface ModalProps {
    isVisible: boolean
    handleOk: () => void
    handleCancel: () => void
}

const LogoutModal = ({ isVisible, handleOk, handleCancel }: ModalProps) => {
    return (
        <Modal
            open={isVisible}
            okText="Yes"
            cancelText="No"
            footer={null}
            closable={false}
            maskClosable={false}
            wrapClassName="custom-modal-wrapper"
        >
            <div className="custom-modal-content">
                <p className="custom-modal-text">Are you sure? You will be logged out!</p>
                <div className="custom-modal-footer">
                    <Button className="custom-modal-button custom-modal-button-no" onClick={handleCancel}>
                        Yes
                    </Button>
                    <Button className="custom-modal-button custom-modal-button-yes" onClick={handleOk}>
                        No
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default LogoutModal;
