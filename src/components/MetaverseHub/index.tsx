import { useEffect } from 'react';
import { useStep } from '../../context/StepContext';
import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import useRefreshOrbisData from '../../hooks/useRefreshOrbisData';
import SocialProfiles from '../SocialProfiles';
import Loading from '../LitComponents/Loading';

interface SocialConnectProps {
    activeStates: boolean[]
    handleIconClick: (idx: number) => void
}

const MetaverseHub = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const { getPublicKey } = useMetamaskPublicKey()
    const { handleStepper } = useStep();
    const { loading, getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, handleStepper, 'metaverseHub')

    useEffect(() => {
        getSmartProfileFromOrbis()
    }, [])

    if (loading) {
        const widgetHeader = document.getElementById('w-header');
        widgetHeader?.classList.add('toogleShow')
        return <Loading copy={'Looking up your profiles...'} />;
    } else {
        const widgetHeader = document.getElementById('w-header');
        widgetHeader?.classList.remove('toogleShow')
    }


    return (
        <SocialProfiles
            metaverse={true}
            activeStates={activeStates}
            handleIconClick={handleIconClick}
        />
    );
}

export default MetaverseHub;