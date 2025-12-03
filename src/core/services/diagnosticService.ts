import httpPatient from "../../infrastructure/http/httpPatient";
import type {
    GetDiagnosticsByPatientResponse,
    DeleteDiagnosticResponse,
    DiagnosticState,
    DiagnosticSearchParams,
    GetPredefinedDiagnosticsResponse,
    GetPredefinedDiagnosticByIdResponse,
    PredefinedDiagnosticFilters
} from "../types/diagnostic";

// Url base para diagnósticos
const diagnosticBaseUrl = "/diagnostics";

export const diagnosticService = {
    
    //Obtener un diagnóstico predefinido por su ID
    async getDiagnosticById(diagnosticId: string): Promise<GetPredefinedDiagnosticByIdResponse> {
        const response = await httpPatient.get<GetPredefinedDiagnosticByIdResponse>(
            `${diagnosticBaseUrl}/predefined/${diagnosticId}`
        );
        return response.data;
    },

    // Obtener diagnósticos por el ID de un paciente
    async getDiagnosticsByPatientId(
        patientId: string, 
        state?: DiagnosticState
    ): Promise<GetDiagnosticsByPatientResponse> {
        const url = state 
            ? `${diagnosticBaseUrl}/patient/${patientId}?state=${state}`
            : `${diagnosticBaseUrl}/patient/${patientId}`;
            
        const response = await httpPatient.get<GetDiagnosticsByPatientResponse>(url);
        return response.data;
    },

    // Obtener diagnósticos con filtros y paginación
    async getDiagnostics(params?: DiagnosticSearchParams): Promise<any> {
        const queryParams = new URLSearchParams();
        
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, String(value));
                }
            });
        }

        const url = queryParams.toString() 
            ? `${diagnosticBaseUrl}?${queryParams.toString()}`
            : diagnosticBaseUrl;
            
        const response = await httpPatient.get(url);
        return response.data;
    },

    // Obtener diagnósticos predefinidos del sistema
    async getPredefinedDiagnostics(
        filters?: PredefinedDiagnosticFilters
    ): Promise<GetPredefinedDiagnosticsResponse> {
        const queryParams = new URLSearchParams();
        
        if (filters) {
            if (filters.category) {
                queryParams.append('category', filters.category);
            }
            if (filters.severity) {
                queryParams.append('severity', filters.severity);
            }
        }

        const url = queryParams.toString()
            ? `${diagnosticBaseUrl}/predefined/list?${queryParams.toString()}`
            : `${diagnosticBaseUrl}/predefined/list`;
            
        const response = await httpPatient.get<GetPredefinedDiagnosticsResponse>(url);
        return response.data;
    },

    
    // Eliminar un diagnóstico por su ID (soft delete usando PATCH al endpoint de estado)
    async deleteDiagnostic(
        diagnosticId: string
    ): Promise<DeleteDiagnosticResponse> {
        const response = await httpPatient.patch<DeleteDiagnosticResponse>(
            `${diagnosticBaseUrl}/${diagnosticId}/state`,
            { state: "DELETED" }
        );
        return response.data;
    }
};