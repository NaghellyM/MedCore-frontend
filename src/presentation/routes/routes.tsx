import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./guards";
import { publicRoutes } from "./public";
import { adminRoutes } from "./privateAdmin";
import { doctorRoutes } from "./privateDoctor";
import { nurseRoutes } from "./privateNurse";
import { patientRoutes } from "./privatePatient";

const router = createBrowserRouter([
    { path: "/", children: publicRoutes },

    {
        element: <ProtectedRoute />, 
        children: [
            adminRoutes,
            doctorRoutes,
            nurseRoutes,
            patientRoutes,
            
            { path: "*", element: <Navigate to="/login" replace /> },
        ],
    },
]);

export default router;
