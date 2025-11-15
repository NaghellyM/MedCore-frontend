import { type RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/RootLayout";
import { PatientDashboard } from "../pages/patient/patientDashboard";
import { QueuePatientPage } from "../pages/Queue/pages/queuePatient";
import FiltrarCitas from "../pages/patient/components/RequestAppointment";
import PatientAppointments from "../pages/patient/components/PatientAppointments";
import { MedicalHistoryPage } from "../pages/medicalHistory/medicalHistory";
import { MyMedicalHistoryPage } from "../pages/medicalHistory/myMedicalHistory";

export const patientRoutes: RouteObject = {
    element: <RoleRoute allow={["patient"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "patientPage", element: <PatientDashboard /> },
                { path: "queuePatient", element: <QueuePatientPage /> },
                { path: "requestAppointment", element: <FiltrarCitas /> },
                { path: "PatientAppointments", element: <PatientAppointments /> },
                { path: "medical-history/patient/:patientId", element: <MedicalHistoryPage /> },
                { path: "my-medical-history", element: <MyMedicalHistoryPage /> },
            ],
        },
    ],
};
