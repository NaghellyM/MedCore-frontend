import { useState } from "react";
import { ChevronLeft, ChevronRight, Save, FileText, User, Activity, Stethoscope } from "lucide-react";
import { useMedicalHistoryForm } from "../../hooks/useMedicalHistoryForm";
import { PatientInfoSection } from "./sections/patientInfoSection";
import { ConsultationSection } from "./sections/consultationSection";
import { PhysicalExamSection } from "./sections/physicalExamSection";
import { DiagnosticsWithOptionalDocuments } from "./sections/diagnosticsWithOptionalDocuments";
import type {
    MedicalHistorySection,
    MedicalHistoryFormData,
    SectionConfig
} from "../../../../../core/types/medicalHistory";
import type { PatientSearchResult } from "../../../../../core/types/patient";

interface MedicalHistoryFormProps {
    selectedPatient: PatientSearchResult | null;
    initialData?: Partial<MedicalHistoryFormData>;
    mode?: "create" | "edit";
    historyId?: string;
    onSaveSuccess?: (historyId: string) => void;
    onSaveError?: (error: string) => void;
}

const SECTION_CONFIGS: SectionConfig[] = [
    {
        id: "patient-search",
        title: "Información del Paciente",
        description: "Datos básicos del paciente",
        icon: User,
        isRequired: true,
        order: 1
    },
    {
        id: "consultation",
        title: "Motivo de Consulta",
        description: "Razón de la consulta e historia actual",
        icon: FileText,
        isRequired: true,
        order: 2
    },
    {
        id: "physical-exam",
        title: "Examen Físico",
        description: "Signos vitales y hallazgos físicos",
        icon: Activity,
        isRequired: false,
        order: 3
    },
    {
        id: "diagnostics",
        title: "Diagnósticos",
        description: "Diagnósticos e impresión clínica",
        icon: Stethoscope,
        isRequired: true,
        order: 4
    }
];

export function MedicalHistoryForm({
    selectedPatient,
    initialData,
    mode = "create",
    historyId,
    onSaveSuccess,
    onSaveError
}: MedicalHistoryFormProps) {
    const {
        formData,
        formState,
        updateFormData,
        setPatient,
        saveHistory,
        goToSection,
        nextSection,
        previousSection,
        validateSection
    } = useMedicalHistoryForm({
        initialData,
        mode,
        historyId,
        onSaveSuccess,
        onSaveError
    });

    const [showValidationErrors, setShowValidationErrors] = useState(false);

    // Configurar paciente cuando se selecciona
    useState(() => {
        if (selectedPatient && !formData.patientInfo) {
            setPatient(selectedPatient);
        }
    });

    const currentSectionConfig = SECTION_CONFIGS.find(
        config => config.id === formState.currentSection
    );

    const currentSectionIndex = SECTION_CONFIGS.findIndex(
        config => config.id === formState.currentSection
    );

    const canGoNext = currentSectionIndex < SECTION_CONFIGS.length - 1;
    const canGoPrevious = currentSectionIndex > 0;

    const handleNextSection = () => {
        const errors = validateSection(formState.currentSection);
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
        await saveHistory();
    };

    const renderCurrentSection = () => {
        const commonProps = {
            data: formData,
            onUpdate: updateFormData,
            isReadOnly: false,
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
                return <DiagnosticsWithOptionalDocuments {...commonProps} />;
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
            {/* Progress Steps */}
            <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === "create" ? "Nueva Historia Clínica" : "Editar Historia Clínica"}
                    </h2>
                    <div className="text-sm text-gray-500">
                        Paso {currentSectionIndex + 1} de {SECTION_CONFIGS.length}
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex items-center space-x-2 overflow-x-auto">
                        {SECTION_CONFIGS.map((section, index) => {
                            const isActive = section.id === formState.currentSection;
                            const isCompleted = index < currentSectionIndex;
                            const hasErrors = formState.errors && Object.keys(formState.errors).some(
                                key => key.startsWith(section.id)
                            );

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                                                transition-colors whitespace-nowrap ${isActive
                                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                                            : isCompleted
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : hasErrors && showValidationErrors
                                                    ? "bg-red-100 text-red-700 border border-red-200"
                                                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                >
                                    <section.icon className="w-4 h-4" />
                                    {section.title}
                                    {section.isRequired && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Current Section */}
            <div>
                {renderCurrentSection()}
            </div>

            {/* Navigation and Save */}
            <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={handlePreviousSection}
                            disabled={!canGoPrevious}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium
                                    ${canGoPrevious
                                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                        </button>

                        {canGoNext && (
                            <button
                                onClick={handleNextSection}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
                            >
                                Siguiente
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={formState.isSaving}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                                ${formState.isSaving
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                    >
                        {formState.isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {mode === "create" ? "Crear Historia" : "Guardar Cambios"}
                            </>
                        )}
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-1">
                        <div
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{
                                width: `${((currentSectionIndex + 1) / SECTION_CONFIGS.length) * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}