import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { usePageTitle } from '@/hooks/use-page-title';

export const RegisterPage = () => {
    usePageTitle('Регистрация');

    return (
        <PageLayout>
            <PageMiddleColumn className='h-full flex pt-[80px] justify-center'>
                <div className='flex gap-4 flex-col h-fit'>
                    <h3
                        className='font-roboto h-[48px] text-center'
                        style={{
                            fontSize: '48px',
                            lineHeight: '48px',
                            fontWeight: 900,
                        }}
                    >
                        Регистрация
                    </h3>
                    <RegisterForm />
                </div>
            </PageMiddleColumn>
        </PageLayout>
    );
};

const formSchema = z
    .object({
        login: z.string({
            required_error: 'Логин обязателен',
        }),
        email: z
            .string({
                required_error: 'Электронная почта обязательна',
            })
            .email(),
        password: z
            .string({
                required_error: 'Пароль обязателен',
            })
            .min(6, 'Минимум 6 символов'),
        repeatPassword: z.string({
            required_error: 'Повторите пароль',
        }),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: 'Пароли не совпадают',
        path: ['repeatPassword'],
    });

function RegisterForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    return (
        <Card className='mx-auto max-w-sm'>
            <CardHeader>
                <CardDescription className='font-roboto'>
                    Введите вашу электронную почту, логин и пароль ниже для создания аккаунта
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            console.log(data);
                        })}
                        className='grid gap-4'
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Электронная почта</FormLabel>
                                    <FormControl>
                                        <Input id='email' type='email' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                    <FormDescription>Минимум 6 символов</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='repeatPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Повторите пароль</FormLabel>
                                    <FormControl>
                                        <Input id='repeatPassword' type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='w-full' disabled={!form.formState.isValid}>
                            Создать аккаунт
                        </Button>
                    </form>
                </Form>
                <div className='mt-4 text-sm flex justify-between'>
                    <span>Уже есть аккаунт?</span>
                    <Link to='/login' className='underline'>
                        Авторизация
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
