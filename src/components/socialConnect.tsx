import { useEffect, useState } from 'react';
import useRefreshOrbisData from '../hooks/useRefreshOrbisData';
import Loader from './Loader';
import { CLIENT_ID } from '../utils/EnvConfig';
import { getLocalStorageValueofClient } from '../utils/Helpers';
import SocialProfiles from './SocialProfiles';
import { useSelector } from 'react-redux';
import { selectIframeToProfile } from '../selectors/userDataSelector';
interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const [, setRefresh] = useState(false)
    const [shouldRender, setShouldRender] = useState(false);

    const handleShouldProfilesRender = () => {
        setShouldRender(true)
    }
    const isIframe = window.location !== window.parent.location;
    const iframeToProfile = useSelector(selectIframeToProfile)

    const { loading, getSmartProfileFromOrbis } = useRefreshOrbisData('socialConnect', handleShouldProfilesRender)

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId, userId} = getLocalStorageValueofClient(`clientID-${clientId}`);

    useEffect(() => {
        if (profileTypeStreamId && userId) {
            getSmartProfileFromOrbis(profileTypeStreamId, userId)
        }
    }, [profileTypeStreamId, userId])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {

            if (event.data && event.data.data === 'refresh') {
                setRefresh(prev => !prev);
            }
        };
        window.addEventListener('message', handleMessage);
    }, [])

    if (loading || (isIframe && !shouldRender && !iframeToProfile)) {
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
