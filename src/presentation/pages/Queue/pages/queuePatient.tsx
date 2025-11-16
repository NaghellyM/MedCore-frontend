import { DashboardLayout } from "../../../layouts/layout";
import { PatientSidebar } from "../../patient/components/patientSidebar";
import { QueuePatientContainer } from "../containers/queuePatientContainer";
import { useNavigate, useParams } from "react-router-dom";

export function QueuePatientPage() {
    const navigate = useNavigate();
    const { ticketId } = useParams<{ ticketId: string }>();
    
    // Si no hay ticketId, redirigir a la página de error o mostrar mensaje
    if (!ticketId) {
        console.error("⚠️ No se proporcionó ticketId en la URL");
        // TODO: Redirigir a página de error o mostrar mensaje apropiado
        return <div>Error: ID de ticket no encontrado</div>;
    }
    
    const id = ticketId;

    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
        >
            <div className="w-full max-w-md mx-auto mt-10">
                <QueuePatientContainer
                    ticketId={id}
                    onBack={() => navigate("/patientPage")}
                    pollMs={10000}
                    enableLocalCountdown
                />
            </div>
        </DashboardLayout>
    );
}
