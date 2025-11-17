import { useCallback } from "react";
import type {
    MedicalHistoryFormData,
    MedicalHistoryFormState,
    MedicalHistorySection,
    ValidationError,
    FormValidationResult
} from "../../types/medicalHistory";
import type { PatientSearchResult } from "../../types/patient";
import { useMedicalHistoryFormState } from "./useMedicalHistoryFormState";
import { useMedicalHistoryValidation } from "./useMedicalHistoryValidation";
import { useMedicalHistoryOperations } from "./useMedicalHistoryOperations";
import { useMedicalHistoryNavigation } from "./useMedicalHistoryNavigation";

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

    // Usar hooks especializados
    const {
        formData,
        formState,
        updateFormData: updateFormDataState,
        setFormState,
        resetFormData,
        setIsLoading,
        setIsSaving,
        // setIsDirty,  // Comentado temporalmente
        setCurrentSection,
        setErrors
    } = useMedicalHistoryFormState({
        initialData,
        mode,
        historyId
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formErrors,
        reset,
        // isDirty,  // Comentado temporalmente
        validateSection: validateSectionBase,
        validateForm: validateFormBase,
        validateForSave
    } = useMedicalHistoryValidation(formData, {
        initialData,
        mode: "onChange"
    });

    const {
        saveHistory: saveHistoryOperation,
        loadHistory: loadHistoryOperation,
        setPatient: setPatientOperation
    } = useMedicalHistoryOperations({
        onSaveSuccess,
        onSaveError,
        onDocumentsReadyToUpload
    });

    const {
        goToSection: goToSectionNav,
        nextSection: nextSectionNav,
        previousSection: previousSectionNav
    } = useMedicalHistoryNavigation({
        currentSection: formState.currentSection,
        formData,
        onSectionChange: setCurrentSection,
        onNavigationError: onSaveError
    });

        // Comentar temporalmente para evitar bucles
    // const previousIsDirtyRef = useRef(isDirty);
    // useEffect(() => {
    //     if (previousIsDirtyRef.current !== isDirty) {
    //         previousIsDirtyRef.current = isDirty;
    //         setIsDirty(isDirty);
    //     }
    // }, [isDirty, setIsDirty]);

    // Función para actualizar los datos del formulario (combina ambos estados)
    const updateFormData = useCallback((newData: Partial<MedicalHistoryFormData>) => {
        // Actualizar estado local
        updateFormDataState(newData);
        
        // Actualizar React Hook Form también
        Object.entries(newData).forEach(([key, value]) => {
            setValue(key as keyof MedicalHistoryFormData, value as any);
        });
    }, [updateFormDataState, setValue]);

    // Función para establecer el paciente seleccionado
    const setPatient = useCallback((patient: PatientSearchResult) => {
        const updatedData = setPatientOperation(patient, formData);
        updateFormData(updatedData);

        // Avanzar a la siguiente sección automáticamente
        goToSectionNav("consultation");
    }, [setPatientOperation, formData, updateFormData, goToSectionNav]);

    // Validación de secciones (wrapper del hook especializado)
    const validateSection = useCallback((section: MedicalHistorySection): ValidationError[] => {
        return validateSectionBase(section);
    }, [validateSectionBase]);

    // Validación completa del formulario (wrapper del hook especializado)
    const validateForm = useCallback((): FormValidationResult => {
        return validateFormBase();
    }, [validateFormBase]);

    // Navegación entre secciones (wrappers de los hooks especializados)
    const goToSection = useCallback((section: MedicalHistorySection) => {
        return goToSectionNav(section);
    }, [goToSectionNav]);

    const nextSection = useCallback(() => {
        return nextSectionNav();
    }, [nextSectionNav]);

    const previousSection = useCallback(() => {
        return previousSectionNav();
    }, [previousSectionNav]);

    // Guardar historia clínica
    const saveHistory = useCallback(async () => {
        const validation = validateForSave();

        if (!validation.isValid) {
            const errorMessages = validation.errors.reduce((acc, error) => {
                acc[error.field] = error.message;
                return acc;
            }, {} as Record<string, string>);

            setErrors(errorMessages);
            onSaveError?.("Por favor, complete todos los campos obligatorios");
            return;
        }

        if (!formData.patientInfo?.id) {
            onSaveError?.("Debe seleccionar un paciente");
            return;
        }

        setIsSaving(true);
        setErrors({});

        try {
            const historyId = await saveHistoryOperation(formData);
            
            // Actualizar estado para reflejar que ahora tenemos un ID
            setFormState(prev => ({
                ...prev,
                isSaving: false,
                isDirty: false,
                historyId,
                mode: "edit"
            }));

            onSaveSuccess?.(historyId);
        } catch (error) {
            setIsSaving(false);
            // El error ya se maneja en saveHistoryOperation
        }
    }, [
        validateForSave,
        formData,
        saveHistoryOperation,
        setIsSaving,
        setErrors,
        setFormState,
        onSaveSuccess,
        onSaveError
    ]);

    // Cargar historia clínica existente
    const loadHistory = useCallback(async (id: string) => {
        setIsLoading(true);

        try {
            const formattedData = await loadHistoryOperation(id);
            
            // Actualizar ambos estados
            updateFormDataState(formattedData);
            reset(formattedData as MedicalHistoryFormData);
            
            setFormState(prev => ({
                ...prev,
                isLoading: false,
                mode: "edit",
                historyId: id,
                isDirty: false
            }));
        } catch (error) {
            setIsLoading(false);
            // El error ya se maneja en loadHistoryOperation
        }
    }, [loadHistoryOperation, updateFormDataState, reset, setIsLoading, setFormState]);

    // Comentar temporalmente para evitar bucles
    // useEffect(() => {
    //     if (mode === "edit" && historyId && !formState.isLoading && !formData.patientInfo?.id) {
    //         loadHistory(historyId);
    //     }
    // }, [mode, historyId, formState.isLoading, formData.patientInfo?.id, loadHistory]);

    // Resetear formulario
    const resetForm = useCallback(() => {
        resetFormData();
        reset();
    }, [resetFormData, reset]);

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