

/**
 * TIPOS Y ESTADOS DE PACIENTES
 * ============================
 * Este archivo contiene todos los tipos base relacionados con pacientes
 * Basado en la estructura real del backend
 */

// Estados posibles de un paciente (basado en la respuesta del backend)
export type PatientState = "ACTIVE" | "INACTIVE" | "PENDING";

// Roles disponibles
export type PatientRole = "PACIENTE" | "DOCTOR" | "ENFERMERA" | "ADMIN";

// Géneros disponibles
export type PatientGender = "Masculino" | "Femenino" | "Otro" | "No especificado";

// Estructura del paciente según el backend
export interface PatientData {
    id: string;
    fullname: string;
    email: string;
    identificacion: string; // Backend lo maneja como string
    role: PatientRole;
    status: PatientState;
    phone: string;
    license_number: string | null;
    date_of_birth: string; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

// Resultado de búsqueda de paciente (información básica para listas)
export interface PatientSearchResult {
    id: string;
    fullname: string;
    identificacion: string;
    email?: string;
    phone?: string;
    status?: PatientState;
    role?: PatientRole;
    date_of_birth?: string;
    createdAt?: string;
    updatedAt?: string;
    // Campos adicionales para historial médico
    historyNumber?: string;
    lastVisit?: string;
}

// DTO para crear un nuevo paciente
export interface CreatePatientDto {
    fullname: string;
    identificacion: string;
    email: string;
    phone: string;
    date_of_birth: string; // ISO date string YYYY-MM-DD
    role?: PatientRole; // Por defecto "PACIENTE"
    status?: PatientState; // Por defecto "ACTIVE"
    license_number?: string; // Para doctores/enfermeras
    
    // Campos adicionales médicos (si el backend los soporta)
    gender?: PatientGender;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    allergies?: string;
    medicalHistory?: string;
}

// DTO para actualizar un paciente existente
export interface UpdatePatientDto extends Partial<Omit<CreatePatientDto, 'identificacion'>> {
    // La identificación típicamente no se actualiza
}

// DTO para actualizar solo el estado de un paciente
export interface PatientStateUpdateDto {
    status: PatientState; // Usar 'status' como en el backend
    reason?: string;
}

// Información completa del paciente (para vistas detalladas)
export interface PatientFullInfo extends PatientData {
    // Campos adicionales que podrían venir del backend
    medicalHistory?: string;
    allergies?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    address?: string;
    gender?: PatientGender;
    
    // Campos calculados
    age?: number;
    lastVisit?: string;
    totalVisits?: number;
}