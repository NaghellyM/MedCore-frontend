import axios from "axios";
import { ApiUrls } from "../../environments/environments";

const httpPatient = axios.create({
    baseURL: ApiUrls.msPatient,
    timeout: 10000,
});

httpPatient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpPatient;