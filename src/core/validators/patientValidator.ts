/**
 * VALIDADOR DE PACIENTES
 * Centraliza toda la lógica de validación para operaciones con pacientes
 * Separa las validaciones del service para mantener responsabilidades claras
 */

import type { 
    CreatePatientDto, 
    PatientStateUpdateDto, 
    AdvancedSearchParams 
} from "../types/patient";

export class PatientValidator {
    // Expresión regular para validar UUIDs
    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    // Límites de paginación
    private static readonly MIN_PAGE = 1;
    private static readonly MAX_PAGE = 1000;
    private static readonly MIN_LIMIT = 1;
    private static readonly MAX_LIMIT = 100;
    private static readonly DEFAULT_LIMIT = 20;

    // Estados válidos para pacientes
    private static readonly VALID_PATIENT_STATES = ['ACTIVE', 'INACTIVE', 'PENDING'];

    // Longitudes mínimas para búsquedas
    private static readonly MIN_SEARCH_LENGTH = 2;
    private static readonly MIN_NAME_LENGTH = 2;
    private static readonly MIN_DIAGNOSTIC_LENGTH = 3;

    /**
     * Valida parámetros de paginación
     * @param page - Número de página
     * @param limit - Límite de resultados por página
     * @returns Parámetros validados y corregidos
     */
    static validatePaginationParams(page?: number, limit?: number): { page: number; limit: number } {
        let validatedPage = page || this.MIN_PAGE;
        let validatedLimit = limit || this.DEFAULT_LIMIT;

        // Validar página
        if (!Number.isInteger(validatedPage) || validatedPage < this.MIN_PAGE) {
            validatedPage = this.MIN_PAGE;
        }
        if (validatedPage > this.MAX_PAGE) {
            validatedPage = this.MAX_PAGE;
        }

        // Validar límite
        if (!Number.isInteger(validatedLimit) || validatedLimit < this.MIN_LIMIT) {
            validatedLimit = this.MIN_LIMIT;
        }
        if (validatedLimit > this.MAX_LIMIT) {
            validatedLimit = this.MAX_LIMIT;
        }

        return { page: validatedPage, limit: validatedLimit };
    }

    /**
     * Valida un ID de paciente
     * @param patientId - ID del paciente
     * @throws Error si no es válido
     */
    static validatePatientId(patientId: string): void {
        if (!patientId || typeof patientId !== 'string') {
            throw new Error("El ID del paciente es requerido");
        }

        if (patientId.trim().length === 0) {
            throw new Error("El ID del paciente no puede estar vacío");
        }

        // Opcional: validar formato UUID si se requiere
        if (!this.UUID_REGEX.test(patientId)) {
            throw new Error(`El ID del paciente "${patientId}" debe tener formato UUID válido`);
        }
    }

    /**
     * Valida datos para crear un paciente
     * @param patientData - Datos del paciente
     * @throws Error si la validación falla
     */
    static validateCreatePatientData(patientData: CreatePatientDto): void {
        if (!patientData || typeof patientData !== 'object') {
            throw new Error("Los datos del paciente son requeridos");
        }

        // Validar campos requeridos básicos
        this.validateRequiredStringField(patientData.fullname, "Nombre completo", this.MIN_NAME_LENGTH);
        this.validateRequiredStringField(patientData.identificacion, "Identificación");
        this.validateRequiredStringField(patientData.email, "Email");
        this.validateRequiredStringField(patientData.phone, "Teléfono");
        this.validateRequiredStringField(patientData.date_of_birth, "Fecha de nacimiento");

        // Validar identificación
        this.validateDocumentNumber(patientData.identificacion);

        // Validar fecha de nacimiento
        this.validateBirthDate(patientData.date_of_birth);

        // Validar email
        this.validateEmail(patientData.email);

        // Validar teléfono
        this.validatePhone(patientData.phone);

        // Validar campos opcionales si están presentes
        if (patientData.license_number !== undefined && patientData.license_number !== null) {
            this.validateRequiredStringField(patientData.license_number, "Número de licencia");
        }

        if (patientData.address !== undefined && patientData.address !== null) {
            this.validateRequiredStringField(patientData.address, "Dirección");
        }

        if (patientData.emergencyContact !== undefined && patientData.emergencyContact !== null) {
            this.validateRequiredStringField(patientData.emergencyContact, "Contacto de emergencia");
        }

        if (patientData.emergencyPhone !== undefined && patientData.emergencyPhone !== null) {
            this.validatePhone(patientData.emergencyPhone);
        }
    }

    /**
     * Valida datos para actualizar un paciente
     * @param patientData - Datos parciales del paciente
     * @throws Error si la validación falla
     */
    static validateUpdatePatientData(patientData: Partial<CreatePatientDto>): void {
        if (!patientData || typeof patientData !== 'object') {
            throw new Error("Los datos del paciente son requeridos");
        }

        // Validar campos si están presentes
        if (patientData.fullname !== undefined) {
            this.validateRequiredStringField(patientData.fullname, "Nombre completo", this.MIN_NAME_LENGTH);
        }

        if (patientData.email !== undefined) {
            this.validateRequiredStringField(patientData.email, "Email");
            this.validateEmail(patientData.email);
        }

        if (patientData.phone !== undefined) {
            this.validateRequiredStringField(patientData.phone, "Teléfono");
            this.validatePhone(patientData.phone);
        }

        if (patientData.date_of_birth !== undefined) {
            this.validateRequiredStringField(patientData.date_of_birth, "Fecha de nacimiento");
            this.validateBirthDate(patientData.date_of_birth);
        }

        if (patientData.license_number !== undefined && patientData.license_number !== null) {
            this.validateRequiredStringField(patientData.license_number, "Número de licencia");
        }

        if (patientData.address !== undefined && patientData.address !== null) {
            this.validateRequiredStringField(patientData.address, "Dirección");
        }

        if (patientData.emergencyContact !== undefined && patientData.emergencyContact !== null) {
            this.validateRequiredStringField(patientData.emergencyContact, "Contacto de emergencia");
        }

        if (patientData.emergencyPhone !== undefined && patientData.emergencyPhone !== null) {
            this.validatePhone(patientData.emergencyPhone);
        }
    }

    /**
     * Valida datos para actualizar el estado de un paciente
     * @param stateData - Datos del estado
     * @throws Error si la validación falla
     */
    static validatePatientStateUpdate(stateData: PatientStateUpdateDto): void {
        if (!stateData || typeof stateData !== 'object') {
            throw new Error("Los datos del estado son requeridos");
        }

        if (!stateData.status || typeof stateData.status !== 'string') {
            throw new Error("El estado es requerido");
        }

        if (!this.VALID_PATIENT_STATES.includes(stateData.status)) {
            throw new Error(
                `Estado inválido: "${stateData.status}". ` +
                `Estados válidos: ${this.VALID_PATIENT_STATES.join(', ')}`
            );
        }

        // Validar razón si está presente
        if (stateData.reason !== undefined && stateData.reason !== null) {
            if (typeof stateData.reason !== 'string' || stateData.reason.trim().length === 0) {
                throw new Error("La razón del cambio de estado debe ser una cadena válida");
            }
        }
    }

    /**
     * Valida parámetros de búsqueda avanzada
     * @param params - Parámetros de búsqueda
     * @throws Error si la validación falla
     */
    static validateAdvancedSearchParams(params: AdvancedSearchParams): void {
        if (!params || typeof params !== 'object') {
            throw new Error("Los parámetros de búsqueda son requeridos");
        }

        // Validar paginación
        const { page, limit } = this.validatePaginationParams(params.page, params.limit);
        params.page = page;
        params.limit = limit;

        // Validar términos de búsqueda si están presentes
        if (params.fullname !== undefined) {
            this.validateSearchTerm(params.fullname, "Nombre completo", this.MIN_NAME_LENGTH);
        }

        if (params.identificacion !== undefined) {
            this.validateSearchTerm(params.identificacion, "Identificación");
        }

        if (params.diagnostic !== undefined) {
            this.validateSearchTerm(params.diagnostic, "Diagnóstico", this.MIN_DIAGNOSTIC_LENGTH);
        }

        if (params.status !== undefined) {
            if (!this.VALID_PATIENT_STATES.includes(params.status)) {
                throw new Error(
                    `Estado de búsqueda inválido: "${params.status}". ` +
                    `Estados válidos: ${this.VALID_PATIENT_STATES.join(', ')}`
                );
            }
        }
    }

    /**
     * Valida término de búsqueda general
     * @param query - Término de búsqueda
     * @throws Error si no es válido
     */
    static validateSearchQuery(query: string): void {
        if (!query || typeof query !== 'string') {
            throw new Error("El término de búsqueda es requerido");
        }

        const trimmedQuery = query.trim();
        if (trimmedQuery.length < this.MIN_SEARCH_LENGTH) {
            throw new Error(`El término de búsqueda debe tener al menos ${this.MIN_SEARCH_LENGTH} caracteres`);
        }

        // Validar caracteres peligrosos básicos
        if (/[<>'"\\]/.test(trimmedQuery)) {
            throw new Error("El término de búsqueda contiene caracteres no permitidos");
        }
    }

    // ============ MÉTODOS PRIVADOS DE VALIDACIÓN ============

    /**
     * Valida un campo de cadena requerido
     */
    private static validateRequiredStringField(
        value: string | undefined, 
        fieldName: string, 
        minLength: number = 1
    ): void {
        if (!value || typeof value !== 'string') {
            throw new Error(`${fieldName} es requerido`);
        }

        const trimmedValue = value.trim();
        if (trimmedValue.length === 0) {
            throw new Error(`${fieldName} no puede estar vacío`);
        }

        if (trimmedValue.length < minLength) {
            throw new Error(`${fieldName} debe tener al menos ${minLength} caracteres`);
        }
    }

    /**
     * Valida número de documento
     */
    private static validateDocumentNumber(documentNumber: string): void {
        const trimmed = documentNumber.trim();
        
        // Validar longitud (generalmente entre 6 y 15 dígitos)
        if (trimmed.length < 6 || trimmed.length > 15) {
            throw new Error("El número de documento debe tener entre 6 y 15 caracteres");
        }

        // Validar que solo contenga números, guiones y espacios
        if (!/^[\d\s\-]+$/.test(trimmed)) {
            throw new Error("El número de documento solo puede contener números, espacios y guiones");
        }
    }

    /**
     * Valida fecha de nacimiento
     */
    private static validateBirthDate(birthDate: string): void {
        const date = new Date(birthDate);
        
        if (isNaN(date.getTime())) {
            throw new Error("Fecha de nacimiento inválida");
        }

        const now = new Date();
        const minDate = new Date(now.getFullYear() - 120, 0, 1); // 120 años atrás
        const maxDate = new Date(); // Hoy

        if (date < minDate || date > maxDate) {
            throw new Error("La fecha de nacimiento debe estar entre hace 120 años y hoy");
        }
    }

    /**
     * Valida email
     */
    private static validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email.trim())) {
            throw new Error("El formato del email no es válido");
        }
    }

    /**
     * Valida teléfono
     */
    private static validatePhone(phone: string): void {
        const trimmed = phone.trim();
        
        // Permitir números, espacios, guiones, paréntesis, signo +
        if (!/^[\d\s\-\(\)\+]+$/.test(trimmed)) {
            throw new Error("El teléfono solo puede contener números, espacios, guiones, paréntesis y signo +");
        }

        // Validar longitud mínima y máxima
        const digitsOnly = trimmed.replace(/\D/g, ''); // Solo dígitos
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
            throw new Error("El teléfono debe tener entre 7 y 15 dígitos");
        }
    }

    /**
     * Valida término de búsqueda específico
     */
    private static validateSearchTerm(
        term: string | undefined, 
        fieldName: string, 
        minLength: number = this.MIN_SEARCH_LENGTH
    ): void {
        if (term === undefined || term === null) {
            return; // Campos opcionales
        }

        if (typeof term !== 'string') {
            throw new Error(`${fieldName} debe ser una cadena de texto`);
        }

        const trimmed = term.trim();
        if (trimmed.length > 0 && trimmed.length < minLength) {
            throw new Error(`${fieldName} debe tener al menos ${minLength} caracteres`);
        }

        // Validar caracteres peligrosos
        if (/[<>'"\\]/.test(trimmed)) {
            throw new Error(`${fieldName} contiene caracteres no permitidos`);
        }
    }
}