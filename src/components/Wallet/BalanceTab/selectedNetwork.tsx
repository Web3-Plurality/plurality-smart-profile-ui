import { CaretDownFilled } from "@ant-design/icons";

const SelectedNetwork = ({ name, icon }: { name: string, icon: string }) => {
    return (
        <div className="dropdown-wrapper">
            <div className="selected-network">
                <img src={icon} alt="polygon" />
                <span>{name}</span>
                <CaretDownFilled style={{ fontSize: '12px' }} />
            </div>
        </div>
    );
};

export default SelectedNetwork;
