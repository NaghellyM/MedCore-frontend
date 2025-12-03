import { ViewMyMedicalHistoryPage } from '../../medicalHistory/views/myMedicalHistoryPageView';
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { PatientSidebar } from '../components/patientSidebar';

export function MyMedicalHistory() {
    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
        >
            <ViewMyMedicalHistoryPage />
        </DashboardLayout>
    );
}
