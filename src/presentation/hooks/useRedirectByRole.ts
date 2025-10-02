import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../../core/utils/decodeToken';

export const useRedirectByRole = () => {
    const navigate = useNavigate();

    const redirectByRole = (token: string) => {
        const payload = decodeToken(token);
        switch (payload.role) {
            case "ADMINISTRADOR":
                navigate("/adminPage");
                break;
            case "PACIENTE":
                navigate("/patientPage");
                break;
            case "MEDICO":
                navigate("/doctorPage");
                break;
            case "ENFERMERO":
                navigate("/nursePage");
                break;
            default:
                navigate("/dashboard");
                break;
        }
    };

    return redirectByRole;
};
