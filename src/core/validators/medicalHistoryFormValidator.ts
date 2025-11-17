/**
 * VALIDADOR DE FORMULARIOS DE HISTORIA MÉDICA
 * Centraliza toda la lógica de validación para formularios de historias médicas
 * Maneja validación por secciones del formulario multi-paso
 */

import type {
    MedicalHistoryFormData,
    MedicalHistorySection,
    ValidationError,
    FormValidationResult
} from "../types/medicalHistory";

export class MedicalHistoryFormValidator {
    // Orden de las secciones para navegación
    static readonly SECTION_ORDER: MedicalHistorySection[] = [
        "patient-search",
        "consultation", 
        "physical-exam",
        "diagnostics"
    ];

    // Límites de longitud para campos de texto
    private static readonly MIN_COMPLAINT_LENGTH = 3;
    private static readonly MIN_DIAGNOSIS_LENGTH = 3;
    private static readonly MAX_TEXT_LENGTH = 1000;
    private static readonly MAX_COMPLAINT_LENGTH = 500;

    // Expresiones regulares para validación
    private static readonly DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
    private static readonly ID_REGEX = /^[a-zA-Z0-9\-_]+$/;

    /**
     * Valida una sección específica del formulario
     * @param section - Sección a validar
     * @param formData - Datos del formulario
     * @returns Array de errores de validación
     */
    static validateSection(
        section: MedicalHistorySection, 
        formData: Partial<MedicalHistoryFormData>
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        switch (section) {
            case "patient-search":
                errors.push(...this.validatePatientSection(formData));
                break;

            case "consultation":
                errors.push(...this.validateConsultationSection(formData));
                break;

            case "physical-exam":
                errors.push(...this.validatePhysicalExamSection(formData));
                break;

            case "diagnostics":
                errors.push(...this.validateDiagnosticsSection(formData));
                break;

            default:
                errors.push({
                    field: "section",
                    message: `Sección desconocida: ${section}`,
                    section
                });
        }

        return errors;
    }

    /**
     * Valida todo el formulario
     * @param formData - Datos completos del formulario
     * @returns Resultado de validación completa
     */
    static validateForm(formData: Partial<MedicalHistoryFormData>): FormValidationResult {
        let allErrors: ValidationError[] = [];

        this.SECTION_ORDER.forEach(section => {
            const sectionErrors = this.validateSection(section, formData);
            allErrors = [...allErrors, ...sectionErrors];
        });

        return {
            isValid: allErrors.length === 0,
            errors: allErrors
        };
    }

    /**
     * Valida si una sección está completa para permitir navegación
     * @param section - Sección a validar
     * @param formData - Datos del formulario
     * @returns true si la sección está completa
     */
    static isSectionComplete(
        section: MedicalHistorySection,
        formData: Partial<MedicalHistoryFormData>
    ): boolean {
        const errors = this.validateSection(section, formData);
        return errors.length === 0;
    }

    /**
     * Obtiene la siguiente sección en el orden
     * @param currentSection - Sección actual
     * @returns Siguiente sección o null si es la última
     */
    static getNextSection(currentSection: MedicalHistorySection): MedicalHistorySection | null {
        const currentIndex = this.SECTION_ORDER.indexOf(currentSection);
        if (currentIndex >= 0 && currentIndex < this.SECTION_ORDER.length - 1) {
            return this.SECTION_ORDER[currentIndex + 1];
        }
        return null;
    }

    /**
     * Obtiene la sección anterior en el orden
     * @param currentSection - Sección actual
     * @returns Sección anterior o null si es la primera
     */
    static getPreviousSection(currentSection: MedicalHistorySection): MedicalHistorySection | null {
        const currentIndex = this.SECTION_ORDER.indexOf(currentSection);
        if (currentIndex > 0) {
            return this.SECTION_ORDER[currentIndex - 1];
        }
        return null;
    }

    /**
     * Valida si se puede navegar a una sección específica
     * @param targetSection - Sección objetivo
     * @param currentSection - Sección actual
     * @param formData - Datos del formulario
     * @returns true si se puede navegar
     */
    static canNavigateToSection(
        targetSection: MedicalHistorySection,
        currentSection: MedicalHistorySection,
        formData: Partial<MedicalHistoryFormData>
    ): boolean {
        const targetIndex = this.SECTION_ORDER.indexOf(targetSection);
        const currentIndex = this.SECTION_ORDER.indexOf(currentSection);

        // Siempre se puede navegar hacia atrás
        if (targetIndex <= currentIndex) {
            return true;
        }

        // Para navegar hacia adelante, verificar que las secciones anteriores estén completas
        for (let i = 0; i < targetIndex; i++) {
            const section = this.SECTION_ORDER[i];
            if (!this.isSectionComplete(section, formData)) {
                return false;
            }
        }

        return true;
    }

    // ============ VALIDACIONES POR SECCIÓN ============

    /**
     * Valida la sección de búsqueda de paciente
     */
    private static validatePatientSection(formData: Partial<MedicalHistoryFormData>): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!formData.patientInfo?.id) {
            errors.push({
                field: "patientInfo.id",
                message: "Debe seleccionar un paciente",
                section: "patient-search"
            });
        } else {
            // Validar formato del ID si está presente
            if (!this.ID_REGEX.test(formData.patientInfo.id)) {
                errors.push({
                    field: "patientInfo.id",
                    message: "El ID del paciente no tiene un formato válido",
                    section: "patient-search"
                });
            }
        }

        // Validar información básica del paciente si está presente
        if (formData.patientInfo) {
            if (!formData.patientInfo.fullname?.trim()) {
                errors.push({
                    field: "patientInfo.fullname",
                    message: "El nombre completo del paciente es requerido",
                    section: "patient-search"
                });
            }

            if (!formData.patientInfo.identificacion?.trim()) {
                errors.push({
                    field: "patientInfo.identificacion",
                    message: "La identificación del paciente es requerida",
                    section: "patient-search"
                });
            }
        }

        return errors;
    }

    /**
     * Valida la sección de consulta
     */
    private static validateConsultationSection(formData: Partial<MedicalHistoryFormData>): ValidationError[] {
        const errors: ValidationError[] = [];

        // Validar motivo de consulta
        if (!formData.consultation?.chiefComplaint?.trim()) {
            errors.push({
                field: "consultation.chiefComplaint",
                message: "El motivo de consulta es obligatorio",
                section: "consultation"
            });
        } else {
            const complaint = formData.consultation.chiefComplaint.trim();
            
            if (complaint.length < this.MIN_COMPLAINT_LENGTH) {
                errors.push({
                    field: "consultation.chiefComplaint",
                    message: `El motivo de consulta debe tener al menos ${this.MIN_COMPLAINT_LENGTH} caracteres`,
                    section: "consultation"
                });
            }

            if (complaint.length > this.MAX_COMPLAINT_LENGTH) {
                errors.push({
                    field: "consultation.chiefComplaint",
                    message: `El motivo de consulta no puede exceder ${this.MAX_COMPLAINT_LENGTH} caracteres`,
                    section: "consultation"
                });
            }
        }

        // Validar fecha de consulta
        if (!formData.consultation?.consultDate) {
            errors.push({
                field: "consultation.consultDate",
                message: "La fecha de consulta es obligatoria",
                section: "consultation"
            });
        } else {
            // Validar formato de fecha
            if (!this.DATE_REGEX.test(formData.consultation.consultDate)) {
                errors.push({
                    field: "consultation.consultDate",
                    message: "El formato de fecha debe ser YYYY-MM-DD",
                    section: "consultation"
                });
            } else {
                // Validar que la fecha sea válida
                const consultDate = new Date(formData.consultation.consultDate + 'T00:00:00');
                if (isNaN(consultDate.getTime())) {
                    errors.push({
                        field: "consultation.consultDate",
                        message: "La fecha de consulta no es válida",
                        section: "consultation"
                    });
                } else {
                    // Validar que no sea futura
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    if (consultDate > today) {
                        errors.push({
                            field: "consultation.consultDate",
                            message: "La fecha de consulta no puede ser futura",
                            section: "consultation"
                        });
                    }
                }
            }
        }

        // Validar historia de enfermedad actual si está presente
        if (formData.consultation?.currentIllnessHistory) {
            const history = formData.consultation.currentIllnessHistory.trim();
            if (history.length > this.MAX_TEXT_LENGTH) {
                errors.push({
                    field: "consultation.currentIllnessHistory",
                    message: `La historia de enfermedad actual no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                    section: "consultation"
                });
            }
        }

        return errors;
    }

    /**
     * Valida la sección de examen físico
     */
    private static validatePhysicalExamSection(formData: Partial<MedicalHistoryFormData>): ValidationError[] {
        const errors: ValidationError[] = [];

        // El examen físico es típicamente opcional, pero podemos agregar validaciones específicas
        if (formData.physicalExam) {
            // Validar signos vitales si están presentes
            if (formData.physicalExam.vitalSigns) {
                const vitalSigns = formData.physicalExam.vitalSigns;
                
                // Validar presión arterial si está presente
                if (vitalSigns.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(vitalSigns.bloodPressure)) {
                    errors.push({
                        field: "physicalExam.vitalSigns.bloodPressure",
                        message: "La presión arterial debe tener formato XXX/XXX",
                        section: "physical-exam"
                    });
                }

                // Validar frecuencia cardíaca si está presente
                if (vitalSigns.heartRate && (vitalSigns.heartRate < 30 || vitalSigns.heartRate > 300)) {
                    errors.push({
                        field: "physicalExam.vitalSigns.heartRate",
                        message: "La frecuencia cardíaca debe estar entre 30 y 300 bpm",
                        section: "physical-exam"
                    });
                }

                // Validar temperatura si está presente
                if (vitalSigns.temperature && (vitalSigns.temperature < 30 || vitalSigns.temperature > 45)) {
                    errors.push({
                        field: "physicalExam.vitalSigns.temperature",
                        message: "La temperatura debe estar entre 30°C y 45°C",
                        section: "physical-exam"
                    });
                }
            }

            // Validar longitud de observaciones generales
            if (formData.physicalExam.generalAppearance) {
                const appearance = formData.physicalExam.generalAppearance.trim();
                if (appearance.length > this.MAX_TEXT_LENGTH) {
                    errors.push({
                        field: "physicalExam.generalAppearance",
                        message: `La apariencia general no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                        section: "physical-exam"
                    });
                }
            }

            // Validar examen sistémico
            if (formData.physicalExam.systemicExam) {
                const exam = formData.physicalExam.systemicExam.trim();
                if (exam.length > this.MAX_TEXT_LENGTH) {
                    errors.push({
                        field: "physicalExam.systemicExam",
                        message: `El examen sistémico no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                        section: "physical-exam"
                    });
                }
            }
        }

        return errors;
    }

    /**
     * Valida la sección de diagnósticos
     */
    private static validateDiagnosticsSection(formData: Partial<MedicalHistoryFormData>): ValidationError[] {
        const errors: ValidationError[] = [];

        // Validar diagnóstico principal (obligatorio)
        if (!formData.diagnostics?.primaryDiagnosis?.trim()) {
            errors.push({
                field: "diagnostics.primaryDiagnosis",
                message: "El diagnóstico principal es obligatorio",
                section: "diagnostics"
            });
        } else {
            const diagnosis = formData.diagnostics.primaryDiagnosis.trim();

            if (diagnosis.length < this.MIN_DIAGNOSIS_LENGTH) {
                errors.push({
                    field: "diagnostics.primaryDiagnosis",
                    message: `El diagnóstico principal debe tener al menos ${this.MIN_DIAGNOSIS_LENGTH} caracteres`,
                    section: "diagnostics"
                });
            }

            if (diagnosis.length > this.MAX_TEXT_LENGTH) {
                errors.push({
                    field: "diagnostics.primaryDiagnosis",
                    message: `El diagnóstico principal no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                    section: "diagnostics"
                });
            }
        }

        // Validar diagnóstico secundario si está presente
        if (formData.diagnostics?.secondaryDiagnosis) {
            const diagnosis = formData.diagnostics.secondaryDiagnosis.trim();
            
            if (diagnosis.length > 0 && diagnosis.length < this.MIN_DIAGNOSIS_LENGTH) {
                errors.push({
                    field: "diagnostics.secondaryDiagnosis",
                    message: `El diagnóstico secundario debe tener al menos ${this.MIN_DIAGNOSIS_LENGTH} caracteres`,
                    section: "diagnostics"
                });
            }

            if (diagnosis.length > this.MAX_TEXT_LENGTH) {
                errors.push({
                    field: "diagnostics.secondaryDiagnosis",
                    message: `El diagnóstico secundario no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                    section: "diagnostics"
                });
            }
        }

        // Validar síntomas si están presentes
        if (formData.diagnostics?.symptoms) {
            const symptoms = formData.diagnostics.symptoms.trim();
            if (symptoms.length > this.MAX_TEXT_LENGTH) {
                errors.push({
                    field: "diagnostics.symptoms",
                    message: `Los síntomas no pueden exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                    section: "diagnostics"
                });
            }
        }

        // Validar hallazgos clínicos si están presentes
        if (formData.diagnostics?.clinicalFindings) {
            const findings = formData.diagnostics.clinicalFindings.trim();
            if (findings.length > this.MAX_TEXT_LENGTH) {
                errors.push({
                    field: "diagnostics.clinicalFindings",
                    message: `Los hallazgos clínicos no pueden exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                    section: "diagnostics"
                });
            }
        }

        // Validar impresión diagnóstica si está presente
        if (formData.diagnostics?.diagnosticImpression) {
            const impression = formData.diagnostics.diagnosticImpression.trim();
            if (impression.length > this.MAX_TEXT_LENGTH) {
                errors.push({
                    field: "diagnostics.diagnosticImpression",
                    message: `La impresión diagnóstica no puede exceder ${this.MAX_TEXT_LENGTH} caracteres`,
                    section: "diagnostics"
                });
            }
        }

        return errors;
    }

    /**
     * Obtiene un objeto de datos por defecto para el formulario
     */
    static getDefaultFormData(): Partial<MedicalHistoryFormData> {
        const today = new Date().toISOString().split('T')[0];
        
        return {
            patientInfo: undefined,
            consultation: {
                chiefComplaint: "",
                currentIllnessHistory: "",
                consultDate: today
            },
            physicalExam: {
                vitalSigns: {},
                generalAppearance: "",
                systemicExam: ""
            },
            diagnostics: {
                symptoms: "",
                clinicalFindings: "",
                primaryDiagnosis: "",
                secondaryDiagnosis: "",
                diagnosticImpression: ""
            }
        };
    }

    /**
     * Valida si el formulario está listo para ser guardado
     * @param formData - Datos del formulario
     * @returns true si está listo para guardar
     */
    static isReadyToSave(formData: Partial<MedicalHistoryFormData>): boolean {
        const validation = this.validateForm(formData);
        return validation.isValid;
    }
}