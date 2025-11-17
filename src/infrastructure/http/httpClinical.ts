import axios from "axios";
import { ApiUrls } from "../../environments/environments";
import { setupAuthInterceptors } from "./authInterceptor";

const httpClinical = axios.create({
    baseURL: ApiUrls.msClinical,
    timeout: 10000,
});

// Configurar interceptores de autenticación
setupAuthInterceptors(httpClinical, 'Servicio Clínico');

export default httpClinical;