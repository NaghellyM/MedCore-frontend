import { useNavigate } from "react-router-dom";
import { Stethoscope, UserPlus, Upload, HeartPulse } from "lucide-react";
import UserHeader from "../../components/globals/header";

export function AdminDashboard() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Doctores",
      icon: <Stethoscope size={48} className="text-blue-500 dark:text-blue-400" />,
      description: "Gestión completa de doctores registrados en el sistema.",
      color: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
      hover: "hover:shadow-blue-200 dark:hover:shadow-blue-800/30",
      action: () => navigate("/admin/doctorsList"),
    },
    {
      title: "Enfermeras",
      icon: <HeartPulse size={48} className="text-pink-500 dark:text-pink-400" />,
      description: "Consulta y administración del personal de enfermería.",
      color: "from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900",
      hover: "hover:shadow-pink-200 dark:hover:shadow-pink-800/30",
      action: () => navigate("/admin/nursesList"),
    },
    {
      title: "Crear Usuario",
      icon: <UserPlus size={48} className="text-green-500 dark:text-green-400" />,
      description: "Registrar manualmente nuevos usuarios en la plataforma.",
      color: "from-green-100 to-green-50 dark:from-green-950 dark:to-green-900",
      hover: "hover:shadow-green-200 dark:hover:shadow-green-800/30",
      action: () => navigate("/admin/registerUser"),
    },
    {
      title: "Cargue Masivo",
      icon: <Upload size={48} className="text-purple-500 dark:text-purple-400" />,
      description: "Importar varios usuarios desde un archivo CSV.",
      color: "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900",
      hover: "hover:shadow-purple-200 dark:hover:shadow-purple-800/30",
      action: () => navigate("/admin/registerCSV"),
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header con ThemeToggle integrado */}
      <UserHeader showSearch={false} showThemeToggle={true} />

      {/* Contenido principal */}
      <main className="pt-[100px] min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl">
          {sections.map((section) => (
            <button
              key={section.title}
              onClick={section.action}
              className={`relative group bg-gradient-to-b ${section.color} rounded-2xl p-6 md:p-8 text-left shadow-lg transition-all duration-300 ${section.hover} hover:scale-105 w-full min-h-[220px] md:min-h-[260px] flex flex-col justify-center items-center`}
            >
              <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                <div className="bg-card p-3 md:p-4 rounded-full shadow-inner transition-colors duration-300">
                  {section.icon}
                </div>
                <h2 className="text-lg md:text-xl font-bold text-foreground">
                  {section.title}
                </h2>
                <p className="text-muted-foreground text-xs md:text-sm">{section.description}</p>
              </div>
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-border transition"></div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
