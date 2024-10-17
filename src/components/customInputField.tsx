import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const InputField = styled(Input)`
    width: 392px;
    padding: 10px 15px;
    background-color: #EFEFEF;
    border: 1px solid #e1dbdb;
    border-radius: 12px;
    box-shadow: 8px 8px 15px #a3a3a3, -8px -8px 15px #ffffff;
    transition: all 0.3s ease;
    outline: none;
    color: #333;

    &:hover {
        border: 1px solid #e1dbdb;
    }

    &:focus {
        box-shadow: 4px 4px 8px #a3a3a3, -4px -4px 8px #ffffff;
        background: #f5f5f5;
        border: none;
    }

    &.bio {
        width: 100%;
        box-sizing: border-box;
        resize: none;
    }
`;

const StyledTextAreaContainer = styled.div`
    position: relative;
    width: 390px;
`;

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
            <Input
                type="file"
                id={id}
                name={name}
                onChange={handleChange}
            />
        );
    }

    if (InputType === 'textarea') {
        return (
            <StyledTextAreaContainer>
                <TextArea
                    className='bio'
                    autoSize={{ minRows: 3 }}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholderText}
                />
            </StyledTextAreaContainer>
        );
    }

    return (
        <InputField
            name={name}
            type={InputType}
            value={value}
            onChange={handleChange}
            placeholder={placeholderText}
        />
    );
};

export default CustomInputField;
