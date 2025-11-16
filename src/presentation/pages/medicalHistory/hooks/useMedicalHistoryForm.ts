import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { medicalHistoryService } from "../../../../core/services/medicalHistoryService";
import type { 
    MedicalHistoryFormData, 
    MedicalHistoryFormState, 
    MedicalHistorySection,
    ValidationError,
    FormValidationResult
} from "../../../../core/types/medicalHistory";
import type { PatientSearchResult } from "../../../../core/types/patient";

interface UseMedicalHistoryFormOptions {
    initialData?: Partial<MedicalHistoryFormData>;
    mode?: "create" | "edit";
    historyId?: string;
    onSaveSuccess?: (historyId: string) => void;
    onSaveError?: (error: string) => void;
    onDocumentsReadyToUpload?: () => Promise<void>;
}

interface UseMedicalHistoryFormReturn {
    // Form data y estado
    formData: Partial<MedicalHistoryFormData>;
    formState: MedicalHistoryFormState;
    
    // React Hook Form
    register: any;
    handleSubmit: any;
    setValue: any;
    watch: any;
    formErrors: any;
    
    // Acciones
    updateFormData: (data: Partial<MedicalHistoryFormData>) => void;
    setPatient: (patient: PatientSearchResult) => void;
    saveHistory: () => Promise<void>;
    loadHistory: (historyId: string) => Promise<void>;
    resetForm: () => void;
    
    // Navegación entre secciones
    goToSection: (section: MedicalHistorySection) => void;
    nextSection: () => void;
    previousSection: () => void;
    
    // Validación
    validateForm: () => FormValidationResult;
    validateSection: (section: MedicalHistorySection) => ValidationError[];
}

const SECTION_ORDER: MedicalHistorySection[] = [
    "patient-search",
    "consultation",
    "physical-exam", 
    "diagnostics"
];

export function useMedicalHistoryForm(
    options: UseMedicalHistoryFormOptions = {}
): UseMedicalHistoryFormReturn {
    const {
        initialData = {},
        mode = "create",
        historyId,
        onSaveSuccess,
        onSaveError,
        onDocumentsReadyToUpload
    } = options;

    // Estado del formulario
    const [formData, setFormData] = useState<Partial<MedicalHistoryFormData>>(initialData);
    const [formState, setFormState] = useState<MedicalHistoryFormState>({
        mode,
        isLoading: false,
        isSaving: false,
        isDirty: false,
        errors: {},
        currentSection: "patient-search",
        historyId
    });

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors: formErrors, isDirty }
    } = useForm<MedicalHistoryFormData>({
        defaultValues: initialData as MedicalHistoryFormData,
        mode: "onChange"
    });

    // Actualizar isDirty en el estado
    useEffect(() => {
        setFormState(prev => ({ ...prev, isDirty }));
    }, [isDirty]);

    // Función para actualizar los datos del formulario
    const updateFormData = useCallback((newData: Partial<MedicalHistoryFormData>) => {
        setFormData(prev => {
            const updatedData = { ...prev, ...newData };
            
            // Actualizar React Hook Form también
            Object.entries(newData).forEach(([key, value]) => {
                setValue(key as keyof MedicalHistoryFormData, value as any);
            });
            
            return updatedData;
        });
    }, [setValue]);

    // Función para establecer el paciente seleccionado
    const setPatient = useCallback((patient: PatientSearchResult) => {
        const patientInfo = {
            id: patient.id,
            fullname: patient.fullname,
            identificacion: patient.identificacion,
            email: patient.email,
            phone: patient.phone
        };

        updateFormData({
            patientInfo,
            consultation: {
                chiefComplaint: formData.consultation?.chiefComplaint || "",
                currentIllnessHistory: formData.consultation?.currentIllnessHistory || "",
                consultDate: new Date().toISOString().split('T')[0]
            }
        });

        // Avanzar a la siguiente sección
        goToSection("consultation");
    }, [formData.consultation, updateFormData]);

    // Validación de secciones
    const validateSection = useCallback((section: MedicalHistorySection): ValidationError[] => {
        const errors: ValidationError[] = [];

        switch (section) {
            case "patient-search":
                if (!formData.patientInfo?.id) {
                    errors.push({
                        field: "patientInfo.id",
                        message: "Debe seleccionar un paciente",
                        section
                    });
                }
                break;

            case "consultation":
                if (!formData.consultation?.chiefComplaint?.trim()) {
                    errors.push({
                        field: "consultation.chiefComplaint",
                        message: "El motivo de consulta es obligatorio",
                        section
                    });
                }
                if (!formData.consultation?.consultDate) {
                    errors.push({
                        field: "consultation.consultDate",
                        message: "La fecha de consulta es obligatoria",
                        section
                    });
                }
                break;

            case "diagnostics":
                if (!formData.diagnostics?.primaryDiagnosis?.trim()) {
                    errors.push({
                        field: "diagnostics.primaryDiagnosis",
                        message: "El diagnóstico principal es obligatorio",
                        section
                    });
                }
                break;

            // Agregar más validaciones según sea necesario
        }

        return errors;
    }, [formData]);

    // Validación completa del formulario
    const validateForm = useCallback((): FormValidationResult => {
        let allErrors: ValidationError[] = [];

        SECTION_ORDER.forEach(section => {
            const sectionErrors = validateSection(section);
            allErrors = [...allErrors, ...sectionErrors];
        });

        return {
            isValid: allErrors.length === 0,
            errors: allErrors
        };
    }, [validateSection]);

    // Navegación entre secciones
    const goToSection = useCallback((section: MedicalHistorySection) => {
        setFormState(prev => ({ ...prev, currentSection: section }));
    }, []);

    const nextSection = useCallback(() => {
        const currentIndex = SECTION_ORDER.indexOf(formState.currentSection);
        if (currentIndex < SECTION_ORDER.length - 1) {
            const nextSectionName = SECTION_ORDER[currentIndex + 1];
            goToSection(nextSectionName);
        }
    }, [formState.currentSection, goToSection]);

    const previousSection = useCallback(() => {
        const currentIndex = SECTION_ORDER.indexOf(formState.currentSection);
        if (currentIndex > 0) {
            const prevSectionName = SECTION_ORDER[currentIndex - 1];
            goToSection(prevSectionName);
        }
    }, [formState.currentSection, goToSection]);

    // Guardar historia clínica
    const saveHistory = useCallback(async () => {
        const validation = validateForm();
        
        if (!validation.isValid) {
            const errorMessages = validation.errors.reduce((acc, error) => {
                acc[error.field] = error.message;
                return acc;
            }, {} as Record<string, string>);
            
            setFormState(prev => ({ ...prev, errors: errorMessages }));
            onSaveError?.("Por favor, complete todos los campos obligatorios");
            return;
        }

        setFormState(prev => ({ ...prev, isSaving: true, errors: {} }));

        try {
            let result;
            
            if (formState.mode === "create") {
                result = await medicalHistoryService.createMedicalHistory(
                    formData.patientInfo!.id,
                    formData
                );
            } else {
                result = await medicalHistoryService.updateMedicalHistory(
                    formState.historyId!,
                    formData
                );
            }

            let savedHistoryId: string;
            if (formState.mode === "create") {
                savedHistoryId = result.data.id;
                if (!savedHistoryId) {
                    throw new Error("No se pudo obtener el ID de la historia médica creada");
                }
            } else {
                savedHistoryId = result.data.id;
            }

            setFormState(prev => ({ 
                ...prev, 
                isSaving: false, 
                isDirty: false,
                historyId: savedHistoryId
            }));

            // Si hay documentos pendientes, intentar subirlos
            if (formState.mode === "create" && onDocumentsReadyToUpload) {
                try {
                    await onDocumentsReadyToUpload();
                } catch (documentError) {
                    // Los errores de documentos no deben fallar la creación de historia
                }
            }

            onSaveSuccess?.(savedHistoryId);
        } catch (error) {
            console.error("❌ Error al guardar historia médica:", error);
            setFormState(prev => ({ ...prev, isSaving: false }));
            
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
        }
    }, [formData, formState.mode, formState.historyId, validateForm, onSaveSuccess, onSaveError]);

    // Cargar historia clínica existente
    const loadHistory = useCallback(async (id: string) => {
        setFormState(prev => ({ ...prev, isLoading: true }));

        try {
            const history = await medicalHistoryService.getMedicalHistoryById(id);
            
            // Transformar los datos de la API al formato del formulario
            const formattedData: Partial<MedicalHistoryFormData> = {
                // Mapear los datos según la estructura de la API
                patientInfo: {
                    id: history.data.patientId,
                    fullname: "Paciente", // Obtener del servicio de pacientes
                    identificacion: "" // Obtener del servicio de pacientes
                },
                // Mapear el resto de los datos según la estructura
            };

            setFormData(formattedData);
            reset(formattedData as MedicalHistoryFormData);
            
            setFormState(prev => ({ 
                ...prev, 
                isLoading: false, 
                mode: "edit",
                historyId: id 
            }));
        } catch (error) {
            setFormState(prev => ({ ...prev, isLoading: false }));
            onSaveError?.("Error al cargar la historia clínica");
        }
    }, [reset, onSaveError]);

    // Resetear formulario
    const resetForm = useCallback(() => {
        setFormData({});
        reset();
        setFormState({
            mode: "create",
            isLoading: false,
            isSaving: false,
            isDirty: false,
            errors: {},
            currentSection: "patient-search"
        });
    }, [reset]);

    return {
        formData,
        formState,
        register,
        handleSubmit,
        setValue,
        watch,
        formErrors,
        updateFormData,
        setPatient,
        saveHistory,
        loadHistory,
        resetForm,
        goToSection,
        nextSection,
        previousSection,
        validateForm,
        validateSection
    };
}