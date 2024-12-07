import { createBrowserRouter } from 'react-router';
import { WithAuth, PageLayout } from '@/components/layout';
import { LoginPage, RegisterPage } from './pages';

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
