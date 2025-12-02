import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/rootLayout";
import { DoctorDashboard } from "../pages/doctor/doctorDashboard";
import QueueDoctorPage from "../pages/Queue/pages/queueDoctor";
import DoctorAppointmentsList from "../pages/doctor/page/DoctorAppointmentsList";
import { CreateDiagnosticView } from "../pages/diagnostic/views/createDiagnosticView";
import { EditDiagnosticView } from "../pages/diagnostic/views/editDiagnosticView";
import { DiagnosticListView } from "../pages/diagnostic/views/diagnosticListView";
import UploadDiagnosticDocument from "../pages/doctor/page/uploadDocument";

export const doctorRoutes: RouteObject = {
    element: <RoleRoute allow={["doctor"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "doctorPage", element: <DoctorDashboard /> },
                { path: "queueDoctor", element: <QueueDoctorPage /> },
                { path: "doctorAppointmentsList", element: <DoctorAppointmentsList /> },
                { path: "documentsUpload", element: <UploadDiagnosticDocument /> }, 
                // Rutas para diagnósticos
                {path: "medicalHistory/:medicalHistoryId/diagnosis",element: <DiagnosticListView />},
                {path: "medicalHistory/:medicalHistoryId/diagnosis/new", element: <CreateDiagnosticView />},
                {path: "medicalHistory/:medicalHistoryId/diagnosis/:diagnosticId/edit", element: <EditDiagnosticView />},
            ],
        },
    ],
};
