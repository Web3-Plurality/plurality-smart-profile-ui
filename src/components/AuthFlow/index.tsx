import SocialButton from "../SocialButton"
import mailIcon from './../../assets/svgIcons/mailIcon.svg'
import metamaskIcon from './../../assets/svgIcons/metamask-icon.svg'

import './styles.css'

interface AuthFlowProps {
    auth: string
    handleStepper: (step: string) => void
    handleMetamaskConnect: () => void
}

const AuthFlow = ({ auth, handleStepper, handleMetamaskConnect }: AuthFlowProps) => {
    const isRegister = auth === 'register'
    return (
        <>
            <div className='login-buttons'>
                <SocialButton text={`${isRegister ? 'Register' : 'Login'} with Email`} icon={mailIcon} handleClick={() => handleStepper('login')} />
                <SocialButton text={`${isRegister ? 'Register' : 'Login'} with Metamask`} icon={metamaskIcon} handleClick={handleMetamaskConnect} />
            </div>
            <div className="auth-footer">
                {isRegister ? (
                    <span>By proceeding I accept the <a href="#">terms of use</a>,
                        the creation of your <a href="#">metaverse profile</a> and subscribe to receive
                        <a href="#"> updates and emails</a>.</span>) : (
                    <span className="login">Don't have an account?
                        <span onClick={() => handleStepper('register')}> Register</span></span>
                )}
            </div >
        </>
    )
}

export default AuthFlow
