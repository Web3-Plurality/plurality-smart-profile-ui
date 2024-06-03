import CustomButtom from '../CustomButton'


const AuthSuccess = ({ handleStepper }: { handleStepper: (val: string) => void }) => {
    return (
        <CustomButtom text={`Lets's Go`} handleClick={() => handleStepper('socialConnect')} />
    )
}

export default AuthSuccess
