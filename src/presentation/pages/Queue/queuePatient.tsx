import { DashboardLayout } from "../../layouts/layout";
import { PatientSidebar } from "../patient/components/patientSidebar";
import { QueuePatient } from "./components/queuePatient";
import { useNavigate } from "react-router-dom";

export function QueuePatientPage() {
    const navigate = useNavigate();
    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch={true}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="offcanvas"
            mainClassName=""
            sidebarClassName=""
            sidebarContentClassName=""
        >
            <div className="w-full max-w-md mx-auto mt-10">
                <   QueuePatient
                    ticketNumber={32}
                    aheadCount={5}
                    etaMinutes={15}
                    onBack={() => navigate("/patientPage")}
                />
            </div>
        </DashboardLayout>

    );
}
