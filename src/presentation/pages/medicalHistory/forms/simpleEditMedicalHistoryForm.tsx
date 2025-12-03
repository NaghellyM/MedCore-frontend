/**
 * VISTA DE HISTORIA CLÍNICA - SOLO LECTURA
 * =========================================
 * Responsabilidad única: Mostrar historia clínica con diagnósticos
 * Sin capacidad de edición, solo visualización y eliminación de diagnósticos
 */

import { useNavigate } from "react-router-dom";

// Componentes especializados
import { LoadingState, ErrorState } from "../components/StateComponents";
import { MedicalHistoryHeader } from "../components/MedicalHistoryHeader";
import { MedicalHistoryInfoCard } from "../components/MedicalHistoryInfoCard";
import { DiagnosticsSection } from "../components/DiagnosticsSection";

// Hooks especializados
import { 
    useLoadMedicalHistory, 
    useDiagnosticsList 
} from "../../../../core/hooks/medicalHistory";

interface SimpleEditMedicalHistoryFormProps {
    historyId: string;
    onSaveError?: (error: string) => void;
}

export function SimpleEditMedicalHistoryForm({
    historyId,
    onSaveError
}: SimpleEditMedicalHistoryFormProps) {
    const navigate = useNavigate();

    // Hook 1: Cargar datos de la historia clínica
    const {
        medicalHistory,
        diagnostics: loadedDiagnostics,
        patientName,
        isLoading,
        error,
    } = useLoadMedicalHistory({
        historyId,
        enabled: true,
        onError: (errorMsg) => {
            onSaveError?.(errorMsg);
        },
    });

    // Hook 2: Gestionar lista de diagnósticos con filtros
    const {
        diagnostics,
        showDeleted,
        canViewDeleted,
        setShowDeleted,
        handleDiagnosticDeleted
    } = useDiagnosticsList({
        initialDiagnostics: loadedDiagnostics
    });

    // Estados de carga y error
    if (isLoading) {
        return <LoadingState message="Cargando historia clínica..." />;
    }

    if (error) {
        return (
            <ErrorState
                title="Error al cargar la historia clínica"
                message={error}
                onRetry={() => navigate("/medicalHistory/list")}
            />
        );
    }

    if (!medicalHistory) {
        return (
            <ErrorState
                title="Historia clínica no encontrada"
                message="No se pudo encontrar la historia clínica solicitada"
                onRetry={() => navigate("/medicalHistory/list")}
            />
        );
    }

    // Renderizado principal - Solo lectura
    return (
        <div className="space-y-6">
            {/* Header de navegación */}
            <MedicalHistoryHeader />

            {/* Información básica de la historia */}
            <MedicalHistoryInfoCard 
                medicalHistory={medicalHistory}
                patientName={patientName}
            />

            {/* Sección de diagnósticos - Solo lectura */}
            <DiagnosticsSection
                diagnostics={diagnostics}
                canViewDeleted={canViewDeleted}
                showDeleted={showDeleted}
                onToggleDeleted={setShowDeleted}
                onDelete={handleDiagnosticDeleted}
            />
        </div>
    );
}
