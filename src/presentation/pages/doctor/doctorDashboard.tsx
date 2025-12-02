import { DoctorPage } from "./page/doctorPage";
import DoctorSidebar from "./components/doctorSideBar";
import { DashboardLayout } from "../../layouts/dashboardLayout";

export function DoctorDashboard() {
  return (
    <DashboardLayout
      sidebar={<DoctorSidebar />}
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
        <DoctorPage />
      </div>
    </DashboardLayout>
  );
}
