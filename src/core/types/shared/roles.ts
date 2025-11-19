/**
 * TIPOS DE ROLES DEL SISTEMA
 * =========================
 * Definición centralizada de los roles de usuario
 */

export type UserRole = 'ADMIN' | 'ADMINISTRADOR' | 'MEDICO' | 'DOCTOR' | 'ENFERMERO' | 'ENFERMERA' | 'NURSE' | 'PACIENTE' | 'PATIENT';

export type NormalizedRole = 'admin' | 'doctor' | 'nurse' | 'patient';

/**
 * Mapeo de roles del backend a roles normalizados
 */
export const ROLE_MAPPING: Record<string, NormalizedRole> = {
    'ADMINISTRADOR': 'admin',
    'ADMIN': 'admin',
    'MEDICO': 'doctor',
    'DOCTOR': 'doctor',
    'ENFERMERO': 'nurse',
    'ENFERMERA': 'nurse',
    'NURSE': 'nurse',
    'PACIENTE': 'patient',
    'PATIENT': 'patient',
};

/**
 * Obtiene el rol normalizado a partir de un rol del backend
 */
export const normalizeRole = (role: string | undefined): NormalizedRole => {
    if (!role) return 'patient';
    return ROLE_MAPPING[role.toUpperCase()] || 'patient';
};