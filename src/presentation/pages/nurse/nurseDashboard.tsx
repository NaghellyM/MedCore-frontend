import { NursePageContent } from "./page/nursePage";
import { NurseSidebar } from "./components/nurseSidebar";
import { DashboardLayout } from "../../layouts/layout";

export function NurseDashboard() {
    return (
        <DashboardLayout
            sidebar={<NurseSidebar />}
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
                <NursePageContent />
            </div>
        </DashboardLayout>
    );
}
