import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import { MyDoctorQueueContainer } from "../containers/myDoctorQueueContainer";
import { Users } from "lucide-react";

export default function DoctorQueuePage() {
    return (
        <DashboardLayout sidebar={<DoctorSidebar />} showSearch={false}>
            <div className="p-6 space-y-6">
                {/* Título */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                        <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Cola de Pacientes</h1>
                        <p className="text-muted-foreground">Gestiona y atiende a los pacientes en espera</p>
                    </div>
                </div>

                <MyDoctorQueueContainer pollMs={60000} />
            </div>
        </DashboardLayout>
    );
}
