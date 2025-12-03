/**
 * ASIGNACIÓN DE DIAGNÓSTICOS
 * Tipos para asignar diagnósticos predefinidos a pacientes
 */

// DTO para asignar diagnósticos a un paciente
export interface AssignDiagnosticDto {
    title: string;
    description: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    consultDate: string; // ISO date string
    nextAppointment?: string; // ISO date string
    observations?: string;
    vitalSigns?: string;
}

// Request para asignar múltiples diagnósticos
export interface AssignDiagnosticsRequest {
    diagnostics: AssignDiagnosticDto[];
}

// Response al asignar diagnósticos
export interface AssignDiagnosticsResponse {
    message: string;
    data: {
        diagnosticId: string;
        medicalHistoryId: string;
        patientId: string;
    };
}

// Diagnóstico seleccionado para asignar (combinación de predefinido + datos adicionales)
export interface SelectedDiagnostic {
    predefinedId: string;
    code: string;
    name: string;
    description: string;
    commonSymptoms: string;
    recommendedTreatment: string;
    category: string;
    severity: string;
    // Datos adicionales que el médico puede ajustar
    customSymptoms?: string;
    customTreatment?: string;
    observations?: string;
    consultDate: string;
    nextAppointment?: string;
    vitalSigns?: string;
}

// Estado del hook useAssignDiagnostics
export interface UseAssignDiagnosticsState {
    isAssigning: boolean;
    error: string | null;
    success: boolean;
}

// Acciones del hook useAssignDiagnostics
export interface UseAssignDiagnosticsActions {
    assignDiagnostics: (
        patientId: string,
        diagnostics: SelectedDiagnostic[]
    ) => Promise<boolean>;
    reset: () => void;
}

// Retorno del hook useAssignDiagnostics
export interface UseAssignDiagnosticsReturn 
    extends UseAssignDiagnosticsState, 
    UseAssignDiagnosticsActions {}
