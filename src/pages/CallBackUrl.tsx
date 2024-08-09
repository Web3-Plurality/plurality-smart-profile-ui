import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Test() {
    const [searchParams] = useSearchParams();
    const accessTokenID = searchParams.get('token_id');
    const appName = searchParams.get('app');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!accessTokenID) {
            console.error('No access token ID found in search parameters.');
            window.close()
            return;
        }

        const eventRegister = async () => {
            setIsLoading(true);
            setHasError(false);

            try {
                await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/oauth-${appName}/event`,
                    {},
                    {
                        headers: {
                            'x-sse-id': localStorage.getItem('sseId') || '',
                            'x-token-id': accessTokenID
                        }
                    }
                );
            } catch (error) {
                console.error('Error during event registration:', error);
                setHasError(true);
            } finally {
                setIsLoading(false);
                window.close();
            }
        };

        eventRegister();
    }, [accessTokenID, appName]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (hasError) {
        return <div>Error occurred. Please try again.</div>;
    }

    return null;
}

export default Test;
