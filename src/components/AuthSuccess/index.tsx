import CustomButtom from '../CustomButton'


const AuthSuccess = ({ handleStepper }: { handleStepper: (val: string) => void }) => {
    const widgetHeader = document.getElementById('w-header');
    widgetHeader?.classList.remove('toogleShow')
    return (
        <CustomButtom text={`Lets's Go`} handleClick={() => handleStepper('socialConnect')} />
    )
}

export default AuthSuccess
