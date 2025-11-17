import { DoctorPage } from "./page/doctorPage";
import { SmartDashboardLayout } from "../../layouts/SmartDashboardLayout";

/**
 * Dashboard de médico usando el nuevo sistema de sidebar inteligente
 * 
 * Este componente demuestra cómo migrar de un sidebar manual a uno automático.
 * El sidebar se selecciona automáticamente basado en el rol del usuario.
 */
export function DoctorDashboardSmart() {
    return (
        <SmartDashboardLayout
            showSearch={true}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
            sidebarStrategy="existing" // Usa el DoctorSidebar existente
        >
            <div className="min-h-[calc(100vh-5rem)] w-full">
                <DoctorPage />
            </div>
        </SmartDashboardLayout>
    );
}

// También exportar la función original para compatibilidad
export { DoctorDashboard } from './doctorDashboard';