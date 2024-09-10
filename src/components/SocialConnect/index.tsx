
import { useEffect } from 'react';
import { useStep } from '../../context/StepContext';
import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import useRefreshOrbisData from '../../hooks/useRefreshOrbisData';
import SocialProfiles from '../SocialProfiles';
import Loading from '../LitComponents/Loading';
interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const { getPublicKey } = useMetamaskPublicKey()
    const { handleStepper, stepHistory } = useStep();
    const { loading, getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, handleStepper, 'socialConnect')

    useEffect(() => {
        const prevStep = stepHistory[stepHistory.length - 2];
        if (prevStep !== "socialConnect") {
            getSmartProfileFromOrbis()
        }

    }, [])

    if (loading) {
        const widgetHeader = document.getElementById('w-header');
        widgetHeader?.classList.add('toogleShow')
        return <Loading copy={'Looking up your accounts...'} />;
    } else {
        const widgetHeader = document.getElementById('w-header');
        widgetHeader?.classList.remove('toogleShow')
    }

    return (
        <SocialProfiles
            metaverse={false}
            handleIconClick={handleIconClick}
            activeStates={activeStates}
        />
    )
}

export default SocialConnect;
