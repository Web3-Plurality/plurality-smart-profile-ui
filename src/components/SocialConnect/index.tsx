import SocialProfiles from '../SocialProfiles';

interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    return (
        <SocialProfiles
            handleIconClick={handleIconClick}
            activeStates={activeStates}
        />
    )
}

export default SocialConnect;
