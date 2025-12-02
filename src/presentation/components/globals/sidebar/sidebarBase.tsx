import { LayoutGrid } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenuButton, SidebarTrigger } from "../../ui/sidebar";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../../../core/services/authService";

//Obtiene la ruta de inicio según el rol del usuarioSI
function getHomeRouteByRole(): string {
    const user = getCurrentUser();
    const role = user?.role?.toUpperCase();
    
    switch (role) {
        case "ADMIN":
        case "ADMINISTRADOR":
            return "/adminPage";
        case "MEDICO":
        case "DOCTOR":
            return "/doctor/dashboard";
        case "ENFERMERA":
        case "NURSE":
            return "/nurse/dashboard";
        case "PACIENTE":
        case "PATIENT":
            return "/patient/dashboard";
        default:
            return "/";
    }
}

export function SidebarBase({ children, }: any) {
    const homeRoute = getHomeRouteByRole();
    
    return (
        <Sidebar className="md:py-28 self-start h-full" collapsible="icon" >
            <SidebarContent className="sticky top-[88px]">
                <div className="mx-2">
                    <SidebarTrigger className="pt-10 pb-4 px-2 flex justify-start" />
                    <SidebarMenuButton className="font-sans" asChild >
                        <Link to={homeRoute} className="gap-2 hover:bg-sidebar-accent rounded-md">
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            <span>Inicio</span>
                        </Link>
                    </SidebarMenuButton>

                </div>
                {children}
            </SidebarContent>
        </Sidebar>
    );
}
