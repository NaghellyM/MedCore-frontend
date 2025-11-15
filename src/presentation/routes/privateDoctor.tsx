import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/RootLayout";
import { DoctorDashboard } from "../pages/doctor/doctorDashboard";
import QueueDoctorPage from "../pages/Queue/pages/queueDoctor";
import DoctorAppointmentsList from "../pages/doctor/page/DoctorAppointmentsList";
import { MedicalHistoryManagementPage } from "../pages/medicalHistory/pages/medicalHistoryManagementPage";

export const doctorRoutes: RouteObject = {
    element: <RoleRoute allow={["doctor"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "doctorPage", element: <DoctorDashboard /> },
                { path: "queueDoctor", element: <QueueDoctorPage /> },
                { path: "DoctorAppointmentsList", element: <DoctorAppointmentsList /> },
                
                // Rutas para historias clínicas
                { path: "medical-history/create", element: <MedicalHistoryManagementPage /> },
                { path: "medical-history/edit", element: <MedicalHistoryManagementPage /> },
            ],
        },
    ],
};
