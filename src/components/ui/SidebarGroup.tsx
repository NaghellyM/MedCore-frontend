import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "../ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";

export function SidebarGroupComponent({ label, items }: any) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-sm">{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenuItems items={items} />
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
