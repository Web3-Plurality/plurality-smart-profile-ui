import { useState } from 'react'
import { RouteMapper } from './utils'
import { BASE_URL } from './constants'
import axios from 'axios'

export const useRegisterEvent = ({ socialConnect }: { socialConnect: (appName: string) => void }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')

    const registerEvent = async (appName: string) => {
        try {
            const evtSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/register-event`, { withCredentials: true });
            evtSource.onmessage = function (event) {
                const { message, app } = JSON.parse(event?.data);
                setMessage(message);
                setApp(app);
                console.log('Message: ', event.data)
                if (message === "received") {
                    fetchUserInfo(app)
                } else {
                    socialConnect(appName)
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
            // Handle the error if needed
        }
    };


    const fetchUserInfo = async (appName: string) => {
        const ApppRoute = RouteMapper(appName)
        const infoUrl = `${BASE_URL}${ApppRoute}/info`
        try {
            const response = await axios.get(infoUrl, { withCredentials: true })
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


