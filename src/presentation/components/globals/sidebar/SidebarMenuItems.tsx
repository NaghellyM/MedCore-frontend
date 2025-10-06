import { SidebarMenuItem, SidebarMenuButton } from "../../ui/sidebar";

export function SidebarMenuItems({ items }: any) {
    return (
        <>
            {items.map((item: any) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    );
}
