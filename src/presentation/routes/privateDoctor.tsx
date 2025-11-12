import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/RootLayout";
import { DoctorDashboard } from "../pages/doctor/doctorDashboard";
import QueueDoctorPage from "../pages/Queue/pages/queueDoctor";


export const doctorRoutes: RouteObject = {
    element: <RoleRoute allow={["doctor"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "doctorPage", element: <DoctorDashboard /> },
                { path: "queueDoctor", element: <QueueDoctorPage /> },
            ],
        },
    ],
};
