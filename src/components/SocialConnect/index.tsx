
import { useEffect } from 'react';
import { useStep } from '../../context/StepContext';
import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import useRefreshOrbisData from '../../hooks/useRefreshOrbisData';
import SocialProfiles from '../SocialProfiles';
interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const { getPublicKey } = useMetamaskPublicKey()
    const { handleStepper, stepHistory } = useStep();
    const { getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, handleStepper, 'socialConnect')

    useEffect(() => {
        const prevStep = stepHistory[stepHistory.length - 2];
        if (prevStep !== "socialConnect") {
            getSmartProfileFromOrbis()
        }

    }, [])

    return (
        <SocialProfiles
            metaverse={false}
            handleIconClick={handleIconClick}
            activeStates={activeStates}
        />
    )
}

export default SocialConnect;
