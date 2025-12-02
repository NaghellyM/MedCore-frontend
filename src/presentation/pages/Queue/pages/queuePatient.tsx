import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { PatientSidebar } from "../../patient/components/patientSidebar";
import { QueuePatientContainer } from "../containers/queuePatientContainer";
import { useNavigate, useParams } from "react-router-dom";

// Página de la cola para pacientes usando el layout de dashboard
export function QueuePatientPage() {
    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId?: string }>();

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
                    onBack={() => navigate("/patientPage")}
                    pollMs={60000}
                    enableLocalCountdown
                    showJoinQueueOption={true}
                    defaultAppointmentId={appointmentId}
                />
            </div>
        </DashboardLayout>
    );
}
