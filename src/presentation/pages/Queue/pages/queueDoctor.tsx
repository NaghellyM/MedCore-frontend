import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/layout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import { DoctorQueueContainer } from "../containers/queueDoctorContainer";
import { useAuth } from "../../../../core/context/authContext";

export default function DoctorQueuePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { doctorId } = useParams<{ doctorId: string }>();
    
    const id = doctorId ?? "69069ad1441b83b718aef936";
    
    console.log('DoctorQueuePage - doctorId from params:', doctorId);
    console.log('DoctorQueuePage - user from auth:', user);
    console.log('DoctorQueuePage - final doctorId:', id);
    return (
        <DashboardLayout
            sidebar={<DoctorSidebar />}
            showSearch
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="offcanvas"
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
