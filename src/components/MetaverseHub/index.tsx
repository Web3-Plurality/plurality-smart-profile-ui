import SocialProfiles from '../SocialProfiles';

interface SocialConnectProps {
    handleStepper: (step: string) => void
    setSelectedProfile: (profile: string) => void
}

const MetaverseHub = ({ handleStepper, setSelectedProfile }: SocialConnectProps) => {

    const handleProfileClick = (socialProfile: string) => {
        setSelectedProfile(socialProfile)
        handleStepper('socialConfirmation')
    }

    return (
        <SocialProfiles
            metaverse={true}
            handleClick={handleProfileClick}
        />
    );
}

export default MetaverseHub;