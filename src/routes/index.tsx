import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from '../pages/notFoundPage';
import Form from '../pages/loginPage';
import App from '../App';
import { NurseDashboard } from '../pages/nurseDashboard';
import { DoctorDashboard } from '../pages/doctorDashboard';
import { AdminDashboard } from '../pages/adminDashboard';   
import { PatientDashboard } from '../pages/patientDashboard';
import { AdminRegisterUser } from '../components/admin/page/admiRegisterUser';
import { AdminRegisterCSV } from '../components/admin/page/admiRegisterCSV';


const router = createBrowserRouter([
    {
        path: '/',
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
        path: '*',
        element: <NotFoundPage />,
    },
    {
        path: '/admin/registerUser',
        element: <AdminRegisterUser />,
    },
    {
        path: '/admin/registerCSV',
        element: <AdminRegisterCSV />,
    }
]);

export default router;
