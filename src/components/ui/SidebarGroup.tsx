import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "../ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";

export function SidebarGroupComponent({ label, items }: any) {
    return (
        <SidebarGroup >
            <SidebarGroupLabel className="font-bold text-sm text-cuidarte-accent font-sans">{label}</SidebarGroupLabel>
            <SidebarGroupContent className="font-sans">
                <SidebarMenuItems items={items} />
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
