import { useState } from "react";
import PatientHeader from "./components/patientHeader";
import { PatientPageContent } from "./page/patientPage";
import { PatientSidebar } from "./components/patientSidebar";
import { SidebarProvider } from "../../components/ui/sidebar";

export function PatientDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <PatientHeader />
            <SidebarProvider>
                <div className="flex pt-[80px] items-start gap-4">
                    <div className="md:hidden">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4">
                            <span className="text-2xl">☰</span>
                        </button>
                    </div>
                    <div className={`md:block w-64 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                        <PatientSidebar />
                    </div>
                    <main className="flex-1 flex-col min-h-screen">
                        <PatientPageContent />
                    </main>
                </div>
            </SidebarProvider>
        </>
    );
}