import { useState } from 'react';   
import { SidebarProvider } from "../components/ui/sidebar";
import { NurseSidebar } from '../components/nurse/nurseSidebar';
import { NursePageContent } from '../components/nurse/nursePage';
import NurseHeader from "../components/nurse/nurseheader";

export function NurseDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <NurseHeader />
            <SidebarProvider>
                <div className="flex pt-[80px] items-start gap-4">
                    <div className="md:hidden">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4">
                            <span className="text-2xl">☰</span>
                        </button>
                    </div>
                    <div className={`md:block w-64 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                        <NurseSidebar />
                    </div>
                    <main className="flex-1 pt-[80px] items-start min-h-screen">
                        <NursePageContent />
                    </main>
                </div>
            </SidebarProvider>
        </>
    );
}
