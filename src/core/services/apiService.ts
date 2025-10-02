import axios from 'axios';
import { ApiUrls } from '../../environments/environments';

const apiClient = axios.create({
    baseURL: ApiUrls.msSecurity,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la solicitud:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
    }
);

export default apiClient;
