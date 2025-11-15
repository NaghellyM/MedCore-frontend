import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/layout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import { DoctorQueueContainer } from "../containers/queueDoctorContainer";

export default function DoctorQueuePage() {
    const navigate = useNavigate();
    const { doctorId } = useParams<{ doctorId: string }>();
    
    const id = doctorId ?? "6915e81c04aec134a1f67095";
    
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
                <DoctorQueueContainer
                    doctorId={id}
                    pollMs={10000}
                    onBack={() => navigate("/doctorPage")}
                />
            </div>
        </DashboardLayout>
    );
}
