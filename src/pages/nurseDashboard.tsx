import { SidebarProvider } from "../components/ui/sidebar";
import { useState } from 'react';
import { NurseSidebar } from '../components/nurse/nurseSidebar';
import { NursePageContent } from '../components/nurse/nursePage';

export function NurseDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SidebarProvider>
            <div className="flex">
                <div className="md:hidden">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4">
                        <span className="text-2xl">☰</span>
                    </button>
                </div>
                <div className={`md:block w-64 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                    <NurseSidebar />
                </div>

                <main className="flex-1 p-4">
                    <NursePageContent />
                </main>
            </div>
        </SidebarProvider>
    );
}
