import axios from "axios";
import { ApiUrls } from "../../environments/environments";

const http = axios.create({
  baseURL: ApiUrls.msSecurity,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  //const token = localStorage.getItem("accessToken");
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTJmMzA4ZDk0YjQ4ZTg2ZDZiMDZlMyIsImVtYWlsIjoiZGFuaWVsb2FyaWFzMTFAZ21haWwuY29tIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJmdWxsbmFtZSI6Ikplc3VzIEFyaWFzIiwiaWF0IjoxNzYyODg0NTc1LCJleHAiOjE3NjI4OTUzNzV9.XJvpL-9zKiyQ85_ssEj_G8xRY9E0CswTNrgrw6VkAFI"
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
