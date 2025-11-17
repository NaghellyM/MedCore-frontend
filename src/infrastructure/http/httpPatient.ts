import axios from "axios";
import { ApiUrls } from "../../environments/environments";
import { setupAuthInterceptors } from "./authInterceptor";

const httpPatient = axios.create({
    baseURL: ApiUrls.msPatient,
    timeout: 10000,
});

// Configurar interceptores de autenticación
setupAuthInterceptors(httpPatient, 'Servicio de Pacientes');

export default httpPatient;