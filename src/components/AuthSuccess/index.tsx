import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import CustomButtom from '../CustomButton'
// import useRefreshOrbisData from '../../hooks/useRefreshOrbisData';


const AuthSuccess = ({ handleStepper }: { handleStepper: (val: string) => void }) => {
    const widgetHeader = document.getElementById('w-header');
    widgetHeader?.classList.remove('toogleShow')

    const isAuthenticated = localStorage.getItem("userDid")

    // const { getPublicKey } = useMetamaskPublicKey()


    // const { getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, handleStepper, 'socialConnect')

    return (
        <CustomButtom text={`Lets's Go`} handleClick={() => handleStepper('socialConnect')} isDisable={!isAuthenticated} />
    )
}

export default AuthSuccess
