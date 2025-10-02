import axios from 'axios';
import { ApiUrls } from '../../environments/environments';

const http = axios.create({
    baseURL: ApiUrls.msSecurity,
    timeout: 10000,
});

export async function apiPost<T>(url: string, data: any): Promise<T> {
    try {
        const response = await http.post<T>(url, data);
        return response.data;
    } catch (error: any) {
        console.error("Error en la solicitud HTTP:", error.response?.data || error.message);
        throw error.response?.data || { message: "Error en la solicitud" };
    }
}
