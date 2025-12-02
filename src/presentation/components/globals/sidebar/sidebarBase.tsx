import { LayoutGrid } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenuButton, SidebarTrigger } from "../../ui/sidebar";

export function SidebarBase({ children, }: any) {
    return (
        <Sidebar className="md:py-28 self-start h-full" collapsible="icon" >
            <SidebarContent className="sticky top-[88px]">
                <div className="mx-2">
                    <SidebarTrigger className="pt-10 pb-4 px-2 flex justify-start" />
                    <SidebarMenuButton className="font-sans" asChild >
                        <a href="/" className="gap-2 hover:bg-sidebar-accent rounded-md">
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            <span>Inicio</span>
                        </a>
                    </SidebarMenuButton>

                </div>
                {children}
            </SidebarContent>
        </Sidebar>
    );
}
