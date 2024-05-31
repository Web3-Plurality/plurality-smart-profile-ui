import CustomButtom from "../CustomButton"
import mailIcon from './../../assets/svgIcons/mailIcon.svg'
import metamaskIcon from './../../assets/svgIcons/metamask-icon.svg'

interface SelectLoginTypeProps {
    handleStepper: (step: string) => void
}

const SelectLoginType = ({ handleStepper }: SelectLoginTypeProps) => {
    return (
        <>
            <h1 className='header-text'>Login to you account</h1>
            <div className='login-buttons'>
                <CustomButtom text={'Login with Email'} icon={mailIcon} handleClick={() => handleStepper('email')} />
                <CustomButtom text={'Login with Metamask'} icon={metamaskIcon} />
            </div>
            <div >
                <p>Don't have an account? <span>Register</span></p>
            </div>
        </>
    )
}

export default SelectLoginType
