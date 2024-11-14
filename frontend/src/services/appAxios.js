import axios from 'axios';
import config from '../config.js';

export const appAxios = axios.create({
    baseURL: config.API_URL,
});

appAxios.interceptors.request.use(
    (config) => {
        const storage = localStorage.getItem('real-time-chat-auth');
        const tokenData = storage ? JSON.parse(storage) : {};
        let token = tokenData?.isToken || null;
        if (token) {
            token = token.replace(/^"|"$/g, '');
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log('appAxios: ', error);
        return Promise.reject(error);
    }
);
