import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../common/constants';
import Loading from '../components/LitComponents/Loading';

const AuthStart = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('sse_id');
        const ApppRoute = searchParams.get('route');

        if (id) {
            localStorage.setItem('sseId', id);

            const oauthUrl = `${BASE_URL}${ApppRoute}?sse_id=${id}`;
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
