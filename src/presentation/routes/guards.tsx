import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../core/context/authContext";



type Role = "admin" | "doctor" | "nurse" | "patient";
const mapRoleToEnglish = (role: string): Role => {
    const roleMap: Record<string, Role> = {
        'ADMINISTRADOR': 'admin',
        'ADMIN': 'admin',
        'MEDICO': 'doctor',
        'DOCTOR': 'doctor',
        'ENFERMERO': 'nurse',
        'ENFERMERA': 'nurse',
        'NURSE': 'nurse',
        'PACIENTE': 'patient',
        'PATIENT': 'patient',
    };
    return roleMap[role?.toUpperCase()] || 'patient';
};

// Temporal: desactivar guards durante desarrollo / pruebas.
// Cambia esta constante a `false` para volver a activar la protección.
const DISABLE_GUARDS = true;

export function ProtectedRoute() {
    if (DISABLE_GUARDS) {
        return <Outlet />;
    }

    const { loading, isAuthenticated } = useAuth();
    const loc = useLocation();
    if (loading) return <div className="p-6">Verificando sesión…</div>;
    if (!isAuthenticated) {
        const to = `/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`;
        return <Navigate to={to} replace />;
    }
    return <Outlet />;
}

export function RoleRoute({ allow }: { allow: Role[] }) {
    if (DISABLE_GUARDS) {
        return <Outlet />;
    }

    const { loading, isAuthenticated, user } = useAuth();
    const loc = useLocation();

    if (loading) return <div className="p-6">Cargando…</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const rawRole = (user?.role ?? user?.rol ?? user?.userRole) as string | undefined;
    const role: Role = rawRole ? mapRoleToEnglish(rawRole) : 'patient';

    if (!role || !allow.includes(role)) {
        if (role === "admin") {
            return <Navigate to="/adminPage" replace />;
        }
        if (role === "doctor") {
            return <Navigate to="/doctorPage" replace />;
        }
        if (role === "nurse") {
            return <Navigate to="/nursePage" replace />;
        }
        if (role === "patient") {
            return <Navigate to="/patientPage" replace />;
        }
        return (
            <Navigate
                to="/"
                replace
                state={{ from: loc.pathname, reason: "forbidden" }}
            />
        );
    }

    return <Outlet />;
}
