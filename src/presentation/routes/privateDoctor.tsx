import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/RootLayout";
import { DoctorDashboard } from "../pages/doctor/doctorDashboard";
import QueueDoctorPage from "../pages/Queue/pages/queueDoctor";
import DoctorAppointmentsList from "../pages/doctor/page/DoctorAppointmentsList";
import { MedicalHistoryManagementPage } from "../pages/medicalHistory/pages/medicalHistoryManagementPage";
import { CreateDiagnosticPage } from "../pages/medicalHistory/pages/CreateDiagnosticPage";
import { EditDiagnosticPage } from "../pages/medicalHistory/pages/EditDiagnosticPage";
import { DiagnosticListPage } from "../pages/medicalHistory/pages/DiagnosticListPage";
import { 
    MedicalHistoriesListPageWrapper,
    PatientMedicalSummaryPageWrapper,
    MedicalHistoryDetailPageWrapper
} from "../pages/medicalHistory/pages";

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
                { path: "medicalHistory/create", element: <MedicalHistoryManagementPage /> },
                { path: "medicalHistory/edit", element: <MedicalHistoryManagementPage /> },
                { path: "medicalHistory/list", element: <MedicalHistoriesListPageWrapper /> },
                { path: "medicalHistory/patient/:patientId", element: <MedicalHistoryDetailPageWrapper /> },
                { path: "patient/:patientId/summary", element: <PatientMedicalSummaryPageWrapper /> },
                
                // Rutas para diagnósticos
                { path: "medicalHistory/:medicalHistoryId/diagnosis", element: <DiagnosticListPage /> },
                { path: "medicalHistory/:medicalHistoryId/diagnosis/new", element: <CreateDiagnosticPage /> },
                { path: "medicalHistory/:medicalHistoryId/diagnosis/:diagnosticId/edit", element: <EditDiagnosticPage /> },
            ],
        },
    ],
};
