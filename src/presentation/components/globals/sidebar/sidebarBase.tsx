import { Sidebar, SidebarContent } from "../../ui/sidebar";

export function SidebarBase({ children, }: any) {
    return (
        <Sidebar className="ml-3 mb-3 self-start w-fit min-w-[14rem] max-w-[18rem] h-auto border border-white rounded-xl shadow-sm">
            <SidebarContent className="mt-40 bg-white rounded-xl border border-cuidarte-tertiary shadow-sm sticky top-[88px]">
                {children}
            </SidebarContent>
        </Sidebar>
    );
}
