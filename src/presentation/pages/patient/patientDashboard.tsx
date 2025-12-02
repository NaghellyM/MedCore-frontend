import { PatientPageContent } from "./page/patientPage";
import { PatientSidebar } from "./components/patientSidebar";
import { DashboardLayout } from "../../layouts/dashboardLayout";

export function PatientDashboard() {
    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch={true}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"          
            collapsible="icon"  
            mainClassName="pb-10 "
            sidebarClassName=""
            sidebarContentClassName=""
        >
            <div className="min-h-[calc(100vh-5rem)] w-full">
                <PatientPageContent />
            </div>
        </DashboardLayout>
    );
}
