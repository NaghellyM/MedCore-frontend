/**
 * VALIDADOR DE DTOs DE DIAGNÓSTICO
 * Centraliza toda la lógica de validación específica para DTOs de diagnóstico
 * Separado del mapper para mantener responsabilidades claras
 */

import type { 
    CreateDiagnosticDto, 
    UpdateDiagnosticDto 
} from "../types/medicalHistory/entities";
import type { MedicalHistoryFormData } from "../types/medicalHistory/forms";

export class DiagnosticDtoValidator {
    // Constantes de validación
    private static readonly REQUIRED_FIELDS_CREATE = [
        'title', 'description', 'symptoms', 'diagnosis', 'treatment'
    ] as const;
    
    private static readonly MIN_TITLE_LENGTH = 3;
    private static readonly MIN_DESCRIPTION_LENGTH = 3;
    private static readonly MIN_SYMPTOMS_LENGTH = 3;
    private static readonly MIN_DIAGNOSIS_LENGTH = 3;
    private static readonly MIN_TREATMENT_LENGTH = 3;
    
    private static readonly MAX_TEXT_LENGTH = 1000;
    private static readonly MAX_TITLE_LENGTH = 200;
    
    // Expresión regular para validar fechas ISO
    private static readonly DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

    /**
     * Valida un DTO para crear diagnóstico
     * @param diagnosticDto - DTO a validar
     * @throws Error si la validación falla
     */
    static validateCreateDiagnosticDto(diagnosticDto: CreateDiagnosticDto): void {
        this.validateRequiredFields(diagnosticDto);
        this.validateFieldLengths(diagnosticDto);
        this.validateFieldFormats(diagnosticDto);
        this.validateBusinessRules(diagnosticDto);
    }

    /**
     * Valida un DTO para actualizar diagnóstico
     * @param diagnosticDto - DTO a validar
     * @throws Error si la validación falla
     */
    static validateUpdateDiagnosticDto(diagnosticDto: UpdateDiagnosticDto): void {
        // Para updates, los campos son opcionales, pero si están presentes deben ser válidos
        if (diagnosticDto.title !== undefined) {
            this.validateTitle(diagnosticDto.title);
        }
        
        if (diagnosticDto.description !== undefined) {
            this.validateDescription(diagnosticDto.description);
        }
        
        if (diagnosticDto.symptoms !== undefined) {
            this.validateSymptoms(diagnosticDto.symptoms);
        }
        
        if (diagnosticDto.diagnosis !== undefined) {
            this.validateDiagnosis(diagnosticDto.diagnosis);
        }
        
        if (diagnosticDto.treatment !== undefined) {
            this.validateTreatment(diagnosticDto.treatment);
        }
        
        if (diagnosticDto.consultDate !== undefined) {
            this.validateConsultDate(diagnosticDto.consultDate);
        }
        
        if (diagnosticDto.nextAppointment !== undefined) {
            this.validateNextAppointment(diagnosticDto.nextAppointment);
        }

        // Validar campos opcionales de texto si están presentes
        this.validateOptionalTextFields(diagnosticDto);
    }

    /**
     * Valida que los datos del formulario de historia médica tengan información
     * suficiente para generar un diagnóstico válido
     * @param formData - Datos del formulario
     * @returns string con error o null si es válido
     */
    static validateMedicalHistoryForDiagnostic(
        formData: Partial<MedicalHistoryFormData>
    ): string | null {
        if (!formData.diagnostics) {
            return "No se proporcionaron datos de diagnóstico";
        }

        if (!formData.diagnostics.primaryDiagnosis?.trim()) {
            return "El diagnóstico principal es obligatorio";
        }

        if (formData.diagnostics.primaryDiagnosis.trim().length < this.MIN_DIAGNOSIS_LENGTH) {
            return `El diagnóstico principal debe tener al menos ${this.MIN_DIAGNOSIS_LENGTH} caracteres`;
        }

        // Validar fecha de consulta si está presente
        if (formData.consultation?.consultDate) {
            if (!this.DATE_REGEX.test(formData.consultation.consultDate)) {
                return "La fecha de consulta debe tener formato YYYY-MM-DD";
            }
            
            const consultDate = new Date(formData.consultation.consultDate + 'T00:00:00');
            if (isNaN(consultDate.getTime())) {
                return "La fecha de consulta no es válida";
            }
        }

        return null; // Válido
    }

    /**
     * Verifica si un DTO tiene todos los campos mínimos para ser enviado al backend
     * @param diagnosticDto - DTO a verificar
     * @returns true si está listo para envío
     */
    static isReadyForSubmission(diagnosticDto: CreateDiagnosticDto | UpdateDiagnosticDto): boolean {
        try {
            if (this.isCreateDto(diagnosticDto)) {
                this.validateCreateDiagnosticDto(diagnosticDto);
            } else {
                this.validateUpdateDiagnosticDto(diagnosticDto);
            }
            return true;
        } catch {
            return false;
        }
    }

    // ============ MÉTODOS PRIVADOS DE VALIDACIÓN ============

    /**
     * Valida que todos los campos requeridos estén presentes y no vacíos
     */
    private static validateRequiredFields(diagnosticDto: CreateDiagnosticDto): void {
        for (const field of this.REQUIRED_FIELDS_CREATE) {
            const value = diagnosticDto[field as keyof CreateDiagnosticDto];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                throw new Error(
                    `Campo requerido "${field}" está vacío o faltante. ` +
                    `El backend rechazará esta petición.`
                );
            }
        }
    }

    /**
     * Valida las longitudes de los campos de texto
     */
    private static validateFieldLengths(diagnosticDto: CreateDiagnosticDto): void {
        this.validateTitle(diagnosticDto.title);
        this.validateDescription(diagnosticDto.description);
        this.validateSymptoms(diagnosticDto.symptoms);
        this.validateDiagnosis(diagnosticDto.diagnosis);
        this.validateTreatment(diagnosticDto.treatment);
    }

    /**
     * Valida formatos de campos específicos
     */
    private static validateFieldFormats(diagnosticDto: CreateDiagnosticDto): void {
        this.validateConsultDate(diagnosticDto.consultDate);
        
        if (diagnosticDto.nextAppointment) {
            this.validateNextAppointment(diagnosticDto.nextAppointment);
        }
    }

    /**
     * Valida reglas de negocio específicas
     */
    private static validateBusinessRules(diagnosticDto: CreateDiagnosticDto): void {
        // Validar que la fecha de próxima cita sea posterior a la consulta
        if (diagnosticDto.nextAppointment && diagnosticDto.consultDate) {
            const consultDate = new Date(diagnosticDto.consultDate + 'T00:00:00');
            const nextAppt = new Date(diagnosticDto.nextAppointment + 'T00:00:00');
            
            if (nextAppt <= consultDate) {
                throw new Error("La fecha de próxima cita debe ser posterior a la fecha de consulta");
            }
        }

        // Validar que la fecha de consulta no sea futura
        const consultDate = new Date(diagnosticDto.consultDate + 'T00:00:00');
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (consultDate > today) {
            throw new Error("La fecha de consulta no puede ser futura");
        }
    }

    /**
     * Valida campos opcionales de texto
     */
    private static validateOptionalTextFields(
        diagnosticDto: CreateDiagnosticDto | UpdateDiagnosticDto
    ): void {
        const optionalFields = [
            'observations', 'prescriptions', 'physicalExam', 'vitalSigns'
        ] as const;

        for (const field of optionalFields) {
            const value = diagnosticDto[field];
            if (value && typeof value === 'string' && value.length > this.MAX_TEXT_LENGTH) {
                throw new Error(`${field} no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`);
            }
        }
    }

    // ============ VALIDADORES ESPECÍFICOS POR CAMPO ============

    private static validateTitle(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new Error("El título es requerido");
        }
        
        const trimmed = title.trim();
        if (trimmed.length < this.MIN_TITLE_LENGTH) {
            throw new Error(`El título debe tener al menos ${this.MIN_TITLE_LENGTH} caracteres`);
        }
        
        if (trimmed.length > this.MAX_TITLE_LENGTH) {
            throw new Error(`El título no puede exceder ${this.MAX_TITLE_LENGTH} caracteres`);
        }
    }

    private static validateDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw new Error("La descripción es requerida");
        }
        
        const trimmed = description.trim();
        if (trimmed.length < this.MIN_DESCRIPTION_LENGTH) {
            throw new Error(`La descripción debe tener al menos ${this.MIN_DESCRIPTION_LENGTH} caracteres`);
        }
        
        if (trimmed.length > this.MAX_TEXT_LENGTH) {
            throw new Error(`La descripción no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`);
        }
    }

    private static validateSymptoms(symptoms: string): void {
        if (!symptoms || symptoms.trim().length === 0) {
            throw new Error("Los síntomas son requeridos");
        }
        
        const trimmed = symptoms.trim();
        if (trimmed.length < this.MIN_SYMPTOMS_LENGTH) {
            throw new Error(`Los síntomas deben tener al menos ${this.MIN_SYMPTOMS_LENGTH} caracteres`);
        }
        
        if (trimmed.length > this.MAX_TEXT_LENGTH) {
            throw new Error(`Los síntomas no pueden exceder ${this.MAX_TEXT_LENGTH} caracteres`);
        }
    }

    private static validateDiagnosis(diagnosis: string): void {
        if (!diagnosis || diagnosis.trim().length === 0) {
            throw new Error("El diagnóstico es requerido");
        }
        
        const trimmed = diagnosis.trim();
        if (trimmed.length < this.MIN_DIAGNOSIS_LENGTH) {
            throw new Error(`El diagnóstico debe tener al menos ${this.MIN_DIAGNOSIS_LENGTH} caracteres`);
        }
        
        if (trimmed.length > this.MAX_TEXT_LENGTH) {
            throw new Error(`El diagnóstico no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`);
        }
    }

    private static validateTreatment(treatment: string): void {
        if (!treatment || treatment.trim().length === 0) {
            throw new Error("El tratamiento es requerido");
        }
        
        const trimmed = treatment.trim();
        if (trimmed.length < this.MIN_TREATMENT_LENGTH) {
            throw new Error(`El tratamiento debe tener al menos ${this.MIN_TREATMENT_LENGTH} caracteres`);
        }
        
        if (trimmed.length > this.MAX_TEXT_LENGTH) {
            throw new Error(`El tratamiento no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`);
        }
    }

    private static validateConsultDate(consultDate: string): void {
        if (!consultDate || consultDate.trim().length === 0) {
            throw new Error("La fecha de consulta es requerida");
        }
        
        if (!this.DATE_REGEX.test(consultDate)) {
            throw new Error("La fecha de consulta debe tener formato YYYY-MM-DD");
        }
        
        const date = new Date(consultDate + 'T00:00:00');
        if (isNaN(date.getTime())) {
            throw new Error("La fecha de consulta no es válida");
        }
    }

    private static validateNextAppointment(nextAppointment: string): void {
        if (!nextAppointment || nextAppointment.trim().length === 0) {
            return; // Campo opcional
        }
        
        if (!this.DATE_REGEX.test(nextAppointment)) {
            throw new Error("La fecha de próxima cita debe tener formato YYYY-MM-DD");
        }
        
        const date = new Date(nextAppointment + 'T00:00:00');
        if (isNaN(date.getTime())) {
            throw new Error("La fecha de próxima cita no es válida");
        }
        
        // Validar que no sea en el pasado
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
            throw new Error("La fecha de próxima cita no puede ser en el pasado");
        }
    }

    // ============ MÉTODOS UTILITARIOS ============

    /**
     * Determina si un DTO es de tipo Create o Update
     */
    private static isCreateDto(
        dto: CreateDiagnosticDto | UpdateDiagnosticDto
    ): dto is CreateDiagnosticDto {
        // Un CreateDto debe tener todos los campos requeridos
        return this.REQUIRED_FIELDS_CREATE.every(
            field => field in dto && dto[field as keyof typeof dto] !== undefined
        );
    }
}