import { useState, useEffect } from "react";
import { User, FileText, Activity, Stethoscope } from "lucide-react";

// Hooks especializados del dominio
import { useToast } from "../../../../core/hooks/notifications/useToast";
import { useMedicalHistoryForm } from "../../../../core/hooks/medicalHistory/useMedicalHistoryForm";
import { useMedicalHistoryOrchestrator } from "../../../../core/hooks/medicalHistory/useMedicalHistoryOrchestrator";
import { useDocumentUpload } from "../../../../core/types/documents/useDocumentUpload";

// Componentes UI reutilizables extraídos
import { FormNavigationControls } from "../../../components/globals/FormNavigationControls";
import { FormStatusMessages, useStatusMessages } from "../../../components/globals/FormStatusMessages";
import { DocumentsUploadSection } from "../../../components/globals/DocumentsUploadSection";

// Secciones específicas del formulario médico
import { PatientInfoSection } from "./sections/patientInfoSection";
import { ConsultationSection } from "./sections/consultationSection";
import { PhysicalExamSection } from "./sections/physicalExamSection";
import { DiagnosticsSection } from "./sections/diagnosticsSection";

// Tipos del dominio
import type {
    MedicalHistorySection,
    MedicalHistoryFormData
} from "../../../../core/types/medicalHistory";
import type { PatientSearchResult } from "../../../../core/types/patient";
import type { SectionConfig } from "../../../components/globals/FormNavigationControls";

// CONFIGURACIÓN DE SECCIONES
const MEDICAL_HISTORY_SECTIONS: SectionConfig[] = [
    {
        id: "patient-search",
        title: "Información del Paciente",
        description: "Datos básicos del paciente seleccionado",
        icon: User,
        isRequired: true,
        order: 1
    },
    {
        id: "consultation",
        title: "Motivo de Consulta",
        description: "Razón de la consulta e historia de la enfermedad actual",
        icon: FileText,
        isRequired: true,
        order: 2
    },
    {
        id: "physical-exam",
        title: "Examen Físico",
        description: "Signos vitales y hallazgos del examen físico",
        icon: Activity,
        isRequired: false,
        order: 3
    },
    {
        id: "diagnostics",
        title: "Diagnósticos",
        description: "Diagnósticos principales y secundarios",
        icon: Stethoscope,
        isRequired: true,
        order: 4
    }
];

// INTERFACES

interface MedicalHistoryFormProps {
    selectedPatient: PatientSearchResult | null;
    initialData?: Partial<MedicalHistoryFormData>;
    mode?: "create" | "edit";
    historyId?: string;
    onSaveSuccess?: (historyId: string) => void;
    onSaveError?: (error: string) => void;
}

export function MedicalHistoryForm({
    selectedPatient,
    initialData,
    mode = "create",
    historyId,
    onSaveSuccess,
    onSaveError
}: MedicalHistoryFormProps) {


    // STATE LOCAL (Solo UI específica)

    const [showValidationErrors, setShowValidationErrors] = useState(false);

    // Hook de notificaciones toast
    const { success, error: showError } = useToast();

    // Hook de mensajes de estado
    const {
        message,
        showSuccess,
        showError: showErrorMessage,
        showInfo,
        clearMessage
    } = useStatusMessages();

    // Hook de documentos
    const {
        documents,
        isUploading: isUploadingDocs,
        addFiles,
        removeDocument,
        uploadDocumentsWithDiagnosticId,
        clearDocuments,
    } = useDocumentUpload({
        patientId: selectedPatient?.id,
        onUploadSuccess: () => {
            success("Documento subido exitosamente");
        },
        onUploadError: (error) => {
            showError("Error al subir documento", error);
        }
    });

    // Hook orquestador 
    const {
        state: orchestratorState,
        currentStep: orchestratorStep,
        isProcessing: isOrchestrating,
        execute: executeOrchestration,
        
    } = useMedicalHistoryOrchestrator({
        onSuccess: (result) => {
            const successMessage = mode === "create"
                ? "Historia clínica creada exitosamente"
                : "Historia clínica actualizada exitosamente";

            success(successMessage);
            showSuccess(successMessage);
            clearDocuments();

            if (result.historyId) {
                onSaveSuccess?.(result.historyId);
            }
        },
        onError: (error) => {
            showError("Error al guardar la historia clínica", error.message);
            showErrorMessage("Error al guardar", error.message);
            onSaveError?.(error.message);
        },
        options: {
            onProgress: (state) => {
                const progressMessages: Record<string, string> = {
                    "validating": "Validando datos del formulario...",
                    "creating-history": "Creando historia médica...",
                    "creating-diagnostic": "Registrando diagnóstico...",
                    "uploading-documents": `Subiendo ${documents.length} documento(s)...`,
                };

                if (progressMessages[state]) {
                    showInfo(progressMessages[state], undefined, true);
                }
            }
        }
    });

    // Hook del formulario (manejo de estado y validación)
    const {
        formData,
        formState,
        updateFormData,
        setPatient,
        saveHistory: triggerSave,
        goToSection,
        nextSection,
        previousSection,
        validateSection
    } = useMedicalHistoryForm({
        initialData,
        mode,
        historyId,
        onSaveSuccess: () => {
        },
        onSaveError: (error) => {
            showErrorMessage("Error del formulario", error);
        },
        onDocumentsReadyToUpload: async () => {
            if (!selectedPatient?.id || !formData.patientInfo?.id) {
                throw new Error("Información del paciente faltante");
            }

            try {
                const result = await executeOrchestration(
                    formData.patientInfo.id,
                    formData,
                    async (diagnosticId: string) => {
                        if (documents.length > 0) {
                            await uploadDocumentsWithDiagnosticId(diagnosticId);
                        }
                    }
                );

                if (!result.success) {
                    throw new Error(result.error || "La orquestación falló");
                }
            } catch (error) {
                throw error;
            }
        }
    });

    // EFECTOS

    // Establecer paciente cuando se selecciona
    useEffect(() => {
        if (selectedPatient && !formData.patientInfo) {
            setPatient(selectedPatient);
        }
    }, [selectedPatient, formData.patientInfo, setPatient]);

    // VALORES COMPUTADOS
    const isProcessing = isOrchestrating || formState.isSaving;
    const hasFormErrors = Object.keys(formState.errors || {}).length > 0;

    // EVENTOS 

    const handleNextSection = () => {
        const errors = validateSection(formState.currentSection);
        const currentSectionConfig = MEDICAL_HISTORY_SECTIONS.find(
            config => config.id === formState.currentSection
        );

        if (errors.length > 0 && currentSectionConfig?.isRequired) {
            setShowValidationErrors(true);
            return;
        }
        setShowValidationErrors(false);
        nextSection();
    };

    const handlePreviousSection = () => {
        setShowValidationErrors(false);
        previousSection();
    };

    const handleSectionClick = (sectionId: MedicalHistorySection) => {
        setShowValidationErrors(false);
        goToSection(sectionId);
    };

    const handleSave = async () => {
        setShowValidationErrors(true);
        clearMessage();
        await triggerSave();
    };

    // RENDER HELPERS

    const renderCurrentSection = () => {
        const commonProps = {
            data: formData,
            onUpdate: updateFormData,
            isReadOnly: isProcessing,
            errors: showValidationErrors ? formState.errors : undefined
        };

        switch (formState.currentSection) {
            case "patient-search":
                return <PatientInfoSection {...commonProps} />;
            case "consultation":
                return <ConsultationSection {...commonProps} />;
            case "physical-exam":
                return <PhysicalExamSection {...commonProps} />;
            case "diagnostics":
                return <DiagnosticsSection {...commonProps} />;
            default:
                return null;
        }
    };

    if (!selectedPatient && formState.currentSection === "patient-search") {
        return (
            <div className="bg-white rounded-lg border p-6">
                <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Seleccione un Paciente
                    </h3>
                    <p className="text-gray-500">
                        Para continuar con la historia clínica, primero debe seleccionar un paciente.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Mensajes de Estado */}
            <FormStatusMessages
                statusMessage={message || undefined}
                orchestrationProgress={isOrchestrating ? {
                    isActive: true,
                    currentStep: orchestratorStep || "Preparando datos",
                    state: orchestratorState
                } : undefined}
                onMessageDismiss={clearMessage}
            />

            {/* Controles de Navegación */}
            <FormNavigationControls
                sections={MEDICAL_HISTORY_SECTIONS}
                currentSection={formState.currentSection}
                isProcessing={isProcessing}
                hasErrors={hasFormErrors}
                showValidationErrors={showValidationErrors}
                formErrors={formState.errors}
                onSectionClick={handleSectionClick}
                onNext={handleNextSection}
                onPrevious={handlePreviousSection}
                onSave={handleSave}
                title={mode === "create" ? "Nueva Historia Clínica" : "Editar Historia Clínica"}
                saveButtonText={mode === "create" ? "Crear Historia" : "Guardar Cambios"}
                disabled={!selectedPatient}
            />

            {/* Contenido de la Sección Actual */}
            <div className="bg-white rounded-lg border p-6">
                {renderCurrentSection()}
            </div>

            {/* Carga de Documentos */}
            <DocumentsUploadSection
                documents={documents}
                isUploading={isUploadingDocs}
                isProcessing={isProcessing}
                onAddFiles={addFiles}
                onRemoveDocument={removeDocument}
                onClearDocuments={clearDocuments}
                title="Documentos Adjuntos"
                description="Adjunte imágenes, estudios o documentos relacionados con la historia clínica (opcional)"
                disabled={!selectedPatient}
            />
        </div>
    );
}