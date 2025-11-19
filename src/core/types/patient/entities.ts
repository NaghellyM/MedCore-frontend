/**
 * TIPOS UNIFICADOS DE PACIENTES
 * =============================
 * Este archivo unifica todas las interfaces de pacientes eliminando duplicaciones
 * y resolviendo inconsistencias entre models/ y types/
 */

// Estados y enums base
export type PatientState = "ACTIVE" | "INACTIVE" | "PENDING";
export type PatientRole = "PACIENTE" | "DOCTOR" | "ENFERMERA" | "ADMIN";
export type PatientGender = "Masculino" | "Femenino" | "Otro" | "No especificado";

// Estructura base del paciente (alineada con backend)
export interface Patient {
    id: string;
    fullname: string;
    email: string;
    identificacion: string; // Unificado como string (backend)
    role: PatientRole;
    status: PatientState;
    phone: string;
    license_number: string | null;
    date_of_birth: string; // ISO date string
    createdAt: string;
    updatedAt: string;
}

// Información básica del paciente (para listas y selecciones)
export interface PatientBasicInfo {
    id: string;
    fullname: string;
    identificacion: string;
    email?: string;
    phone?: string;
}

// Resultado de búsqueda de paciente (información para listas)
export interface PatientSearchResult extends PatientBasicInfo {
    status?: PatientState;
    role?: PatientRole;
    date_of_birth?: string;
    createdAt?: string;
    updatedAt?: string;
    // Campos adicionales para historial médico
    historyNumber?: string;
    lastVisit?: string;
}

// Información completa del paciente (para vistas detalladas)
export interface PatientFullInfo extends Patient {
    // Campos adicionales médicos
    gender?: PatientGender;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    allergies?: string;
    medicalHistory?: string;
    
    // Campos calculados
    age?: number;
    lastVisit?: string;
    totalVisits?: number;
}

// DTOs para operaciones CRUD
export interface CreatePatientDto {
    fullname: string;
    identificacion: string;
    email: string;
    phone: string;
    date_of_birth: string; // ISO date string YYYY-MM-DD
    role?: PatientRole; // Por defecto "PACIENTE"
    status?: PatientState; // Por defecto "ACTIVE"
    license_number?: string; // Para doctores/enfermeras
    
    // Campos adicionales médicos (opcionales)
    gender?: PatientGender;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    allergies?: string;
    medicalHistory?: string;
}

export interface UpdatePatientDto extends Partial<Omit<CreatePatientDto, 'identificacion'>> {
    // La identificación típicamente no se actualiza
}

export interface PatientStateUpdateDto {
    status: PatientState;
    reason?: string;
}

// Respuestas de API (mantenidas para compatibilidad)
export type GetPatientResponse = Patient;