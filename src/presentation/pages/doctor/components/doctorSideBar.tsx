import React, { useState } from "react";
import {
  LayoutGrid,
  Calendar,
  User,
  Video,
  Activity,
  ArrowRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "../../../components/ui/sidebar";

type Item = {
  id: string;
  label: string;
  Icon: React.ComponentType<any>;
  href?: string;
};

const ITEMS: Item[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutGrid, href: "#" },
  { id: "agenda", label: "Agenda", Icon: Calendar, href: "#" },
  { id: "pacientes", label: "Pacientes", Icon: User, href: "#" },
  { id: "telemedicina", label: "Telemedicina", Icon: Video, href: "#" },
  { id: "medicamentos", label: "Medicamentos", Icon: Activity, href: "#" },
  { id: "derivaciones", label: "Derivaciones", Icon: ArrowRight, href: "#" },
];

// src/components/DoctorSidebar.tsx
export default function DoctorSidebar() {
  const [active, setActive] = useState<string>("dashboard");

  return (
    <SidebarProvider>
      <Sidebar className="h-screen !w-64 border-r bg-white flex flex-col">
        <SidebarHeader>
          <div className="px-4 py-3">
            <span className="text-black font-bold text-lg">MedCore</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4 text-black flex-1">
          <SidebarMenu>
            {ITEMS.map(({ id, label, Icon }) => {
              const isActive = id === active;
              return (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => setActive(id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition
                        ${isActive ? "bg-gray-200 shadow-inner" : "hover:bg-gray-100"}
                      `}
                    >
                      <Icon className="h-5 w-5 text-black" />
                      <span className="font-medium text-black">{label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="px-4 py-3 text-sm text-gray-600">v1.0 • MedCore</div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
