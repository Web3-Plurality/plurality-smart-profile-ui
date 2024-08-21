import SocialProfiles from '../SocialProfiles';

interface SocialConnectProps {
    activeStates: boolean[]
    handleIconClick: (idx: number) => void
}

const MetaverseHub = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    return (
        <SocialProfiles
            metaverse={true}
            activeStates={activeStates}
            handleIconClick={handleIconClick}
        />
    );
}

export default MetaverseHub;