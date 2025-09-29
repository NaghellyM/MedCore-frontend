import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from '../pages/notFoundPage';
import Form from '../pages/loginPage';
import App from '../App';
import { NurseDashboard } from '../pages/NurseDashboard';
import { DoctorDashboard } from '../pages/doctorDashboard';


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
        path: '/login',
        element: <Form />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    }
]);

export default router;
