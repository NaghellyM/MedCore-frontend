/**
 * HOOK DE OPERACIONES DE DIAGNÓSTICO
 * Gestiona únicamente las operaciones con la API de diagnósticos
 * Usa los servicios existentes: diagnosticService y DiagnosticMapper
 */

import { useCallback } from "react";
import { diagnosticService } from "../../services/diagnosticService";
import { DiagnosticDtoValidator } from "../../validators/diagnosticDtoValidator";
import { DiagnosticFormValidator } from "../../validators/diagnosticFormValidator";
import type { 
    DiagnosticFormData, 
    Diagnostic,
    CreateDiagnosticDto,
    UpdateDiagnosticDto 
} from "../../types/medicalHistory";

interface UseDiagnosticOperationsOptions {
    onSaveSuccess?: (diagnostic: Diagnostic) => void;
    onSaveError?: (error: string) => void;
    onLoadSuccess?: (diagnostic: Diagnostic) => void;
    onLoadError?: (error: string) => void;
}

interface UseDiagnosticOperationsReturn {
    createDiagnostic: (patientId: string, formData: DiagnosticFormData) => Promise<Diagnostic>;
    updateDiagnostic: (diagnosticId: string, formData: Partial<DiagnosticFormData>) => Promise<Diagnostic>;
    loadDiagnostic: (diagnosticId: string) => Promise<DiagnosticFormData>;
    deleteDiagnostic: (diagnosticId: string) => Promise<void>;
}

export function useDiagnosticOperations(
    options: UseDiagnosticOperationsOptions = {}
): UseDiagnosticOperationsReturn {
    const { onSaveSuccess, onSaveError, onLoadSuccess, onLoadError } = options;

    // Crear un nuevo diagnóstico
    const createDiagnostic = useCallback(async (
        patientId: string, 
        formData: DiagnosticFormData
    ): Promise<Diagnostic> => {
        try {
            // Validar IDs requeridos
            DiagnosticFormValidator.validateRequiredIds(patientId);

            // Validar y transformar datos usando el validador
            const createDto: CreateDiagnosticDto = await DiagnosticFormValidator.validateCreateData(formData);

            // Validar usando el validador especializado de DTOs
            DiagnosticDtoValidator.validateCreateDiagnosticDto(createDto);

            // Llamar al servicio existente
            const response = await diagnosticService.createDiagnostic(patientId, createDto);
            
            // Construir objeto Diagnostic para retorno consistente
            const diagnostic: Diagnostic = {
                id: response?.data?.diagnosticId || 'unknown-id',  
                medicalHistoryId: response?.data?.medicalHistoryId || '',
                doctorId: 'current-doctor', 
                title: formData.title,
                description: formData.description || null,
                symptoms: formData.symptoms || null,
                diagnosis: formData.diagnosis || null,
                treatment: formData.treatment || null,
                observations: formData.observations || null,
                prescriptions: formData.prescriptions || null,
                physicalExam: formData.physicalExam || null,
                vitalSigns: formData.vitalSigns || null,
                consultDate: formData.consultDate,
                nextAppointment: formData.nextAppointment || null,
                state: 'ACTIVE',
                customFields: formData.customFields || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                documents: []
            };

            onSaveSuccess?.(diagnostic);
            return diagnostic;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al crear el diagnóstico";
            onSaveError?.(errorMessage);
            throw error;
        }
    }, [onSaveSuccess, onSaveError]);

    // Actualizar un diagnóstico existente
    const updateDiagnostic = useCallback(async (
        diagnosticId: string, 
        formData: Partial<DiagnosticFormData>
    ): Promise<Diagnostic> => {
        try {
            // Validar ID requerido (solo diagnosticId para actualización)
            if (!diagnosticId || diagnosticId.trim().length === 0) {
                throw new Error("El ID del diagnóstico es requerido para esta operación");
            }

            // Validar y transformar datos
            const updateDto: UpdateDiagnosticDto = await DiagnosticFormValidator.validateUpdateData(formData);

            // Obtener diagnóstico actual y actualizar
            const currentResponse = await diagnosticService.getDiagnosticById(diagnosticId);
            await diagnosticService.updateDiagnostic(diagnosticId, updateDto);
            
            // Combinar datos actuales con actualizaciones
            const updatedDiagnostic = { 
                ...currentResponse.data, 
                ...updateDto,
                updatedAt: new Date().toISOString()
            } as Diagnostic;

            onSaveSuccess?.(updatedDiagnostic);
            return updatedDiagnostic;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al actualizar el diagnóstico";
            onSaveError?.(errorMessage);
            throw error;
        }
    }, [onSaveSuccess, onSaveError]);

    // Cargar un diagnóstico existente
    const loadDiagnostic = useCallback(async (diagnosticId: string): Promise<DiagnosticFormData> => {
        try {
            // Validar ID requerido (solo diagnosticId para carga)
            if (!diagnosticId || diagnosticId.trim().length === 0) {
                throw new Error("El ID del diagnóstico es requerido para esta operación");
            }

            const response = await diagnosticService.getDiagnosticById(diagnosticId);
            const diagnostic = response.data;
            
            // Transformar a formato de formulario
            const formattedData: DiagnosticFormData = {
                title: diagnostic.title,
                description: diagnostic.description || "",
                symptoms: diagnostic.symptoms || "",
                diagnosis: diagnostic.diagnosis || "",
                treatment: diagnostic.treatment || "",
                observations: diagnostic.observations || "",
                prescriptions: diagnostic.prescriptions || "",
                physicalExam: diagnostic.physicalExam || "",
                vitalSigns: diagnostic.vitalSigns || "",
                consultDate: diagnostic.consultDate.split('T')[0], // Convertir a formato date input
                nextAppointment: diagnostic.nextAppointment ? diagnostic.nextAppointment.split('T')[0] : "",
                customFields: diagnostic.customFields || {}
            };

            onLoadSuccess?.(diagnostic);
            return formattedData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al cargar el diagnóstico";
            onLoadError?.(errorMessage);
            throw error;
        }
    }, [onLoadSuccess, onLoadError]);

    // Eliminar un diagnóstico
    const deleteDiagnostic = useCallback(async (diagnosticId: string): Promise<void> => {
        try {
            // Validar ID requerido (solo diagnosticId para eliminación)
            if (!diagnosticId || diagnosticId.trim().length === 0) {
                throw new Error("El ID del diagnóstico es requerido para esta operación");
            }

            await diagnosticService.deleteDiagnostic(diagnosticId);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al eliminar el diagnóstico";
            onSaveError?.(errorMessage); // Usar el callback de error general
            throw error;
        }
    }, [onSaveError]);

    return {
        createDiagnostic,
        updateDiagnostic,
        loadDiagnostic,
        deleteDiagnostic
    };
}