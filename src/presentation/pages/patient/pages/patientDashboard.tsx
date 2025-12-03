import { useNavigate } from "react-router-dom";
import { CalendarCheck, History, FileHeart, Microscope, FileText, FolderOpen } from "lucide-react";
import UserHeader from "../../../components/globals/header";

export function PatientDashboard() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Mis Citas",
            icon: <CalendarCheck size={48} className="text-primary" />,
            description: "Consulta y gestiona tus citas médicas programadas.",
            color: "from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10",
            hover: "hover:shadow-primary/20",
            action: () => navigate("/patient-appointments"),
        },
        {
            title: "Solicitar Cita",
            icon: <FileText size={48} className="text-success" />,
            description: "Agenda una nueva cita con tu médico preferido.",
            color: "from-success/20 to-success/5 dark:from-success/30 dark:to-success/10",
            hover: "hover:shadow-success/20",
            action: () => navigate("/request-appointment"),
        },
        {
            title: "Turno de Espera",
            icon: <History size={48} className="text-warning" />,
            description: "Consulta tu posición en la cola de espera.",
            color: "from-warning/20 to-warning/5 dark:from-warning/30 dark:to-warning/10",
            hover: "hover:shadow-warning/20",
            action: () => navigate("/patient-queue"),
        },
        {
            title: "Mi Historial Clínico",
            icon: <FileHeart size={48} className="text-destructive" />,
            description: "Revisa tu historial médico completo.",
            color: "from-destructive/20 to-destructive/5 dark:from-destructive/30 dark:to-destructive/10",
            hover: "hover:shadow-destructive/20",
            action: () => navigate("/my-medical-history"),
        },
        {
            title: "Resultados de Laboratorio",
            icon: <Microscope size={48} className="text-secondary" />,
            description: "Consulta tus resultados de exámenes y análisis.",
            color: "from-secondary/20 to-secondary/5 dark:from-secondary/30 dark:to-secondary/10",
            hover: "hover:shadow-secondary/20",
            action: () => navigate("/patient-documents"),
        },
        {
            title: "Mis Documentos",
            icon: <FolderOpen size={48} className="text-accent-foreground" />,
            description: "Accede a tus documentos médicos guardados.",
            color: "from-accent/40 to-accent/10 dark:from-accent/50 dark:to-accent/20",
            hover: "hover:shadow-accent/20",
            action: () => navigate("/patient-documents"),
        },
    ];

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Header con ThemeToggle integrado */}
            <UserHeader showSearch={false} showThemeToggle={true} />

            {/* Contenido principal */}
            <main className="pt-[100px] min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl">
                    {sections.map((section) => (
                        <button
                            key={section.title}
                            onClick={section.action}
                            className={`relative group bg-gradient-to-b ${section.color} rounded-2xl p-6 md:p-8 text-left shadow-lg transition-all duration-300 ${section.hover} hover:scale-105 w-full min-h-[200px] md:min-h-[240px] flex flex-col justify-center items-center`}
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
