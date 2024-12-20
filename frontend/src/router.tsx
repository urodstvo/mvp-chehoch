import { createBrowserRouter } from 'react-router';
import { WithAuth } from '@/components/layout';
import {
    FeedPage,
    LoginPage,
    OrganisationFeedPage,
    OrganisationsPage,
    ProfileHistoryPage,
    ProfilePage,
    RegisterPage,
    SurveyEditorPage,
    SurveyReportPage,
    SurveyViewerPage,
} from '@/pages';

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
                element: <OrganisationsPage />,
                children: [
                    {
                        path: '/organisations/:organisationId',
                        element: <OrganisationFeedPage />,
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
                        element: <SurveyReportPage />,
                    },
                    {
                        path: '/survey/:surveyId/edit',
                        element: <SurveyEditorPage />,
                    },
                ],
            },
        ],
    },
]);
