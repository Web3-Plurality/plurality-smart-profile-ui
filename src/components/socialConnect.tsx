import { useEffect, useState } from 'react';
import useRefreshOrbisData from '../hooks/useRefreshOrbisData';
import Loader from './Loader';
import { useMetamaskPublicKey } from '../hooks/useMetamaskPublicKey';
import SocialProfiles from './socialProfiles';
import { CLIENT_ID } from '../utils/EnvConfig';
import { getLocalStorageValueofClient } from '../utils/Helpers';
interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const [, setRefresh] = useState(false)
    const { getPublicKey } = useMetamaskPublicKey()
    const { loading, getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, 'socialConnect')

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId, userDid } = getLocalStorageValueofClient(`clientID-${clientId}`);

    useEffect(() => {
        if (profileTypeStreamId && userDid) {
            getSmartProfileFromOrbis(profileTypeStreamId, JSON.stringify(userDid))
        }
    }, [profileTypeStreamId, userDid])

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
