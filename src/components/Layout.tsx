import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { PatientSidebar } from "./sidebar/patient-sidebar"
//import { AdminSidebar } from "./sidebar/admi-sidebar"
//import { NurseSidebar } from "./sidebar/nurse-sidebar"
//import { DoctorSidebar } from "./sidebar/doctor-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <PatientSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}