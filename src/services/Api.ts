import axios from "axios";
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


axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response.status === 403) {
        const queryParams = new URLSearchParams(location.search);
        const clientId = queryParams.get('client_id') || CLIENT_ID;

        const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
        const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

        localStorage.clear()

        if (smartProfileData) {
            setLocalStorageValue(`streamID-${profileTypeStreamId}`, JSON.stringify({ smartProfileData }))
        }
        return Promise.reject(error);
    }
});

export default axiosInstance;