import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 35000,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error('[API Error]', err.response?.status, err.response?.data);
        return Promise.reject(err);
    }
);

export default api;
