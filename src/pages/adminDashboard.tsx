import { SidebarProvider } from "../components/ui/sidebar";
import { useState } from 'react';
import { AdminSidebar } from '../components/admin/adminSidebar';
import AdminHeader from "../components/admin/admiHeader";
import { AdminRegisterUser } from '../components/admin/page/admiRegisterUser';
export function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
        <AdminHeader />
            <SidebarProvider>
                <div className="flex pt-[80px]">
                    <div className="md:hidden">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4">
                            <span className="text-2xl">☰</span>
                        </button>
                    </div>
                    <div className={`md:block w-64 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                        <AdminSidebar />
                    </div>
                    <main className="flex-1 p-4">
                        <AdminRegisterUser />
                    </main>
                </div>
            </SidebarProvider>
        </>

    );
}
