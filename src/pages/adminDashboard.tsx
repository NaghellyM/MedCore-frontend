import { SidebarProvider } from "../components/ui/sidebar";
import { useState } from "react";
import { AdminSidebar } from "../components/admin/adminSidebar";
import AdminHeader from "../components/admin/admiHeader";
import { AdminRegisterUser } from "../components/admin/page/admiRegisterUser";
import { AdminRegisterCSV } from "../components/admin/page/admiRegisterCSV";

export function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <AdminHeader />
            <SidebarProvider>
                <div className="flex pt-[80px]">
                    <div className="md:hidden">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-4"
                        >
                            <span className="text-2xl">☰</span>
                        </button>
                    </div>
                    <div
                        className={`md:block w-64 ${sidebarOpen ? "block" : "hidden"
                            } md:block`}
                    >
                        <AdminSidebar />
                    </div>
                    <main className="flex-1 p-4 flex justify-center items-center">
                        <div className="flex w-full max-w-screen-lg justify-between">
                            <div className="w-full max-w-md mx-2">
                                <AdminRegisterCSV />
                            </div>
                            <div className="w-full max-w-md mx-2">
                                <AdminRegisterUser />
                            </div>
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </>
    );
}
