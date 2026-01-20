import axios from "axios";
import { message } from "antd";
import { API_BASE_URL, CLIENT_ID } from "./../utils/EnvConfig";
import { getLocalStorageValueofClient, setLocalStorageValue } from "./../utils/Helpers";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': "application/json",
    },
    // timeout: 1000
});

axiosInstance.interceptors.request.use(function (config) {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Response interceptor for axiosInstance
axiosInstance.interceptors.response.use(function (response) {
    return response
}, function (error) {
    // Handle 402 Insufficient Credits
    if (error.response?.status === 402) {
        const { requiredCreditsROSE, error: errorMsg } = error.response.data || {};
        message.error(`${errorMsg || 'Insufficient credits'}. Required: ${requiredCreditsROSE || 'unknown'} ROSE`);
    }
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
        const queryParams = new URLSearchParams(location.search);
        const clientId = queryParams.get('client_id') || CLIENT_ID;

        const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
        const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

        localStorage.clear()

        if (smartProfileData) {
            setLocalStorageValue(`streamID-${profileTypeStreamId}`, JSON.stringify({ smartProfileData }))
        }
    }
    return Promise.reject(error);
});

// Also add interceptor to base axios for direct axios calls (not through axiosInstance)
axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    // Handle 402 Insufficient Credits
    if (error.response?.status === 402) {
        const { requiredCreditsROSE, error: errorMsg } = error.response.data || {};
        message.error(`${errorMsg || 'Insufficient credits'}. Required: ${requiredCreditsROSE || 'unknown'} ROSE`);
    }
    return Promise.reject(error);
});

export default axiosInstance;