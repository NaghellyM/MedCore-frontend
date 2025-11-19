import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../../auth/decodeToken';

export const useRedirectByRole = () => {
    const navigate = useNavigate();

    const redirectByRole = (token: string) => {
        const payload = decodeToken(token);
        const role = payload.role.toUpperCase();
        
        switch (role) {
            case "ADMINISTRADOR":
            case "ADMIN":
                navigate("/adminPage");
                break;
            case "PACIENTE":
            case "PATIENT":
                navigate("/patientPage");
                break;
            case "MEDICO":
            case "DOCTOR":
                navigate("/doctorPage");
                break;
            case "ENFERMERO":
            case "NURSE":
                navigate("/nursePage");
                break;
            default:
                console.warn("Unknown role:", role);
                navigate("/dashboard");
                break;
        }
    };

    return redirectByRole;
};
