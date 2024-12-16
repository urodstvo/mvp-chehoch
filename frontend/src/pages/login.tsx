import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { usePageTitle } from '@/hooks/use-page-title';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';

import { toast } from 'sonner';

export const LoginPage = () => {
    usePageTitle('Авторизация');

    return (
        <PageLayout>
            <PageMiddleColumn className='h-full flex pt-[160px] justify-center'>
                <div className='flex gap-4 flex-col h-fit'>
                    <h3
                        className='font-roboto h-[48px] text-center'
                        style={{
                            fontSize: '48px',
                            lineHeight: '48px',
                            fontWeight: 900,
                        }}
                    >
                        Авторизация
                    </h3>
                    <LoginForm />
                </div>
            </PageMiddleColumn>
        </PageLayout>
    );
};

const formSchema = z.object({
    login: z.string().optional(),
    password: z.string().optional(),
});

function LoginForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) =>
            api.post<z.infer<typeof formSchema>>('/auth/login', data, {
                headers: {
                    'Aplication-Type': 'application/json',
                },
            }),
        onSuccess: () => {
            toast('Вы успешно вошли в аккаунт');
            navigate('/');
            queryClient.removeQueries();
        },
        onError: () => {
            toast.error('Неправильный логин или пароль');
        },
    });

    return (
        <Card className='mx-auto max-w-sm'>
            <CardHeader>
                <CardDescription className='font-roboto'>
                    Введите ваш логин и пароль ниже для входа в аккаунт
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            mutate(data);
                        })}
                        className='grid gap-4'
                    >
                        <FormField
                            control={form.control}
                            name='login'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Логин</FormLabel>
                                    <FormControl>
                                        <Input id='login' type='text' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input id='password' type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='w-full' disabled={!form.formState.isValid || isPending}>
                            Войти
                        </Button>
                    </form>
                </Form>
                <div className='mt-4 text-sm flex justify-between'>
                    <span>Нет аккаунта?</span>
                    <Link to='/register' className='underline'>
                        Регистрация
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
