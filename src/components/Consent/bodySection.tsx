import { CLIENT_ID } from "../../utils/EnvConfig";
import { getLocalStorageValueofClient } from "../../utils/Helpers";

const CONSENT_ITEMS_LIST = [
    'Interests',
    'Reputation',
    'Badges',
    'Collections',
    'Connected Platform IDs'
]

const ConsentBody = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { platformName } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    return (
        <>
            <p className='consent-title'>
                You are allowing <span>{platformName}</span> to access data from your <span>XSmartProfile</span>:
            </p>
            <ul>
                {CONSENT_ITEMS_LIST.map((item) => (
                    <li>{item}</li>
                ))}
            </ul>
            <br />
            <hr />
            <p className='consent-warning'>Make sure you trust TheApp.</p>
            <p className='risks-info'>Learn about the <span onClick={() => {
                window.open('https://plurality.network/privacy-policy/', '_blank')
            }}>privacy policy</span> and <span onClick={() => {
                window.open('https://plurality.network/user-terms-of-service/', '_blank')
            }}>terms of service</span></p >
        </>
    )
}

export default ConsentBody
