import { type RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/rootLayout";
import { PatientDashboard } from "../pages/patient/pages/patientDashboard";
import { PatientQueue } from "../pages/patient/pages/patientQueue";
import { RequestAppointment } from "../pages/patient/pages/requestAppointment";
import { PatientAppointments } from "../pages/patient/pages/patientAppointments";
import { MedicalHistoryPage } from "../pages/medicalHistory/medicalHistory";
import { MyMedicalHistory } from "../pages/patient/pages/myMedicalHistory";
import { PatientDocuments } from "../pages/patient/pages/patientDocuments";

export const patientRoutes: RouteObject = {
    element: <RoleRoute allow={["patient"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "patient-dashboard", element: <PatientDashboard /> },
                { path: "patient-queue", element: <PatientQueue /> },
                { path: "request-appointment", element: <RequestAppointment /> },
                { path: "patient-appointments", element: <PatientAppointments /> },
                { path: "medical-history/patient/:patientId", element: <MedicalHistoryPage /> },
                { path: "my-medical-history", element: <MyMedicalHistory /> },
                { path: "patient-documents", element: <PatientDocuments /> },
            ],
        },
    ],
};
