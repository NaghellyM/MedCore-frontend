import axios from "axios";
import { ApiUrls } from "../../environments/environments";
import { setupAuthInterceptors } from "./authInterceptor";

const httpSecurity = axios.create({
  baseURL: ApiUrls.msSecurity,
  timeout: 10000,
});

// Configurar interceptores de autenticación
setupAuthInterceptors(httpSecurity, 'Servicio de Seguridad');

export default httpSecurity;
