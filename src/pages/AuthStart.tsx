import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { message } from 'antd';

import { ErrorMessages } from './../utils/Constants';
import { setLocalStorageValue } from '../utils/Helpers';
import { API_BASE_URL } from '../utils/EnvConfig';

const AuthStart = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('sse_id');
        const appRoute = searchParams.get('route');

        
        if (!id) {
            message.error(ErrorMessages.SSID_MISSING_ERROR)
            window.close();
            return;
        }
        
        let redirectUrl = `${API_BASE_URL}${appRoute}?sse_id=${id}`;

        if(!appRoute){
            redirectUrl = `${API_BASE_URL}/auth/google/login?sse_id=${id}`;
        }

        setLocalStorageValue('sseId', id);
        window.location.href = redirectUrl;

    }, [searchParams]);


    return (
        <div className='fullscreen-loader'>
            Redirecting...
        </div>
    );
};

export default AuthStart;