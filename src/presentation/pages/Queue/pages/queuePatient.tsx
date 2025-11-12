import { DashboardLayout } from "../../../layouts/layout";
import { PatientSidebar } from "../../patient/components/patientSidebar";
import { QueuePatientContainer } from "../containers/queuePatientContainer";
import { useNavigate, useParams } from "react-router-dom";

export function QueuePatientPage() {
    const navigate = useNavigate();
    const { ticketId } = useParams<{ ticketId: string }>();
    const id = ticketId ?? "497cdc97-3b95-45eb-acd7-d0fa9632d074";

    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="offcanvas"
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
