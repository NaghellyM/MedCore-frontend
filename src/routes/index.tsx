import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from '../pages/not-found-page';
import Form from '../pages/login-page';
import App from '../App';
import { NurseDashboard } from '../pages/NurseDashboard';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
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
