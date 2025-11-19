import { useNavigate } from "react-router-dom";
import { Stethoscope, UserPlus, Upload, HeartPulse } from "lucide-react";
import { DashboardLayout } from "../../layouts/layout";

export function AdminDashboard() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Doctores",
      icon: <Stethoscope size={48} className="text-blue-500" />,
      description: "Gestión completa de doctores registrados en el sistema.",
      color: "from-blue-100 to-blue-50",
      hover: "hover:shadow-blue-200",
      action: () => navigate("/admin/doctorsList"),
    },
    {
      title: "Enfermeras",
      icon: <HeartPulse size={48} className="text-pink-500" />,
      description: "Consulta y administración del personal de enfermería.",
      color: "from-pink-100 to-pink-50",
      hover: "hover:shadow-pink-200",
      action: () => navigate("/admin/nursesList"),
    },
    {
      title: "Crear Usuario",
      icon: <UserPlus size={48} className="text-green-500" />,
      description: "Registrar manualmente nuevos usuarios en la plataforma.",
      color: "from-green-100 to-green-50",
      hover: "hover:shadow-green-200",
      action: () => navigate("/admin/registerUser"),
    },
    {
      title: "Cargue Masivo",
      icon: <Upload size={48} className="text-purple-500" />,
      description: "Importar varios usuarios desde un archivo CSV.",
      color: "from-purple-100 to-purple-50",
      hover: "hover:shadow-purple-200",
      action: () => navigate("/admin/registerCSV"),
    },
  ];

  return (
    <DashboardLayout
      sidebar={null}
      showSearch={false}
      headerHeightClass="pt-[80px]"
      contentMaxWidthClass="max-w-7xl"
      variant="inset"
      mainClassName="pb-10"
    >
      <main className="flex justify-center items-center min-h-[calc(100vh-80px)] p-6 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 max-w-6xl w-full justify-items-center content-center">
          {sections.map((section) => (
            <button
              key={section.title}
              onClick={section.action}
              className={`relative group bg-gradient-to-b ${section.color} rounded-2xl p-10 text-left shadow-lg transition-all duration-300 ${section.hover} hover:scale-105 w-80 h-64 flex flex-col justify-center items-center`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-white p-4 rounded-full shadow-inner">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {section.title}
                </h2>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gray-200 transition"></div>
            </button>
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
}
