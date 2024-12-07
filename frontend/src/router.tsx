import { createBrowserRouter } from 'react-router';
import { WithAuth, PageLayout } from '@/components/layout';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/',
        element: <WithAuth />,
        children: [
            {
                index: true,
                element: <PageLayout></PageLayout>,
            },
        ],
    },
]);
