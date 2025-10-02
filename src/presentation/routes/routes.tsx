import App from '../../App';
import Form from '../pages/login/loginDashboard';
import NotFoundPage from '../pages/notFoundPage';
import RootLayout from '../layouts/RootLayout';
import { createBrowserRouter } from 'react-router-dom';
import { AdminDashboard } from '../pages/admin/adminDashboard';
import { NurseDashboard } from '../pages/nurse/nurseDashboard';
import { DoctorDashboard } from '../pages/doctor/doctorDashboard';
import { PatientDashboard } from '../pages/patient/patientDashboard';
import { AdminRegisterCSV } from '../pages/admin/pages/admiRegisterCSV';
import { AdminRegisterUser } from '../pages/admin/pages/admiRegisterUser';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <App />,
            },
            {
                path: '/doctorPage',
                element: <DoctorDashboard />,
            },
            {
                path: '/nursePage',
                element: <NurseDashboard />,
            },
            {
                path: '/adminPage',
                element: <AdminDashboard />,
            },
            {
                path: '/patientPage',
                element: <PatientDashboard />,
            },
            {
                path: '/login',
                element: <Form />,
            },
            {
                path: '/admin/registerUser',
                element: <AdminRegisterUser />,
            },
            {
                path: '/admin/registerCSV',
                element: <AdminRegisterCSV />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            }
        ]
    }
]);

export default router;
