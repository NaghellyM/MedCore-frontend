import type { RouteObject } from "react-router-dom";
import { RoleRoute } from "./guards";
import RootLayout from "../layouts/rootLayout";
import { NurseDashboard } from "../pages/nurse/nurseDashboard";


export const nurseRoutes: RouteObject = {
    element: <RoleRoute allow={["nurse"]} />,
    children: [
        {
            element: <RootLayout />,
            children: [
                { path: "/nursePage", element: <NurseDashboard /> },
                
            ],
        },
    ],
};
