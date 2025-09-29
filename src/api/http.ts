import axios from "axios";

const http = axios.create({
  baseURL: "https://tu-api.com", // cambia por tu API
  timeout: 10000,
});

// Ejemplo: si quieres meter token automáticamente después del login
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
