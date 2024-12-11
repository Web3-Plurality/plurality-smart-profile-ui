/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { message } from 'antd';

import { ErrorMessages } from '../utils/Constants';
import axiosInstance from '../services/Api';
import { getLocalStorageValue } from '../utils/Helpers';

function CallBackUrl() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [searchParams] = useSearchParams();
    const accessTokenID = searchParams.get('token_id');
    const appName = searchParams.get('app'); 
    const redirect = searchParams.get('redirect');// redirect to otp page if its true


    const registerEvent = async () => {
        try {
            setIsLoading(true);
            setError(false);
            console.log("redirect", redirect)
            const apiUrl = appName ? `oauth-${appName}` : 'auth/google'
            //if redirect is true, means user already  been loggedIn with stytch so we have to redirect hinm to otp page
            await axiosInstance.post(`${apiUrl}/event`, { clientId: localStorage.getItem("clientId"), redirect : redirect === 'true' ? true : false }, {
                headers: {
                    'x-sse-id': getLocalStorageValue('sseId'),
                    'x-token-id': accessTokenID,
                },
            });
        } catch (err) {
            message.error(ErrorMessages.EVENT_REGISTRATION_FAILED);
            console.error("Error:", err);
            setError(true);
        } finally {
            setIsLoading(false);
            window.close();
        }
    };

    useEffect(() => {
        if (!accessTokenID) {
            message.error(ErrorMessages.ACCESS_TOKEN_ID_ERROR);
            window.close();
            return;
        }

        registerEvent();

    }, [accessTokenID, appName]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error occurred. Please try again.</div>;
    }

    return null;
}

export default CallBackUrl;
