import { useState } from 'react'
import { RouteMapper } from './utils'
import { BASE_URL } from './constants'
import axios from 'axios'

export const useRegisterEvent = ({ socailConnect }: { socailConnect: (appName: string) => void }) => {
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
                    // if (app === "twitter") {
                    //     setIsLoading(true);
                    //     console.log("Twitter message received");
                    //     // handleInfoRequestTwitter();
                    // } else if (app === "tiktok") {
                    //     console.log("Tiktok message received");
                    //     // handleInfoRequestTiktok();
                    // } else if (app === "instagram") {
                    //     setIsLoading(true);
                    //     console.log("Instagram message received");
                    //     // handleInfoRequestInstagram();
                    // }
                } else {
                    socailConnect(appName)
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


    //   const handleInfoRequest = () => {
    //     axios.get('https://app.plurality.local/oauth-roblox/info')
    //       .then(response => {
    //         console.log('Info:', response.data);
    //       })
    //       .catch(error => {
    //         console.error('Error getting info:', error);
    //       });
    //   };

    return {
        message,
        app,
        isLoading,
        error,
        registerEvent,
    }

}


