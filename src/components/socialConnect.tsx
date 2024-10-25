import { useEffect, useState } from 'react';
import useRefreshOrbisData from '../hooks/useRefreshOrbisData';
import Loader from './Loader';
import { useMetamaskPublicKey } from '../hooks/useMetamaskPublicKey';
import SocialProfiles from './socialProfiles';

interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const [, setRefresh] = useState(false)
    const { getPublicKey } = useMetamaskPublicKey()
    const { loading, getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, 'socialConnect')
    const profileTypeStreamId = localStorage.getItem("profileTypeStreamId") || '';

    useEffect(() => {
        getSmartProfileFromOrbis(profileTypeStreamId)
    }, [])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {

            if (event.data && event.data.data === 'refresh') {
                setRefresh(prev => !prev);
            }
        };
        window.addEventListener('message', handleMessage);
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
