import axios from "axios";
import { ApiUrls } from "../../environments/environments";

const httpSecurity = axios.create({
  baseURL: ApiUrls.msSecurity,
  timeout: 10000,
});

httpSecurity.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpSecurity;
