import { createBrowserRouter } from 'react-router-dom';
import { NursePage } from '../pages/nurse-page';
import NotFoundPage from '../pages/not-found-page';
import Form from '../pages/login-page';
import App from '../App';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/NursePage',
        element: <NursePage />,
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
