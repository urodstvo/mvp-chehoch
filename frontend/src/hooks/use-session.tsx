import { useEffect, useState } from 'react';

export const useSession = () => {
    const [hasCookie, setHasCookie] = useState<boolean>(false);
    const [cookie, setCookie] = useState<string | null>(null);

    useEffect(() => {
        const sessionCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('session_id='));
        if (sessionCookie) {
            setHasCookie(true);
            setCookie(sessionCookie.split('=')[1]);
        }
    }, []);

    return { hasCookie, cookie };
};
