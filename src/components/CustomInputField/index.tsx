import { ChangeEvent } from 'react'
import { Input } from 'antd'
import './styles.css'

interface CustomInputFieldProps {
    InputType: string
    value: string,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const CustomInputField = ({ InputType, value, handleChange }: CustomInputFieldProps) => {
    return (
        <Input
            className='input-field'
            type={InputType}
            value={value}
            onChange={handleChange}
            placeholder='Enter you email'
        />
    )
}

export default CustomInputField
