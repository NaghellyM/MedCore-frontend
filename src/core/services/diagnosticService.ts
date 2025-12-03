import httpPatient from "../../infrastructure/http/httpPatient";
import type {
    GetDiagnosticByIdResponse,
    GetDiagnosticsByPatientResponse,
    CreateDiagnosticResponse,
    UpdateDiagnosticResponse,
    UpdateDiagnosticStateResponse,
    DeleteDiagnosticResponse,
    UpdateDiagnosticDto,
    DiagnosticState,
    DiagnosticSearchParams,
    GetPredefinedDiagnosticsResponse,
    PredefinedDiagnosticFilters
} from "../types/diagnostic";
import type { CreateDiagnosticDto } from "../types/medicalHistory/entities";

// Url base para diagnósticos
const diagnosticBaseUrl = "/diagnostics";

export const diagnosticService = {
    
    //Obtener un diagnóstico por su ID
    async getDiagnosticById(diagnosticId: string): Promise<GetDiagnosticByIdResponse> {
        const response = await httpPatient.get<GetDiagnosticByIdResponse>(
            `${diagnosticBaseUrl}/${diagnosticId}`
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

    // Crear un nuevo diagnóstico para un paciente
    // POST /diagnostics/patient/:patientId
    async createDiagnostic(
        patientId: string, 
        diagnosticData: CreateDiagnosticDto
    ): Promise<CreateDiagnosticResponse> {
        const response = await httpPatient.post<CreateDiagnosticResponse>(
            `${diagnosticBaseUrl}/patient/${patientId}`,
            diagnosticData
        );
        
        return response.data;
    },

    // Actualizar un diagnóstico por su ID
    async updateDiagnostic(
        diagnosticId: string, 
        diagnosticData: UpdateDiagnosticDto
    ): Promise<UpdateDiagnosticResponse> {
        const response = await httpPatient.patch<UpdateDiagnosticResponse>(
            `${diagnosticBaseUrl}/${diagnosticId}`,
            diagnosticData
        );
        return response.data;
    },

    //Actualizar el estado de un diagnóstico 
    async updateDiagnosticState(
        diagnosticId: string, 
        newState: DiagnosticState
    ): Promise<UpdateDiagnosticStateResponse> {
        const response = await httpPatient.patch<UpdateDiagnosticStateResponse>(
            `${diagnosticBaseUrl}/${diagnosticId}/state`,
            { state: newState }
        );
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