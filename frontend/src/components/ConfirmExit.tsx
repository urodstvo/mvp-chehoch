import { useEffect } from 'react';
import { useBlocker } from 'react-router';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ConfirmExit({ action, when }: { action: () => void; when: boolean }) {
    const blocker = useBlocker(when);

    useEffect(() => {
        if (when) window.onbeforeunload = () => '';

        return () => {
            window.onbeforeunload = null;
        };
    }, [when]);

    return (
        <AlertDialog open={blocker.state === 'blocked'}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены, что хотите выйти?</AlertDialogTitle>
                    <AlertDialogDescription>Это действие приведет к потере сохранённых ответов</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => blocker.state === 'blocked' && blocker.reset()}>
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (blocker.state === 'blocked') {
                                action();
                                blocker.proceed();
                            }
                        }}
                    >
                        Подтвердить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
