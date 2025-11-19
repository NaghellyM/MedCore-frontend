/**
 * HOOK DE OPERACIONES DE HISTORIA MÉDICA
 * Gestiona únicamente las operaciones con la API de historias médicas
 * Usa el servicio existente: medicalHistoryService
 */

import { useCallback } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import { MedicalHistoryFormValidator } from "../../validators/medicalHistoryFormValidator";
import type { 
    MedicalHistoryFormData
} from "../../types/medicalHistory";
import type { PatientSearchResult } from "../../types/patient";

interface UseMedicalHistoryOperationsOptions {
    onSaveSuccess?: (historyId: string) => void;
    onSaveError?: (error: string) => void;
    onLoadSuccess?: (data: Partial<MedicalHistoryFormData>) => void;
    onLoadError?: (error: string) => void;
    onDocumentsReadyToUpload?: () => Promise<void>;
}

interface UseMedicalHistoryOperationsReturn {
    saveHistory: (formData: Partial<MedicalHistoryFormData>) => Promise<string>;
    loadHistory: (historyId: string) => Promise<Partial<MedicalHistoryFormData>>;
    setPatient: (patient: PatientSearchResult, currentData: Partial<MedicalHistoryFormData>) => Partial<MedicalHistoryFormData>;
}

export function useMedicalHistoryOperations(
    options: UseMedicalHistoryOperationsOptions = {}
): UseMedicalHistoryOperationsReturn {
    const { 
        onSaveSuccess, 
        onSaveError, 
        onLoadSuccess, 
        onLoadError,
        onDocumentsReadyToUpload 
    } = options;

    // Guardar historia médica
    const saveHistory = useCallback(async (
        formData: Partial<MedicalHistoryFormData>
    ): Promise<string> => {
        try {
            // Validar que el formulario esté completo
            if (!MedicalHistoryFormValidator.isReadyToSave(formData)) {
                const validation = MedicalHistoryFormValidator.validateForm(formData);
                const errorMessages = validation.errors.map(error => error.message).join(', ');
                throw new Error(`Formulario incompleto: ${errorMessages}`);
            }

            if (!formData.patientInfo?.id) {
                throw new Error("Debe seleccionar un paciente");
            }

            // Preparar datos para envío (esto se adaptaría según la API real)
            // const historyData = {
            //     patientId: formData.patientInfo.id,
            //     consultation: formData.consultation,
            //     physicalExam: formData.physicalExam,
            //     diagnostics: formData.diagnostics,
            //     customFields: formData.customFields
            // };

            // Por ahora, simulamos la creación (el código original hace esto)
            // En el futuro se puede implementar la llamada real a la API
            
            // Manejar documentos si hay callback
            if (onDocumentsReadyToUpload) {
                await onDocumentsReadyToUpload();
            }

            // Simular ID de historia (en el código original usa el ID del paciente)
            const mockHistoryId = formData.patientInfo.id;
            
            onSaveSuccess?.(mockHistoryId);
            return mockHistoryId;

            // Código comentado para futura implementación real:
            /*
            const response = await medicalHistoryService.createMedicalHistory(historyData);
            const historyId = response.data.id;
            
            onSaveSuccess?.(historyId);
            return historyId;
            */
        } catch (error) {
            let errorMessage = "Error al guardar la historia clínica";
            
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.response?.status) {
                    errorMessage = `Error del servidor (${axiosError.response.status})`;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            onSaveError?.(errorMessage);
            throw error;
        }
    }, [onSaveSuccess, onSaveError, onDocumentsReadyToUpload]);

    // Cargar historia médica existente
    const loadHistory = useCallback(async (historyId: string): Promise<Partial<MedicalHistoryFormData>> => {
        try {
            const history = await medicalHistoryService.getMedicalHistoryById(historyId);

            // Transformar los datos de la API al formato del formulario
            const formattedData: Partial<MedicalHistoryFormData> = {
                patientInfo: {
                    id: history.data.patientId,
                    fullname: "Paciente", // Obtener del servicio de pacientes
                    identificacion: "" // Obtener del servicio de pacientes
                },
                // Mapear el resto de los datos según la estructura de la API
                // Esto necesitaría ser adaptado según la estructura real de la respuesta
                consultation: {
                    chiefComplaint: "",
                    currentIllnessHistory: "",
                    consultDate: new Date().toISOString().split('T')[0]
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

            onLoadSuccess?.(formattedData);
            return formattedData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al cargar la historia clínica";
            onLoadError?.(errorMessage);
            throw error;
        }
    }, [onLoadSuccess, onLoadError]);

    // Establecer paciente seleccionado
    const setPatient = useCallback((
        patient: PatientSearchResult, 
        currentData: Partial<MedicalHistoryFormData>
    ): Partial<MedicalHistoryFormData> => {
        const patientInfo = {
            id: patient.id,
            fullname: patient.fullname,
            identificacion: patient.identificacion,
            email: patient.email,
            phone: patient.phone
        };

        // Actualizar datos manteniendo información existente de consulta
        const updatedData = {
            ...currentData,
            patientInfo,
            consultation: {
                chiefComplaint: currentData.consultation?.chiefComplaint || "",
                currentIllnessHistory: currentData.consultation?.currentIllnessHistory || "",
                consultDate: currentData.consultation?.consultDate || new Date().toISOString().split('T')[0]
            }
        };

        return updatedData;
    }, []);

    return {
        saveHistory,
        loadHistory,
        setPatient
    };
}