import SocialButton from "./socialButton"
import mailIcon from './../../assets/svgIcons/mailIcon.svg'
import metamaskIcon from './../../assets/svgIcons/metamask-icon.svg'
import google from './../../assets/svgIcons/google.svg'

interface HomeProps {
    handleLitConnect: () => void
    handleMetamaskConnect: () => void
    handleGoogleConnect: () => void
}

const Home = ({ handleLitConnect, handleMetamaskConnect, handleGoogleConnect }: HomeProps) => {
    return (
        <>
            <SocialButton
                text={'Continue with Google'}
                icon={google}
                handleClick={handleGoogleConnect}
                style={"translateY(2px)"}
            />

            <SocialButton
                text={'Continue with Email'}
                icon={mailIcon}
                handleClick={handleLitConnect}
                style={"translateY(2px)"}
            />

            <SocialButton
                text={'Continue with Metamask'}
                icon={metamaskIcon}
                handleClick={handleMetamaskConnect}
            />
        </>
    )
}

export default Home