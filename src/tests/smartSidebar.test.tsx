import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SmartSidebar } from '../presentation/components/globals/sidebar/SmartSidebar';
import { useUserRole } from '../core/hooks/auth/useUserRole';

// Mock del hook useUserRole
vi.mock('../core/hooks/auth/useUserRole');

// Mock de los componentes de sidebar
vi.mock('../presentation/pages/admin/components/adminSidebar', () => ({
    AdminSidebar: () => <div data-testid="admin-sidebar">Admin Sidebar</div>
}));

vi.mock('../presentation/pages/doctor/components/doctorSideBar', () => ({
    default: () => <div data-testid="doctor-sidebar">Doctor Sidebar</div>
}));

vi.mock('../presentation/pages/nurse/components/nurseSidebar', () => ({
    NurseSidebar: () => <div data-testid="nurse-sidebar">Nurse Sidebar</div>
}));

vi.mock('../presentation/pages/patient/components/patientSidebar', () => ({
    PatientSidebar: () => <div data-testid="patient-sidebar">Patient Sidebar</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('SmartSidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders admin sidebar for admin role', () => {
        vi.mocked(useUserRole).mockReturnValue({
            role: 'admin',
            rawRole: 'ADMINISTRADOR',
            isAuthenticated: true,
            loading: false,
            user: { role: 'ADMINISTRADOR' },
            isAdmin: true,
            isDoctor: false,
            isNurse: false,
            isPatient: false,
        });

        renderWithRouter(<SmartSidebar />);
        
        expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    });

    it('renders doctor sidebar for doctor role', () => {
        vi.mocked(useUserRole).mockReturnValue({
            role: 'doctor',
            rawRole: 'MEDICO',
            isAuthenticated: true,
            loading: false,
            user: { role: 'MEDICO' },
            isAdmin: false,
            isDoctor: true,
            isNurse: false,
            isPatient: false,
        });

        renderWithRouter(<SmartSidebar />);
        
        expect(screen.getByTestId('doctor-sidebar')).toBeInTheDocument();
    });

    it('renders nurse sidebar for nurse role', () => {
        vi.mocked(useUserRole).mockReturnValue({
            role: 'nurse',
            rawRole: 'ENFERMERO',
            isAuthenticated: true,
            loading: false,
            user: { role: 'ENFERMERO' },
            isAdmin: false,
            isDoctor: false,
            isNurse: true,
            isPatient: false,
        });

        renderWithRouter(<SmartSidebar />);
        
        expect(screen.getByTestId('nurse-sidebar')).toBeInTheDocument();
    });

    it('renders patient sidebar for patient role', () => {
        vi.mocked(useUserRole).mockReturnValue({
            role: 'patient',
            rawRole: 'PACIENTE',
            isAuthenticated: true,
            loading: false,
            user: { role: 'PACIENTE' },
            isAdmin: false,
            isDoctor: false,
            isNurse: false,
            isPatient: true,
        });

        renderWithRouter(<SmartSidebar />);
        
        expect(screen.getByTestId('patient-sidebar')).toBeInTheDocument();
    });

    it('renders patient sidebar as fallback for unknown role', () => {
        vi.mocked(useUserRole).mockReturnValue({
            role: 'patient', // normalizeRole devuelve 'patient' para roles desconocidos
            rawRole: 'UNKNOWN_ROLE',
            isAuthenticated: true,
            loading: false,
            user: { role: 'UNKNOWN_ROLE' },
            isAdmin: false,
            isDoctor: false,
            isNurse: false,
            isPatient: true,
        });

        renderWithRouter(<SmartSidebar />);
        
        expect(screen.getByTestId('patient-sidebar')).toBeInTheDocument();
    });

    it('renders loading state when loading', () => {
        vi.mocked(useUserRole).mockReturnValue({
            role: 'patient',
            rawRole: null,
            isAuthenticated: false,
            loading: true,
            user: null,
            isAdmin: false,
            isDoctor: false,
            isNurse: false,
            isPatient: false,
        });

        renderWithRouter(<SmartSidebar />);
        
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('renders nothing when not authenticated', () => {
        vi.mocked(useUserRole).mockReturnValue({
            role: 'patient',
            rawRole: null,
            isAuthenticated: false,
            loading: false,
            user: null,
            isAdmin: false,
            isDoctor: false,
            isNurse: false,
            isPatient: false,
        });

        const { container } = renderWithRouter(<SmartSidebar />);
        
        expect(container.firstChild).toBeNull();
    });
});