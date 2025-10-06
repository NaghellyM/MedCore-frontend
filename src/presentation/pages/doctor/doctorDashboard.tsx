import { useState } from "react";
import { DoctorPage } from "./page/doctorPage";
import DoctorHeader from "./components/doctorHeader";
import DoctorSidebar from "./components/doctorSideBar";

export function DoctorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>
      <div
        className={`fixed md:static z-40 h-full w-60 bg-white border-r transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <DoctorSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorHeader />
        <DoctorPage />
      </div>
    </div>
  );
}
