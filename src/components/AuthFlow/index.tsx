import SocialButton from "../SocialButton"
import mailIcon from './../../assets/svgIcons/mailIcon.svg'
import metamaskIcon from './../../assets/svgIcons/metamask-icon.svg'

import './styles.css'

interface AuthFlowProps {
    handleStepper: (step: string) => void
    handleMetamaskConnect: () => void
}

const AuthFlow = ({ handleStepper, handleMetamaskConnect }: AuthFlowProps) => {
    return (
        <>
            <div className='login-buttons'>
                <SocialButton text={'Login with Email'} icon={mailIcon} handleClick={() => handleStepper('login')} />
                <SocialButton text={'Login with Metamask'} icon={metamaskIcon} handleClick={handleMetamaskConnect} />
            </div>
        </>
    )
}

export default AuthFlow
