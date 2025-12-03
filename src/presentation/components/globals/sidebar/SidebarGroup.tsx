import { SidebarMenuItems } from "./SidebarMenuItems";
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "../../ui/sidebar";

export function SidebarGroupComponent({ label, items }: any) {
    return (
        <SidebarGroup className="h-auto w-full">
            <SidebarGroupLabel className="font-bold text-sm text-primary font-sans">{label}</SidebarGroupLabel>
            <SidebarGroupContent className="font-sans">
                <SidebarMenuItems items={items} />
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
