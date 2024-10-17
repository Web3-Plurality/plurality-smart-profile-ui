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
