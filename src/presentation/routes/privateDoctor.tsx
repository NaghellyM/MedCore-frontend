import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/rootLayout";
import { DoctorDashboard } from "../pages/doctor/doctorDashboard";
import QueueDoctorPage from "../pages/Queue/pages/queueDoctor";
import DoctorAppointmentsList from "../pages/doctor/page/doctorAppointmentsList";
import { DiagnosticListView } from "../pages/diagnostic/pages/diagnosticListView";
import { AllDiagnosticsPage } from "../pages/diagnostic/pages/allDiagnosticsPage";
import { DiagnosticDetailPage } from "../pages/diagnostic/pages/diagnosticDetailPage";
import UploadDiagnosticDocument from "../pages/doctor/page/uploadDocument";
import { ConsultationPage } from "../pages/consultation";
import { PrescriptionsPage } from "../pages/doctor/page/prescriptionsPage";
import { OrdersPage } from "../pages/doctor/page/ordersPage";

export const doctorRoutes: RouteObject = {
    element: <RoleRoute allow={["doctor"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "doctorPage", element: <DoctorDashboard /> },
                { path: "queueDoctor", element: <QueueDoctorPage /> },
                { path: "doctorAppointmentsList", element: <DoctorAppointmentsList /> },
                { path: "consultation", element: <ConsultationPage /> },
                { path: "prescriptions", element: <PrescriptionsPage /> },
                { path: "orders", element: <OrdersPage /> },
                { path: "documentsUpload", element: <UploadDiagnosticDocument /> },
                // Listar todos los diagnósticos del sistema
                { path: "diagnostics", element: <AllDiagnosticsPage /> },
                // Listar diagnósticos de una historia médica específica
                { path: "medicalHistory/:medicalHistoryId/diagnosis", element: <DiagnosticListView /> },
                // Ver detalle de un diagnóstico específico
                { path: "medical-history/:medicalHistoryId/diagnosis/:diagnosticId", element: <DiagnosticDetailPage /> },
            ],
        },
    ],
};
