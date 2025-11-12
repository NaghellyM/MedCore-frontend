import { type RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/RootLayout";
import { PatientDashboard } from "../pages/patient/patientDashboard";
import FiltrarCitas from "../pages/patient/components/RequestAppointment";
import PatientAppointments from "../pages/patient/components/PatientAppointments";

export const patientRoutes: RouteObject = {
    element: <RoleRoute allow={["patient"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "patientPage", element: <PatientDashboard /> },
                { path: "requestAppointment", element: <FiltrarCitas /> },
                { path: "PatientAppointments", element: <PatientAppointments /> },
            ],
        },
    ],
};
