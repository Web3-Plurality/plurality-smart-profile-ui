import { ChangeEvent } from 'react';
import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import CustomEditIcon from './../../assets/svgIcons/edit-icon.svg'
// import { EditOutlined } from '@ant-design/icons';
import './styles.css';


type CustomInputFieldProps = {
    InputType: string;
    name: string;
    placeholderText?: string;
    value?: string; // Use only string for text inputs
    id?: string;
    isDisable?: boolean;
    onEdit?: () => void
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomInputField = ({
    InputType,
    name,
    id,
    isDisable,
    placeholderText,
    value,
    onEdit,
    handleChange
}: CustomInputFieldProps) => {
    if (InputType === 'file') {
        return (
            <>
                <Input
                    type="file"
                    id={id}
                    className='input-field preview'
                    name={name}
                    onChange={handleChange}
                />
            </>
        );
    }

    if (InputType === 'textarea') {
        return (
            <div className='text-area-container'>
                <TextArea
                    className='input-field bio'
                    autoSize={{ minRows: 3 }}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholderText}
                    disabled={isDisable}
                />
                <div className='edit-icon-bio' onClick={onEdit}>
                    <img src={CustomEditIcon} />
                </div>
            </div>
        );
    }

    return (
        <Input
            className='input-field'
            name={name}
            type={InputType}
            value={value}
            onChange={handleChange}
            placeholder={placeholderText}
            disabled={isDisable}
            suffix={
                <div
                    style={{ position: 'absolute', top: 5, right: 10, cursor: 'pointer' }}
                    onClick={onEdit}
                >
                    <img src={CustomEditIcon} />
                </div>

            }
        />
    );
};

export default CustomInputField;
