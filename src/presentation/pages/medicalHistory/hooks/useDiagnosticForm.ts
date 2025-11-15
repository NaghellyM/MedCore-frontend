import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { diagnosticService } from "../../../../core/services/diagnosticService";
import type { 
    DiagnosticFormData,
    DiagnosticFormState,
    CreateDiagnosticDto,
    UpdateDiagnosticDto,
    Diagnostic
} from "../../../../core/types/medicalHistory";

// Schema de validación con Yup
const diagnosticValidationSchema = yup.object({
    title: yup
        .string()
        .required("El título del diagnóstico es obligatorio")
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(200, "El título no puede exceder 200 caracteres"),
    description: yup
        .string()
        .max(1000, "La descripción no puede exceder 1000 caracteres"),
    symptoms: yup
        .string()
        .max(1000, "Los síntomas no pueden exceder 1000 caracteres"),
    diagnosis: yup
        .string()
        .max(1000, "El diagnóstico no puede exceder 1000 caracteres"),
    treatment: yup
        .string()
        .max(1000, "El tratamiento no puede exceder 1000 caracteres"),
    observations: yup
        .string()
        .max(1000, "Las observaciones no pueden exceder 1000 caracteres"),
    prescriptions: yup
        .string()
        .max(1000, "Las prescripciones no pueden exceder 1000 caracteres"),
    physicalExam: yup
        .string()
        .max(1000, "El examen físico no puede exceder 1000 caracteres"),
    vitalSigns: yup
        .string()
        .max(500, "Los signos vitales no pueden exceder 500 caracteres"),
    consultDate: yup
        .string()
        .required("La fecha de consulta es obligatoria")
        .matches(/^\\d{4}-\\d{2}-\\d{2}$/, "Formato de fecha inválido"),
    nextAppointment: yup
        .string()
        .nullable()
        .matches(/^\\d{4}-\\d{2}-\\d{2}$|^$/, "Formato de fecha inválido"),
});

interface UseDiagnosticFormOptions {
    initialData?: Partial<DiagnosticFormData>;
    mode?: "create" | "edit";
    patientId?: string;
    medicalHistoryId?: string;
    diagnosticId?: string;
    onSaveSuccess?: (diagnostic: Diagnostic) => void;
    onSaveError?: (error: string) => void;
}

interface UseDiagnosticFormReturn {
    // Form data y estado
    formData: DiagnosticFormData;
    formState: DiagnosticFormState;
    
    // React Hook Form
    register: any;
    handleSubmit: any;
    setValue: any;
    watch: any;
    formErrors: any;
    reset: any;
    
    // Acciones
    updateFormData: (data: Partial<DiagnosticFormData>) => void;
    saveDiagnostic: () => Promise<void>;
    loadDiagnostic: (diagnosticId: string) => Promise<void>;
    resetForm: () => void;
    
    // Validación
    isValid: boolean;
    validate: () => Promise<boolean>;
}

const getDefaultFormData = (options: UseDiagnosticFormOptions): DiagnosticFormData => ({
    title: "",
    description: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    observations: "",
    prescriptions: "",
    physicalExam: "",
    vitalSigns: "",
    consultDate: new Date().toISOString().split('T')[0],
    nextAppointment: "",
    customFields: {},
    ...options.initialData
});

export function useDiagnosticForm(
    options: UseDiagnosticFormOptions = {}
): UseDiagnosticFormReturn {
    const {
        mode = "create",
        patientId,
        medicalHistoryId,
        diagnosticId,
        onSaveSuccess,
        onSaveError
    } = options;

    const defaultData = getDefaultFormData(options);

    // Estado del formulario
    const [formData, setFormData] = useState<DiagnosticFormData>(defaultData);
    const [formState, setFormState] = useState<DiagnosticFormState>({
        mode,
        isLoading: false,
        isSaving: false,
        isDirty: false,
        errors: {},
        diagnosticId,
        medicalHistoryId,
        patientId
    });

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        trigger,
        formState: { errors: formErrors, isDirty, isValid }
    } = useForm<DiagnosticFormData>({
        defaultValues: defaultData,
        resolver: yupResolver(diagnosticValidationSchema),
        mode: "onChange"
    });

    // Sincronizar isDirty con el estado local
    useEffect(() => {
        setFormState(prev => ({ ...prev, isDirty }));
    }, [isDirty]);

    // Función para actualizar los datos del formulario
    const updateFormData = useCallback((newData: Partial<DiagnosticFormData>) => {
        setFormData(prev => {
            const updatedData = { ...prev, ...newData };
            
            // Actualizar React Hook Form también
            Object.entries(newData).forEach(([key, value]) => {
                setValue(key as keyof DiagnosticFormData, value as any);
            });
            
            return updatedData;
        });
    }, [setValue]);

    // Guardar diagnóstico
    const saveDiagnostic = useCallback(async () => {
        const isFormValid = await trigger();
        
        if (!isFormValid) {
            onSaveError?.("Por favor, corrija los errores en el formulario");
            return;
        }

        if (!patientId || !medicalHistoryId) {
            onSaveError?.("Faltan datos requeridos: paciente o historia médica");
            return;
        }

        setFormState(prev => ({ ...prev, isSaving: true }));

        try {
            let result: Diagnostic;

            const diagnosticData: CreateDiagnosticDto | UpdateDiagnosticDto = {
                title: formData.title,
                description: formData.description || undefined,
                symptoms: formData.symptoms || undefined,
                diagnosis: formData.diagnosis || undefined,
                treatment: formData.treatment || undefined,
                observations: formData.observations || undefined,
                prescriptions: formData.prescriptions || undefined,
                physicalExam: formData.physicalExam || undefined,
                vitalSigns: formData.vitalSigns || undefined,
                consultDate: formData.consultDate,
                nextAppointment: formData.nextAppointment || undefined,
                customFields: formData.customFields || undefined
            };

            if (formState.mode === "create") {
                await diagnosticService.createDiagnostic(patientId, diagnosticData as CreateDiagnosticDto);
                // Crear un diagnóstico temporal para el callback (el servicio no retorna el objeto completo)
                result = {
                    id: 'temp-' + Date.now(),
                    medicalHistoryId: medicalHistoryId,
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
                } as Diagnostic;
            } else if (diagnosticId) {
                // Para modo edit, primero obtener el diagnóstico actual y luego actualizarlo
                const currentDiagnostic = await diagnosticService.getDiagnosticById(diagnosticId);
                await diagnosticService.updateDiagnostic(diagnosticId, diagnosticData as UpdateDiagnosticDto);
                result = { ...currentDiagnostic.data, ...diagnosticData } as Diagnostic;
            } else {
                throw new Error("ID de diagnóstico requerido para actualización");
            }

            setFormState(prev => ({ 
                ...prev, 
                isSaving: false, 
                isDirty: false,
                diagnosticId: formState.mode === "create" ? result.id : prev.diagnosticId
            }));

            onSaveSuccess?.(result);
        } catch (error) {
            setFormState(prev => ({ ...prev, isSaving: false }));
            const errorMessage = error instanceof Error ? error.message : "Error al guardar el diagnóstico";
            onSaveError?.(errorMessage);
        }
    }, [formData, formState.mode, patientId, medicalHistoryId, diagnosticId, trigger, onSaveSuccess, onSaveError]);

    // Cargar diagnóstico existente
    const loadDiagnostic = useCallback(async (id: string) => {
        setFormState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await diagnosticService.getDiagnosticById(id);
            const diagnostic = response.data;
            
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

            setFormData(formattedData);
            reset(formattedData);
            
            setFormState(prev => ({ 
                ...prev, 
                isLoading: false, 
                mode: "edit",
                diagnosticId: id,
                medicalHistoryId: diagnostic.medicalHistoryId
            }));
        } catch (error) {
            setFormState(prev => ({ ...prev, isLoading: false }));
            onSaveError?.("Error al cargar el diagnóstico");
        }
    }, [reset, onSaveError]);

    // Resetear formulario
    const resetForm = useCallback(() => {
        const newDefaultData = getDefaultFormData(options);
        setFormData(newDefaultData);
        reset(newDefaultData);
        setFormState({
            mode: "create",
            isLoading: false,
            isSaving: false,
            isDirty: false,
            errors: {},
            patientId,
            medicalHistoryId
        });
    }, [reset, options, patientId, medicalHistoryId]);

    // Función de validación manual
    const validate = useCallback(async (): Promise<boolean> => {
        return await trigger();
    }, [trigger]);

    return {
        formData,
        formState,
        register,
        handleSubmit,
        setValue,
        watch,
        formErrors,
        reset,
        updateFormData,
        saveDiagnostic,
        loadDiagnostic,
        resetForm,
        isValid,
        validate
    };
}