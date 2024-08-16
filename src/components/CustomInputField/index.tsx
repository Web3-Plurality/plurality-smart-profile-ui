import { ChangeEvent } from 'react';
import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import './styles.css';


type CustomInputFieldProps = {
    InputType: string;
    name: string;
    placeholderText?: string;
    value?: string; // Use only string for text inputs
    id?: string;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomInputField = ({
    InputType,
    name,
    id,
    placeholderText,
    value,
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
                />
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
        />
    );
};

export default CustomInputField;
