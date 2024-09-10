import CustomButtom from '../CustomButton'
// import useRefreshOrbisData from '../../hooks/useRefreshOrbisData';


const AuthSuccess = ({ handleStepper }: { handleStepper: (val: string) => void }) => {
    const widgetHeader = document.getElementById('w-header');
    widgetHeader?.classList.remove('toogleShow')

    const userDid = localStorage.getItem("userDid")
    let isDisbaled;

    const litSession = localStorage.getItem('sessionSigs')
    if (!litSession) {
        isDisbaled = userDid
    } else {
        isDisbaled = false
    }

    // const { getPublicKey } = useMetamaskPublicKey()


    // const { getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, handleStepper, 'socialConnect')

    return (
        <CustomButtom text={`Let's Go`} handleClick={() => handleStepper('socialConnect')} isDisable={!isDisbaled} />
    )
}

export default AuthSuccess
