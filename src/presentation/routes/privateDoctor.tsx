import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/RootLayout";
import { DoctorDashboard } from "../pages/doctor/doctorDashboard";
import DoctorAppointmentsList from "../pages/doctor/page/DoctorAppointmentsList";
import UploadDiagnosticDocument from "../pages/doctor/page/uploadDocument";


export const doctorRoutes: RouteObject = {
    element: <RoleRoute allow={["doctor"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "doctorPage", element: <DoctorDashboard /> },
                { path: "DoctorAppointmentsList", element: <DoctorAppointmentsList /> },
                { path: "documentsUpload", element: <UploadDiagnosticDocument /> },
                
            ],
        },
    ],
};
