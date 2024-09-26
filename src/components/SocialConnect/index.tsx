
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
                getSmartProfileFromOrbis(localStorage.getItem("streamId")!)
            }

    }, [])

    if (loading) {
        const widgetHeader = document.getElementById('w-header');
        const widgetFooter = document.getElementById('w-footer');
        widgetHeader?.classList.add('toogleShow')
        widgetFooter?.classList.add('toogleShow')
        return <Loading copy={'Looking up your profiles...'} />;
    } else {
        const widgetHeader = document.getElementById('w-header');
        const widgetFooter = document.getElementById('w-footer');
        widgetHeader?.classList.remove('toogleShow')
        widgetFooter?.classList.remove('toogleShow')
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
