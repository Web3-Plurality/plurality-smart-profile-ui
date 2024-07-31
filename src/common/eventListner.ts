import { useEffect, useState } from 'react'

export const useRegisterEvent = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')

    useEffect(() => {
        const evtSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/register-event`, { withCredentials: true });
        evtSource.onmessage = function (event) {
            const { message, app } = JSON.parse(event?.data)
            setMessage(message);
            setApp(app)
            if (message === "received") {
                if (app === "twitter") {
                    setIsLoading(true);
                    console.log("Twitter message received");
                    // handleInfoRequestTwitter();
                }
                else if (JSON.parse(event?.data)?.app === "tiktok") {
                    console.log("Tiktok message received");
                    // handleInfoRequestTiktok();
                } else if (app === "instagram") {
                    setIsLoading(true);
                    console.log("Instagram message received");
                    // handleInfoRequestTwitter();
                }
            }
        };

        evtSource.onerror = function (err) {
            console.error('EventSource failed:', err);
            setError(error)
            evtSource.close();
        };

        return () => {
            evtSource.close();
        };
    }, [])

    return {
        message,
        app,
        isLoading,
        error
    }

}


