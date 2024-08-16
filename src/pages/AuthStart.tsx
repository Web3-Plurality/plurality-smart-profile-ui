import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../common/constants';

const AuthStart = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('sse_id');
        const AppRoute = searchParams.get('route');

        if (id) {
            localStorage.setItem('sseId', id);

            const oauthUrl = `${BASE_URL}${AppRoute}?sse_id=${id}`;
            window.location.href = oauthUrl;
        } else {
            console.error('sse_id query parameter is missing');
        }
    }, [searchParams]);


    return (
        <div className='fullscreen-loader'>
            {/* <Loading copy={'Redirection...'} /> */}
            Redirecting...
        </div>
    );
};

export default AuthStart;
