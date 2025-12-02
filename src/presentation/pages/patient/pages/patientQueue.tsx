import { useParams } from "react-router-dom";
import { QueuePatientContainer } from "../../Queue/containers/queuePatientContainer";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { PatientSidebar } from "../components/patientSidebar";

export function PatientQueue() {
    const { appointmentId } = useParams<{ appointmentId?: string }>();

    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
        >
            <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">
                <QueuePatientContainer
                    onBack={() => window.history.back()}
                    pollMs={60000}
                    enableLocalCountdown
                    showJoinQueueOption={true}
                    defaultAppointmentId={appointmentId}
                />
            </div>
        </DashboardLayout>
    );
}
