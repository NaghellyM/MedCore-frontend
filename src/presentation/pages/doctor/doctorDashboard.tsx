import { useNavigate } from "react-router-dom";
import { CalendarCheck, Users, FileText, Upload } from "lucide-react";
import UserHeader from "../../components/globals/header";

export function DoctorDashboard() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Mis Citas",
      icon: <CalendarCheck size={48} className="text-blue-500 dark:text-blue-400" />,
      description: "Consulta y gestión de tus citas médicas programadas.",
      color: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
      hover: "hover:shadow-blue-200 dark:hover:shadow-blue-800/30",
      action: () => navigate("/doctorAppointmentsList"),
    },
    {
      title: "Cola de Pacientes",
      icon: <Users size={48} className="text-green-500 dark:text-green-400" />,
      description: "Visualiza y atiende a los pacientes en espera.",
      color: "from-green-100 to-green-50 dark:from-green-950 dark:to-green-900",
      hover: "hover:shadow-green-200 dark:hover:shadow-green-800/30",
      action: () => navigate("/queueDoctor"),
    },
    {
      title: "Diagnósticos",
      icon: <FileText size={48} className="text-purple-500 dark:text-purple-400" />,
      description: "Crear y consultar diagnósticos de pacientes.",
      color: "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900",
      hover: "hover:shadow-purple-200 dark:hover:shadow-purple-800/30",
      action: () => navigate("/queueDoctor"),
    },
    {
      title: "Subir Documentos",
      icon: <Upload size={48} className="text-orange-500 dark:text-orange-400" />,
      description: "Cargar resultados y documentos médicos.",
      color: "from-orange-100 to-orange-50 dark:from-orange-950 dark:to-orange-900",
      hover: "hover:shadow-orange-200 dark:hover:shadow-orange-800/30",
      action: () => navigate("/documentsUpload"),
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
