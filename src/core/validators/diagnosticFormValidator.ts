/**
 * VALIDADOR DE FORMULARIOS DE DIAGNÓSTICO
 * Centraliza toda la lógica de validación para formularios de diagnósticos médicos
 * Combina validaciones de yup con validaciones de negocio específicas
 */

import * as yup from "yup";
import type { 
    DiagnosticFormData,
    CreateDiagnosticDto,
    UpdateDiagnosticDto 
} from "../types/medicalHistory";

export class DiagnosticFormValidator {
    // Límites de longitud para campos de texto
    private static readonly TITLE_MIN_LENGTH = 3;
    private static readonly TITLE_MAX_LENGTH = 200;
    private static readonly TEXT_FIELD_MAX_LENGTH = 1000;
    private static readonly VITAL_SIGNS_MAX_LENGTH = 500;

    // Expresiones regulares para validación
    private static readonly DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
    
    /**
     * Schema de validación principal para formularios de diagnóstico
     */
    static get validationSchema() {
        return yup.object({
        title: yup
            .string()
            .required("El título del diagnóstico es obligatorio")
            .min(this.TITLE_MIN_LENGTH, `El título debe tener al menos ${this.TITLE_MIN_LENGTH} caracteres`)
            .max(this.TITLE_MAX_LENGTH, `El título no puede exceder ${this.TITLE_MAX_LENGTH} caracteres`)
            .trim(),
        
        description: yup
            .string()
            .max(this.TEXT_FIELD_MAX_LENGTH, `La descripción no puede exceder ${this.TEXT_FIELD_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        symptoms: yup
            .string()
            .max(this.TEXT_FIELD_MAX_LENGTH, `Los síntomas no pueden exceder ${this.TEXT_FIELD_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        diagnosis: yup
            .string()
            .max(this.TEXT_FIELD_MAX_LENGTH, `El diagnóstico no puede exceder ${this.TEXT_FIELD_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        treatment: yup
            .string()
            .max(this.TEXT_FIELD_MAX_LENGTH, `El tratamiento no puede exceder ${this.TEXT_FIELD_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        observations: yup
            .string()
            .max(this.TEXT_FIELD_MAX_LENGTH, `Las observaciones no pueden exceder ${this.TEXT_FIELD_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        prescriptions: yup
            .string()
            .max(this.TEXT_FIELD_MAX_LENGTH, `Las prescripciones no pueden exceder ${this.TEXT_FIELD_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        physicalExam: yup
            .string()
            .max(this.TEXT_FIELD_MAX_LENGTH, `El examen físico no puede exceder ${this.TEXT_FIELD_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        vitalSigns: yup
            .string()
            .max(this.VITAL_SIGNS_MAX_LENGTH, `Los signos vitales no pueden exceder ${this.VITAL_SIGNS_MAX_LENGTH} caracteres`)
            .nullable()
            .transform((value) => value === "" ? null : value),
        
        consultDate: yup
            .string()
            .required("La fecha de consulta es obligatoria")
            .matches(this.DATE_REGEX, "Formato de fecha inválido (YYYY-MM-DD)")
            .test("valid-date", "La fecha de consulta no es válida", function(value) {
                if (!value) return false;
                const date = new Date(value + 'T00:00:00');
                return !isNaN(date.getTime());
            })
            .test("not-future", "La fecha de consulta no puede ser futura", function(value) {
                if (!value) return true;
                
                // Comparación simple: cualquier fecha anterior o igual a hoy es válida
                const today = new Date();
                const todayStr = today.getFullYear() + '-' + 
                                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                                String(today.getDate()).padStart(2, '0');
                
                return value <= todayStr;
            }),
        
        nextAppointment: yup
            .string()
            .nullable()
            .transform((value) => value === "" ? null : value)
            .test("valid-format", "Formato de fecha inválido (YYYY-MM-DD)", function(value) {
                if (!value) return true;
                return DiagnosticFormValidator.DATE_REGEX.test(value);
            })
            .test("valid-date", "La fecha de próxima cita no es válida", function(value) {
                if (!value) return true;
                const date = new Date(value + 'T00:00:00');
                return !isNaN(date.getTime());
            })
            .test("not-past", "La fecha de próxima cita no puede ser anterior a hoy", function(value) {
                if (!value) return true;
                
                // Comparación simple: fecha debe ser hoy o posterior
                const today = new Date();
                const todayStr = today.getFullYear() + '-' + 
                                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                                String(today.getDate()).padStart(2, '0');
                
                return value >= todayStr;
            }),

        customFields: yup
            .object()
            .nullable()
            .default({})
        });
    }

    /**
     * Valida los datos del formulario de diagnóstico
     * @param formData - Datos del formulario
     * @returns Promise con el resultado de la validación
     */
    static async validateFormData(formData: DiagnosticFormData): Promise<{
        isValid: boolean;
        errors: Record<string, string>;
        validatedData?: DiagnosticFormData;
    }> {
        try {
            const validatedData = await this.validationSchema.validate(formData, {
                abortEarly: false,
                stripUnknown: true
            });

            return {
                isValid: true,
                errors: {},
                validatedData: validatedData as DiagnosticFormData
            };
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                
                error.inner.forEach((validationError) => {
                    if (validationError.path) {
                        errors[validationError.path] = validationError.message;
                    }
                });

                return {
                    isValid: false,
                    errors
                };
            }

            throw error;
        }
    }

    /**
     * Valida un campo específico del formulario
     * @param fieldName - Nombre del campo
     * @param value - Valor del campo
     * @returns Promise con el resultado de la validación del campo
     */
    static async validateField(
        fieldName: keyof DiagnosticFormData, 
        value: any
    ): Promise<{ isValid: boolean; error?: string }> {
        try {
            await this.validationSchema.validateAt(fieldName, { [fieldName]: value });
            return { isValid: true };
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return {
                    isValid: false,
                    error: error.message
                };
            }
            throw error;
        }
    }

    /**
     * Valida datos para crear un diagnóstico
     * @param formData - Datos del formulario
     * @throws Error si la validación falla
     */
    static async validateCreateData(formData: DiagnosticFormData): Promise<CreateDiagnosticDto> {
        const validation = await this.validateFormData(formData);
        
        if (!validation.isValid) {
            const errorMessages = Object.values(validation.errors).join(', ');
            throw new Error(`Errores de validación: ${errorMessages}`);
        }

        if (!validation.validatedData) {
            throw new Error("Error en la validación de datos");
        }

        // Transformar a CreateDiagnosticDto
        return this.transformToCreateDto(validation.validatedData);
    }

    /**
     * Valida datos para actualizar un diagnóstico
     * @param formData - Datos del formulario
     * @throws Error si la validación falla
     */
    static async validateUpdateData(formData: Partial<DiagnosticFormData>): Promise<UpdateDiagnosticDto> {
        // Para actualizaciones, crear un esquema más flexible
        const partialSchema = this.validationSchema.partial();
        
        try {
            const validatedData = await partialSchema.validate(formData, {
                abortEarly: false,
                stripUnknown: true
            });

            return this.transformToUpdateDto(validatedData as Partial<DiagnosticFormData>);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errorMessages = error.inner.map(err => err.message).join(', ');
                throw new Error(`Errores de validación: ${errorMessages}`);
            }
            throw error;
        }
    }

    /**
     * Valida los IDs requeridos para operaciones de diagnóstico
     * @param patientId - ID del paciente  
     * @param medicalHistoryId - ID de la historia médica
     * @param diagnosticId - ID del diagnóstico (opcional para creación)
     */
    static validateRequiredIds(
        patientId?: string, 
        medicalHistoryId?: string, 
        diagnosticId?: string
    ): void {
        if (!patientId || patientId.trim().length === 0) {
            throw new Error("El ID del paciente es requerido");
        }

        if (!medicalHistoryId || medicalHistoryId.trim().length === 0) {
            throw new Error("El ID de la historia médica es requerido");
        }

        // Para operaciones de actualización/eliminación
        if (diagnosticId !== undefined && (!diagnosticId || diagnosticId.trim().length === 0)) {
            throw new Error("El ID del diagnóstico es requerido para esta operación");
        }
    }

    /**
     * Valida que las fechas sean lógicamente correctas
     * @param consultDate - Fecha de consulta
     * @param nextAppointment - Fecha de próxima cita (opcional)
     */
    static validateDateLogic(consultDate: string, nextAppointment?: string): void {
        const consult = new Date(consultDate + 'T00:00:00');
        
        if (isNaN(consult.getTime())) {
            throw new Error("Fecha de consulta inválida");
        }

        // Validar que la fecha de consulta no sea futura
        const today = new Date();
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        if (consult > todayDateOnly) {
            throw new Error("La fecha de consulta no puede ser futura");
        }

        if (nextAppointment) {
            const nextAppt = new Date(nextAppointment + 'T00:00:00');
            
            if (isNaN(nextAppt.getTime())) {
                throw new Error("Fecha de próxima cita inválida");
            }

            // Validar que la próxima cita no sea anterior a hoy
            if (nextAppt < todayDateOnly) {
                throw new Error("La próxima cita no puede ser anterior a hoy");
            }

            // Validar que la próxima cita sea posterior o igual a la fecha de consulta
            if (nextAppt < consult) {
                throw new Error("La próxima cita debe ser posterior o igual a la fecha de consulta");
            }
        }
    }

    // ============ MÉTODOS PRIVADOS DE TRANSFORMACIÓN ============

    /**
     * Transforma datos de formulario a CreateDiagnosticDto
     */
    private static transformToCreateDto(formData: DiagnosticFormData): CreateDiagnosticDto {
        return {
            title: formData.title,
            description: formData.description || "",
            symptoms: formData.symptoms || "",
            diagnosis: formData.diagnosis || "",
            treatment: formData.treatment || "",
            observations: formData.observations,
            prescriptions: formData.prescriptions,
            physicalExam: formData.physicalExam,
            vitalSigns: formData.vitalSigns,
            consultDate: formData.consultDate,
            nextAppointment: formData.nextAppointment,
            customFields: formData.customFields
        };
    }

    /**
     * Transforma datos de formulario a UpdateDiagnosticDto
     */
    private static transformToUpdateDto(formData: Partial<DiagnosticFormData>): UpdateDiagnosticDto {
        const updateDto: UpdateDiagnosticDto = {};

        // Solo incluir campos que están presentes en formData
        if (formData.title !== undefined) updateDto.title = formData.title;
        if (formData.description !== undefined) updateDto.description = formData.description || undefined;
        if (formData.symptoms !== undefined) updateDto.symptoms = formData.symptoms || undefined;
        if (formData.diagnosis !== undefined) updateDto.diagnosis = formData.diagnosis || undefined;
        if (formData.treatment !== undefined) updateDto.treatment = formData.treatment || undefined;
        if (formData.observations !== undefined) updateDto.observations = formData.observations || undefined;
        if (formData.prescriptions !== undefined) updateDto.prescriptions = formData.prescriptions || undefined;
        if (formData.physicalExam !== undefined) updateDto.physicalExam = formData.physicalExam || undefined;
        if (formData.vitalSigns !== undefined) updateDto.vitalSigns = formData.vitalSigns || undefined;
        if (formData.consultDate !== undefined) updateDto.consultDate = formData.consultDate;
        if (formData.nextAppointment !== undefined) updateDto.nextAppointment = formData.nextAppointment || undefined;
        if (formData.customFields !== undefined) updateDto.customFields = formData.customFields || undefined;

        return updateDto;
    }

    /**
     * Obtiene los valores por defecto para un formulario de diagnóstico
     */
    static getDefaultFormData(initialData?: Partial<DiagnosticFormData>): DiagnosticFormData {
        const today = new Date().toISOString().split('T')[0];
        
        return {
            title: "",
            description: "",
            symptoms: "",
            diagnosis: "",
            treatment: "",
            observations: "",
            prescriptions: "",
            physicalExam: "",
            vitalSigns: "",
            consultDate: today,
            nextAppointment: "",
            customFields: {},
            ...initialData
        };
    }
}