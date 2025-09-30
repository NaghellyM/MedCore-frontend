import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3002", // cambia por tu API
  timeout: 10000,
});

// Ejemplo: si quieres meter token automáticamente después del login
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
