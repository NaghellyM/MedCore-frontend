import { useNavigate } from "react-router-dom";
import { 
  CalendarCheck, 
  Users, 
  FileText, 
  Upload, 
  Stethoscope,
  Pill,
  ClipboardList,
  FolderOpen
} from "lucide-react";
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
      title: "Consulta Médica",
      icon: <Stethoscope size={48} className="text-teal-500 dark:text-teal-400" />,
      description: "Realizar consulta completa con diagnósticos y tratamientos.",
      color: "from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900",
      hover: "hover:shadow-teal-200 dark:hover:shadow-teal-800/30",
      action: () => navigate("/consultation"),
    },
    {
      title: "Historiales Médicos",
      icon: <FolderOpen size={48} className="text-indigo-500 dark:text-indigo-400" />,
      description: "Consulta historiales clínicos de pacientes.",
      color: "from-indigo-100 to-indigo-50 dark:from-indigo-950 dark:to-indigo-900",
      hover: "hover:shadow-indigo-200 dark:hover:shadow-indigo-800/30",
      action: () => navigate("/medicalHistory/list"),
    },
    {
      title: "Diagnósticos",
      icon: <FileText size={48} className="text-purple-500 dark:text-purple-400" />,
      description: "Visualizar diagnósticos de pacientes (solo lectura).",
      color: "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900",
      hover: "hover:shadow-purple-200 dark:hover:shadow-purple-800/30",
      action: () => navigate("/diagnostics"),
    },
    {
      title: "Recetas Médicas",
      icon: <Pill size={48} className="text-pink-500 dark:text-pink-400" />,
      description: "Crear y consultar recetas electrónicas.",
      color: "from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900",
      hover: "hover:shadow-pink-200 dark:hover:shadow-pink-800/30",
      action: () => navigate("/prescriptions"),
    },
    {
      title: "Órdenes Médicas",
      icon: <ClipboardList size={48} className="text-cyan-500 dark:text-cyan-400" />,
      description: "Generar órdenes de laboratorio y radiología.",
      color: "from-cyan-100 to-cyan-50 dark:from-cyan-950 dark:to-cyan-900",
      hover: "hover:shadow-cyan-200 dark:hover:shadow-cyan-800/30",
      action: () => navigate("/orders"),
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
      <main className="pt-[100px] min-h-screen p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-7xl mx-auto">
          {/* Título del Dashboard */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Panel del Médico
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Gestiona consultas, pacientes y documentación médica
            </p>
          </div>


          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sections.map((section) => (
              <button
                key={section.title}
                onClick={section.action}
                className={`relative group bg-gradient-to-b ${section.color} rounded-2xl p-5 md:p-6 text-left shadow-lg transition-all duration-300 ${section.hover} hover:scale-105 hover:-translate-y-1 w-full min-h-[200px] md:min-h-[220px] flex flex-col justify-center items-center`}
              >
                <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                  <div className="bg-card p-3 rounded-full shadow-inner transition-colors duration-300">
                    {section.icon}
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-border/50 transition"></div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
