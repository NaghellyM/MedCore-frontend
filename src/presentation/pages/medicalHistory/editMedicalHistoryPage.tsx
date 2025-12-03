/**
 * PÁGINA DE EDICIÓN DE HISTORIA CLÍNICA
 * =====================================
 * Página wrapper para editar historias clínicas existentes
 * Maneja el enrutamiento y la navegación después de la edición
 * Accesible por: Médicos y Administradores
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Layout
import { AutoDashboardLayout } from "../../layouts/autoDashboardLayout";

// Componente de formulario de edición
import { SimpleEditMedicalHistoryForm } from "./forms/simpleEditMedicalHistoryForm";

// Hooks
import { useToast } from "../../../core/hooks/notifications/useToast";

export function EditMedicalHistoryPage() {
    const { historyId } = useParams<{ historyId: string }>();
    const navigate = useNavigate();
    const { error: showError } = useToast();

    // Validar que tenemos el ID de la historia
    useEffect(() => {
        if (!historyId) {
            showError("ID de historia clínica no encontrado");
            navigate("/medicalHistory/list", { replace: true });
        }
    }, [historyId, navigate, showError]);

    if (!historyId) {
        return null;
    }

    const handleSaveError = (error: string) => {
        showError("Error al cargar la historia clínica", error);
    };

    return (
        <AutoDashboardLayout
            headerHeightClass="pt-[80px]"
            showSearch={false}
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
            sidebarStrategy="existing"
        >
            <SimpleEditMedicalHistoryForm
                historyId={historyId}
                onSaveError={handleSaveError}
            />
        </AutoDashboardLayout>
    );
}