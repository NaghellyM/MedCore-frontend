import axios from "axios";
import { ApiUrls } from "../../environments/environments";

const http = axios.create({
  baseURL: ApiUrls.msSecurity,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
