import { House } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenuButton, SidebarTrigger } from "../../ui/sidebar";
import { Link } from "react-router-dom";
import { getHomeRouteByRole } from "../../../../core/utils/navigation";

export function SidebarBase({ children, }: any) {
    const homeRoute = getHomeRouteByRole();
    
    return (
        <Sidebar className="md:py-28 self-start h-full" collapsible="icon" >
            <SidebarContent className="sticky top-[88px]">
                <div className="mx-2">
                    <SidebarTrigger className="pt-10 pb-4 px-2 flex justify-start" />
                    <SidebarMenuButton className="font-sans" asChild >
                        <Link to={homeRoute} className="gap-2 hover:bg-sidebar-accent rounded-md">
                            <House className="mr-2 h-4 w-4" />
                            <span>Inicio</span>
                        </Link>
                    </SidebarMenuButton>

                </div>
                {children}
            </SidebarContent>
        </Sidebar>
    );
}
