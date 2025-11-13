import axios from "axios";
import { ApiUrls } from "../../environments/environments";

const httpClinical = axios.create({
    baseURL: ApiUrls.msClinical,
    timeout: 10000,
});

httpClinical.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpClinical;