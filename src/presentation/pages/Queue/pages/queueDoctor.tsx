import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import { MyDoctorQueueContainer } from "../containers/myDoctorQueueContainer";

/**
 * Página de cola del doctor
 * Muestra automáticamente la cola del doctor autenticado
 */
export default function DoctorQueuePage() {
    const navigate = useNavigate();

    return (
        <DashboardLayout
            sidebar={<DoctorSidebar />}
            showSearch
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
        >
            <div className="mx-auto mt-10 px-4">
                <MyDoctorQueueContainer
                    pollMs={60000}
                    onBack={() => navigate("/doctorPage")}
                />
            </div>
        </DashboardLayout>
    );
}
