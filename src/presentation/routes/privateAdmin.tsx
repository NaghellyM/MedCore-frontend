import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/rootLayout";
import { AdminDashboard } from "../pages/admin/adminDashboard";
import { AdminRegisterCSV } from "../pages/admin/pages/admiRegisterCSV";
import { AdminRegisterUser } from "../pages/admin/pages/admiRegisterUser";
import DoctorsList from "../pages/admin/pages/DoctorsList";
import NursesList from "../pages/admin/pages/NurseList";
import GeneralAppointment from "../pages/admin/pages/generalAppointment";

export const adminRoutes: RouteObject = {
    element: <RoleRoute allow={["admin"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "adminPage", element: <AdminDashboard /> },
                { path: "admin/registerUser", element: <AdminRegisterUser /> },
                { path: "admin/registerCSV", element: <AdminRegisterCSV /> },
                { path: '/admin/doctorsList', element: <DoctorsList /> },
                { path: '/admin/nursesList', element: <NursesList /> },
                { path: '/admin/adminAppointments', element: <GeneralAppointment /> },
            ],
        },
    ],
};
