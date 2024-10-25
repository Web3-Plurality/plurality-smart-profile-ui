import { useDispatch } from 'react-redux';
import { goToStep } from '../Slice/stepperSlice';
import CustomButtom from './customButton'

const AuthSuccess = () => {
    const dispatch = useDispatch()
    const userDid = localStorage.getItem("userDid")
    const litSession = localStorage.getItem('sessionSigs')

    let isDisbaled;

    if (!litSession) {
        isDisbaled = userDid
    } else {
        isDisbaled = false
    }

    return (
        <CustomButtom text={`Let's Go`} handleClick={() => dispatch(goToStep('socialConnect'))} isDisable={!isDisbaled} />
    )
}

export default AuthSuccess
