import { useEffect } from 'react';
import { useStep } from '../../context/StepContext';
import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import useRefreshOrbisData from '../../hooks/useRefreshOrbisData';
import SocialProfiles from '../SocialProfiles';

interface SocialConnectProps {
    activeStates: boolean[]
    handleIconClick: (idx: number) => void
}

const MetaverseHub = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const { getPublicKey } = useMetamaskPublicKey()
    const { handleStepper } = useStep();
    const { getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, handleStepper, 'metaverseHub')

    useEffect(() => {
        getSmartProfileFromOrbis()
    }, [])

    return (
        <SocialProfiles
            metaverse={true}
            activeStates={activeStates}
            handleIconClick={handleIconClick}
        />
    );
}

export default MetaverseHub;