import type { MedicalHistoryFormData } from "../types/medicalHistory/forms";
import type { CreateDiagnosticDto } from "../types/medicalHistory/entities";
import { DiagnosticDtoValidator } from "../validators/diagnosticDtoValidator";

/**
 * TRANSFORMADOR DE DATOS DE DIAGNÓSTICO
 * ====================================
 * Responsabilidad única: Transformar datos de formularios en DTOs válidos
 * - NO contiene lógica de validación (delegada a DiagnosticDtoValidator)
 * - Se enfoca exclusivamente en el mapeo y transformación de estructuras de datos
 */
export class DiagnosticMapper {

    /**
     * Convierte los datos del formulario de historia médica
     * a un DTO válido para crear un diagnóstico
     * 
     * @param formData - Datos completos del formulario
     * @returns DTO listo para enviar al endpoint POST /diagnostics/patient/:patientId
     * @throws Error si los datos del formulario no son válidos
     */
    static fromMedicalHistoryForm(
        formData: Partial<MedicalHistoryFormData>
    ): CreateDiagnosticDto {
        // Validación previa usando el validador especializado
        const validationError = DiagnosticDtoValidator.validateMedicalHistoryForDiagnostic(formData);
        if (validationError) {
            throw new Error(validationError);
        }

        // Transformación de datos - responsabilidad principal del mapper
        const diagnosticDto: CreateDiagnosticDto = {
            title: this.extractTitle(formData),
            description: this.extractDescription(formData),
            symptoms: this.extractSymptoms(formData),
            diagnosis: this.extractDiagnosis(formData),
            treatment: this.extractTreatment(formData),
            observations: this.extractObservations(formData),
            prescriptions: this.extractPrescriptions(formData),
            physicalExam: this.extractPhysicalExam(formData),
            vitalSigns: this.extractVitalSigns(formData),
            consultDate: this.extractConsultDate(formData),
            customFields: this.extractCustomFields(formData),
        };

        // Validación final del DTO usando el validador especializado
        DiagnosticDtoValidator.validateCreateDiagnosticDto(diagnosticDto);
        
        return diagnosticDto;
    }

    /**
     * Convierte datos parciales del formulario para actualizaciones
     * @param formData - Datos parciales del formulario
     * @returns DTO parcial para actualizaciones
     */
    static fromPartialMedicalHistoryForm(
        formData: Partial<MedicalHistoryFormData>
    ): Partial<CreateDiagnosticDto> {
        const partialDto: Partial<CreateDiagnosticDto> = {};

        // Solo incluir campos que estén presentes y sean válidos
        if (formData.diagnostics?.primaryDiagnosis?.trim()) {
            partialDto.title = formData.diagnostics.primaryDiagnosis.trim();
            partialDto.diagnosis = formData.diagnostics.primaryDiagnosis.trim();
        }

        if (formData.diagnostics?.diagnosticImpression?.trim()) {
            partialDto.description = formData.diagnostics.diagnosticImpression.trim();
        }

        if (formData.diagnostics?.symptoms?.trim() || formData.consultation?.chiefComplaint?.trim()) {
            partialDto.symptoms = formData.diagnostics?.symptoms?.trim() ||
                formData.consultation?.chiefComplaint?.trim();
        }

        if (formData.diagnostics?.clinicalFindings?.trim()) {
            partialDto.observations = formData.diagnostics.clinicalFindings.trim();
        }

        if (formData.consultation?.consultDate) {
            partialDto.consultDate = formData.consultation.consultDate;
        }

        if (formData.physicalExam) {
            partialDto.physicalExam = this.extractPhysicalExam(formData);
            partialDto.vitalSigns = this.extractVitalSigns(formData);
        }

        if (formData.diagnostics?.secondaryDiagnosis) {
            partialDto.customFields = this.extractCustomFields(formData);
        }

        return partialDto;
    }

    // ============ MÉTODOS PRIVADOS DE EXTRACCIÓN ============

    /**
     * Extrae el título del diagnóstico desde los datos del formulario
     */
    private static extractTitle(formData: Partial<MedicalHistoryFormData>): string {
        return formData.diagnostics!.primaryDiagnosis!.trim();
    }

    /**
     * Extrae la descripción del diagnóstico con fallback inteligente
     */
    private static extractDescription(formData: Partial<MedicalHistoryFormData>): string {
        return formData.diagnostics?.diagnosticImpression?.trim() ||
            formData.consultation?.currentIllnessHistory?.trim() ||
            "Diagnóstico registrado desde historia clínica";
    }

    /**
     * Extrae los síntomas con fallback a queja principal
     */
    private static extractSymptoms(formData: Partial<MedicalHistoryFormData>): string {
        return formData.diagnostics?.symptoms?.trim() ||
            formData.consultation?.chiefComplaint?.trim() ||
            "Síntomas registrados en consulta";
    }

    /**
     * Extrae el diagnóstico principal
     */
    private static extractDiagnosis(formData: Partial<MedicalHistoryFormData>): string {
        return formData.diagnostics!.primaryDiagnosis!.trim();
    }

    /**
     * Extrae el tratamiento con valor por defecto
     */
    private static extractTreatment(_formData: Partial<MedicalHistoryFormData>): string {
        // El formulario actual no tiene un campo específico de tratamiento
        // Se usa un valor por defecto hasta que se implemente
        return "Tratamiento pendiente de definir según evolución del paciente";
    }

    /**
     * Extrae observaciones clínicas
     */
    private static extractObservations(formData: Partial<MedicalHistoryFormData>): string | undefined {
        return formData.diagnostics?.clinicalFindings?.trim() || undefined;
    }

    /**
     * Extrae prescripciones (campo futuro)
     */
    private static extractPrescriptions(_formData: Partial<MedicalHistoryFormData>): string | undefined {
        // Por ahora retorna undefined, en el futuro podría extraer de formData.prescriptions
        return undefined;
    }

    /**
     * Transforma el examen físico a formato JSON string
     */
    private static extractPhysicalExam(formData: Partial<MedicalHistoryFormData>): string | undefined {
        if (!formData.physicalExam) return undefined;

        const physicalExamData = {
            generalAppearance: formData.physicalExam.generalAppearance || "",
            systemicExam: formData.physicalExam.systemicExam || "",
            // Los tipos actuales solo incluyen estos dos campos
            // En el futuro se pueden agregar más campos específicos
        };

        return JSON.stringify(physicalExamData);
    }

    /**
     * Transforma los signos vitales a formato JSON string
     */
    private static extractVitalSigns(formData: Partial<MedicalHistoryFormData>): string | undefined {
        if (!formData.physicalExam?.vitalSigns) return undefined;

        return JSON.stringify(formData.physicalExam.vitalSigns);
    }

    /**
     * Extrae la fecha de consulta con fallback a fecha actual
     */
    private static extractConsultDate(formData: Partial<MedicalHistoryFormData>): string {
        return formData.consultation?.consultDate ||
            new Date().toISOString().split('T')[0];
    }

    /**
     * Extrae campos personalizados para información adicional
     */
    private static extractCustomFields(
        formData: Partial<MedicalHistoryFormData>
    ): Record<string, any> | undefined {
        const hasSecondaryDiagnosis = formData.diagnostics?.secondaryDiagnosis?.trim();
        const hasChiefComplaint = formData.consultation?.chiefComplaint?.trim();
        const hasCurrentIllnessHistory = formData.consultation?.currentIllnessHistory?.trim();

        if (!hasSecondaryDiagnosis && !hasChiefComplaint && !hasCurrentIllnessHistory) {
            return undefined;
        }

        return {
            ...(hasSecondaryDiagnosis && { secondaryDiagnosis: formData.diagnostics!.secondaryDiagnosis }),
            ...(hasChiefComplaint && { chiefComplaint: formData.consultation!.chiefComplaint }),
            ...(hasCurrentIllnessHistory && { currentIllnessHistory: formData.consultation!.currentIllnessHistory }),
        };
    }
}