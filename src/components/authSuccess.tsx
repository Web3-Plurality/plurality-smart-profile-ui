

import CustomButtom from './customButton'
import { getLocalStorageValueofClient } from '../utils/Helpers';
import { CLIENT_ID } from '../utils/EnvConfig';
import { useStepper } from '../hooks/useStepper';

const AuthSuccess = () => {
    const { goToStep } = useStepper()
    const queryParams = new URLSearchParams(location.search);
    const clientTypeId = queryParams.get('client_id') || CLIENT_ID;

    const { litSession, userDid } = getLocalStorageValueofClient(`clientID-${clientTypeId}`)

    let isDisbaled;

    if (!litSession) {
        isDisbaled = userDid
    } else {
        isDisbaled = false
    }

    return (
        <CustomButtom text={`Let's Go`} handleClick={() => goToStep('socialConnect')} isDisable={!isDisbaled} />
    )
}

export default AuthSuccess
