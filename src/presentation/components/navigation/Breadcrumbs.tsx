import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const routeLabels: Record<string, string> = {
  "doctorPage": "Inicio",
  "queueDoctor": "Cola de Pacientes",
  "doctorAppointmentsList": "Mis Citas",
  "consultation": "Consulta Médica",
  "prescriptions": "Recetas Médicas",
  "orders": "Órdenes Médicas",
  "documentsUpload": "Subir Documentos",
  "medicalHistory": "Historiales Médicos",
  "diagnosis": "Diagnósticos"
};

export function Breadcrumbs() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Inicio", path: "/doctorPage" }
  ];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment;
    
    // No agregar la última si es el mismo que inicio
    if (index === pathSegments.length - 1 && segment === "doctorPage") {
      return;
    }
    
    breadcrumbs.push({
      label,
      path: index < pathSegments.length - 1 ? currentPath : undefined
    });
  });

  // Si solo hay inicio, no mostrar breadcrumbs
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {index === 0 && <Home className="h-4 w-4 mr-2" />}
          {crumb.path ? (
            <button
              onClick={() => navigate(crumb.path!)}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
