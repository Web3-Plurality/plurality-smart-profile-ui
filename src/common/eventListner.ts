import { useState } from 'react'
import { RouteMapper } from './utils'
import { BASE_URL } from './constants'
import axios from 'axios'

export const useRegisterEvent = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')

    const registerEvent = async (appName: string) => {
        try {
            const evtSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/register-event`, { withCredentials: true });
            evtSource.onmessage = function (event) {
                const { message, app, id, auth } = JSON.parse(event?.data);
                setMessage(message);
                setApp(app);
                console.log('Message: ', event.data)
                if (message === "received") {
                    fetchUserInfo(app, auth)
                } else {
                    socialConnect(id, appName)
                }
            };

            evtSource.onerror = function (err) {
                console.error('EventSource failed:', err);
                setError('EventSource failed'); // Ensure you're setting the error correctly
                evtSource.close();
            };

            return () => {
                evtSource.close();
            };
        } catch (error) {
            console.error('Error setting up EventSource:', error);
        }
    };


    const socialConnect = (id: string, appName: string) => {
        const ApppRoute = RouteMapper(appName)
        const newWindow = window.open(`/auth-start?sse_id=${id}&route=${ApppRoute}`, `oauth-${appName}`, 'width=500,height=600');
        if (!newWindow) {
            alert('Failed to open window. It might be blocked by a popup blocker.');
        }
    }

    const fetchUserInfo = async (appName: string, auth: string) => {
        const ApppRoute = RouteMapper(appName)
        const infoUrl = `${BASE_URL}${ApppRoute}/info`
        try {
            setIsLoading(true)
            const response = await axios.get(infoUrl, {
                headers: {
                    'x-token-id': auth
                }
            })
            console.log(response.data)
        } catch (err) {
            setError('Error')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        message,
        app,
        isLoading,
        error,
        registerEvent,
    }

}


