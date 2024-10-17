import SocialButton from "./socialButton"
import mailIcon from './../../assets/svgIcons/mailIcon.svg'
import metamaskIcon from './../../assets/svgIcons/metamask-icon.svg'

interface HomeProps {
    handleLitConnect: () => void
    handleMetamaskConnect: () => void
}

const Home = ({ handleLitConnect, handleMetamaskConnect }: HomeProps) => {
    return (
        <>
            <SocialButton
                text={'Login with Email'}
                icon={mailIcon}
                handleClick={handleLitConnect}
                style={"translateY(2px)"}
            />

            <SocialButton
                text={'Login with Metamask'}
                icon={metamaskIcon}
                handleClick={handleMetamaskConnect}
            />
        </>
    )
}

export default Home