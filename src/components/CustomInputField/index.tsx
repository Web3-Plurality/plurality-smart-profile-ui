import { Input } from 'antd'
import './styles.css'

interface CustomInputFieldProps {
    InputType: string
}

const CustomInputField = ({ InputType }: CustomInputFieldProps) => {
    return (
        <Input className='input-field' type={InputType} placeholder='Enter you email' />
    )
}

export default CustomInputField
