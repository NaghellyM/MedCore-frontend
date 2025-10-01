import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3002", 
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
