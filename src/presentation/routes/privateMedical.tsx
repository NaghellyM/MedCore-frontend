import {
    MedicalHistoriesListPageWrapper,
    PatientMedicalSummaryPageWrapper,
    MedicalHistoryDetailPageWrapper,
    EditMedicalHistoryPage,
    CreateMedicalHistoryPage,
} from "../pages/medicalHistory/pages";
import { RoleRoute } from "./guards";
import type { RouteObject } from "react-router-dom";

export const MedicalRoutes: RouteObject = {
    element: <RoleRoute allow={["doctor", "admin"]} />,
    children: [
        // Rutas para historias clínicas
        { path: "medicalHistory/create", element: <CreateMedicalHistoryPage /> },
        { path: "medicalHistory/edit", element: <CreateMedicalHistoryPage /> },
        { path: "medicalHistory/:historyId/edit", element: <EditMedicalHistoryPage /> },
        { path: "medicalHistory/list", element: <MedicalHistoriesListPageWrapper /> },
        { path: "medicalHistory/patient/:patientId", element: <MedicalHistoryDetailPageWrapper /> },
        { path: "patient/:patientId/summary", element: <PatientMedicalSummaryPageWrapper /> },
    ],
};