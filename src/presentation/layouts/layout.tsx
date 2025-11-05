import * as React from "react";
import {
    SidebarProvider, Sidebar, SidebarInset, SidebarContent,
    SidebarTrigger,
} from "../components/ui/sidebar";
import UserHeader from "../components/globals/header";
import { useIsCompact } from "../../core/hooks/useBreakpoint";
import { cn } from "../../core/utils/cn";

export function DashboardLayout({
    sidebar,
    children,
    showSearch = true,
    headerHeightClass = "pt-[80px]",
    contentMaxWidthClass = "max-w-7xl",
    sidebarContentClassName = "",
    variant = "inset",
}: {
    sidebar: React.ReactNode;
    children: React.ReactNode;
    showSearch?: boolean;
    headerHeightClass?: string;
    contentMaxWidthClass?: string;
    mainClassName?: string;
    sidebarClassName?: string;
    sidebarContentClassName?: string;
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
}) {
    const isCompact = useIsCompact();

    return (
        <SidebarProvider defaultOpen={!isCompact}>
            <div className="sticky top-0 z-50">
                <div className="relative">
                    <UserHeader showSearch={showSearch} />
                </div>
            </div>

            <div className={cn(headerHeightClass, "md:px-2")} style={{ ['--header-h' as any]: '80px' }}>
                <Sidebar
                    side="left"
                    variant={variant}
                    collapsible="icon"
                    className="
                    print:hidden
                    "
                >

                    <SidebarContent className={cn("", sidebarContentClassName)}>
                        {sidebar}
                    </SidebarContent>
                </Sidebar>
                <SidebarInset >
                    <SidebarTrigger className="flex justify-start pt-10 m-4 md:hidden" />
                    <div className={cn("mx-auto w-full px-4", contentMaxWidthClass)}>
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}