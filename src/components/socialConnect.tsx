
import { useEffect } from 'react';
import useRefreshOrbisData from '../hooks/useRefreshOrbisData';
import Loader from './Loader';
import { useMetamaskPublicKey } from '../hooks/useMetamaskPublicKey';
import SocialProfiles from './socialProfiles';

interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const { getPublicKey } = useMetamaskPublicKey()
    const { loading, getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, 'socialConnect')
    const streamId = localStorage.getItem("streamId") || '';

    useEffect(() => {
        getSmartProfileFromOrbis(streamId)
    }, [])

    if (loading) {
        return <Loader message={'Looking up your profiles...'} />;
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
