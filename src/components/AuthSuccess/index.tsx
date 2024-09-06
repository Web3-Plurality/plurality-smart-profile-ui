import { useEffect, useState } from 'react';
import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import CustomButtom from '../CustomButton'
import { BASE_URL, socialConnectButtons } from '../../common/constants';
import { insertSmartProfile, select, selectSmartProfiles } from '../../common/orbis';
import { decryptData, encryptData } from '../../common/utils';
import axios from 'axios';
import useRefreshOrbisData from '../../hooks/useRefreshOrbisData';


const AuthSuccess = ({ handleStepper }: { handleStepper: (val: string) => void }) => {
    const widgetHeader = document.getElementById('w-header');
    widgetHeader?.classList.remove('toogleShow')

    const { getPublicKey } = useMetamaskPublicKey()


    const { getSmartProfileFromOrbis } = useRefreshOrbisData(getPublicKey, handleStepper, 'socialConnect')

    return (
        <CustomButtom text={`Lets's Go`} handleClick={getSmartProfileFromOrbis} />
    )
}

export default AuthSuccess
