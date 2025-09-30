import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from '../pages/notFoundPage';
import Form from '../pages/loginPage';
import App from '../App';
import { NurseDashboard } from '../pages/nurseDashboard';
import { DoctorDashboard } from '../pages/doctorDashboard';
import { AdminDashboard } from '../pages/adminDashboard';   
import { PatientDashboard } from '../pages/patientDashboard';


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
    }
]);

export default router;
