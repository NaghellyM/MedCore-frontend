import { AutoDashboardLayout } from "../../../layouts/autoDashboardLayout";
import { MedicalHistoryManagementForm } from "../forms/medicalHistoryManagementForm";

export function CreateMedicalHistoryPage() {
    return (
        <AutoDashboardLayout
            headerHeightClass="pt-[80px]"
            showSearch={false}
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
            sidebarStrategy="existing"
        >
            <MedicalHistoryManagementForm />
        </AutoDashboardLayout>
    );
}
