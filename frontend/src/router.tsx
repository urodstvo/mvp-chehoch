import { createBrowserRouter } from 'react-router';
import { WithAuth } from '@/components/layout';
import { FeedPage, LoginPage, ProfileHistoryPage, ProfilePage, RegisterPage, SurveyViewerPage } from './pages';

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
                element: <FeedPage />,
            },
            {
                path: '/profile',
                children: [
                    {
                        index: true,
                        element: <ProfilePage />,
                    },
                    {
                        path: '/profile/history',
                        element: <ProfileHistoryPage />,
                    },
                ],
            },
            {
                path: '/organisations',
                children: [
                    {
                        path: '/organisations/:organisationId',
                    },
                ],
            },
            {
                path: '/survey/:surveyId',
                children: [
                    {
                        index: true,
                        element: <SurveyViewerPage />,
                    },
                    {
                        path: '/survey/:surveyId/report',
                    },
                    {
                        path: '/survey/:surveyId/edit',
                    },
                ],
            },
        ],
    },
]);
