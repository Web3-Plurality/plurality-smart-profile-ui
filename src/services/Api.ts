import axios from "axios";
import { API_BASE_URL } from "./../utils/EnvConfig";
import { getLocalStorageValue, setLocalStorageValue } from "./../utils/Helpers";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': "application/json",
    },
    // timeout: 1000
});

axiosInstance.interceptors.request.use(function (config) {
    // Retrieve the token dynamically
    const token = getLocalStorageValue('token');
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
        // Trigger logout functionality
        const smartProfileData = getLocalStorageValue('smartProfile')
        localStorage.clear()
        if (smartProfileData) {
            setLocalStorageValue('smartProfileData', smartProfileData)
        }
        return Promise.reject(error);
    }
});

export default axiosInstance;