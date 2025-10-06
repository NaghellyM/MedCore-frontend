import { SidebarMenuItems } from "./SidebarMenuItems";
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "../../ui/sidebar";

export function SidebarGroupComponent({ label, items }: any) {
    return (
        <SidebarGroup className="mb-4 h-auto">
            <SidebarGroupLabel className="font-bold text-sm text-cuidarte-accent font-sans">{label}</SidebarGroupLabel>
            <SidebarGroupContent className="font-sans">
                <SidebarMenuItems items={items} />
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
