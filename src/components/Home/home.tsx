import SocialButton from "./socialButton"
import mailIcon from './../../assets/svgIcons/mailIcon.svg'
import metamaskIcon from './../../assets/svgIcons/metamask-icon.svg'
import google from './../../assets/svgIcons/google.svg'

interface HomeProps {
    handleLitConnect: () => void
    handleMetamaskConnect: () => void
    handleGoogleConnect: () => void
    authentication: {
        email: boolean
        gmail: boolean
        wallet: boolean
    }
}

const Home = ({ handleLitConnect, handleMetamaskConnect, handleGoogleConnect, authentication }: HomeProps) => {
    const { email, gmail, wallet } = authentication
    return (
        <>
            {gmail && <SocialButton
                text={'Continue with Google'}
                icon={google}
                handleClick={handleGoogleConnect}
                style={"translateY(2px)"}
            />}

            {email && <SocialButton
                text={'Continue with Email'}
                icon={mailIcon}
                handleClick={handleLitConnect}
                style={"translateY(2px)"}
            />}

            {wallet && <SocialButton
                text={'Continue with Metamask'}
                icon={metamaskIcon}
                handleClick={handleMetamaskConnect}
            />}
        </>
    )
}

export default Home