import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export const WithAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const sessionCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('session_id='));
        if (!sessionCookie) navigate('/login', { replace: true }); // Redirect to login page
    }, [navigate]);

    return <Outlet />;
};
