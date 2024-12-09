import { PageLayout, PageMiddleColumn, PageRightColumn } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/use-page-title';
import { CalendarIcon, PencilIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import { format } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Tag } from '@/types';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export const ProfilePage = () => {
    usePageTitle('Профиль');

    const tags: Tag[] = [];
    return (
        <PageLayout>
            <PageMiddleColumn>
                <Tabs defaultValue='info'>
                    <div className='flex justify-between'>
                        <TabsList>
                            <NavLink to='/profile'>
                                <TabsTrigger value='info' type={undefined}>
                                    Информация о пользователе
                                </TabsTrigger>
                            </NavLink>
                            <NavLink to='/profile/history'>
                                <TabsTrigger value='history' type={undefined}>
                                    История опросов
                                </TabsTrigger>
                            </NavLink>
                        </TabsList>
                        <Button size='icon' className='rounded-full' variant='outline'>
                            <PencilIcon strokeWidth={1} />
                        </Button>
                    </div>
                    <TabsContent value='info' className='mt-[32px]'>
                        <ProfileForm />
                    </TabsContent>
                </Tabs>
            </PageMiddleColumn>
            <PageRightColumn className='flex justify-end'>
                <Card className='w-[300px] h-fit mt-[132px]'>
                    <CardHeader className='flex justify-between flex-row'>
                        <div className='flex flex-col flex-1 gap-2'>
                            <CardTitle className='w-fit font-normal'>Интересующие теги</CardTitle>
                            <CardDescription className='text-sm' style={{ lineHeight: '14px' }}>
                                Используются для рекомендации в ленте
                            </CardDescription>
                        </div>
                        <Button size='icon' className='rounded-full' variant='outline'>
                            <PencilIcon strokeWidth={1} />
                        </Button>
                    </CardHeader>
                    <CardContent className='mt-2'>
                        {tags.map((tag) => (
                            <Badge key={tag.id}>{tag.name}</Badge>
                        ))}
                    </CardContent>
                </Card>
            </PageRightColumn>
        </PageLayout>
    );
};

const formSchema = z.object({
    login: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    email: z.string().email(),
    profession: z.string().min(2),
    birdthDate: z.date(),
});

function ProfileForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: '',
            email: '',
            profession: '',
        },
    });

    const [disabled, setDisabled] = useState(true);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))} className='grid gap-4'>
                <FormField
                    control={form.control}
                    name='login'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={disabled} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Электронная почта</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={disabled} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='profession'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Профессия</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={disabled} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='birdthDate'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full'>
                            <FormLabel>Дата рождения</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild disabled={disabled}>
                                    <FormControl>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'w-full pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            {field.value ? format(field.value, 'PPP') : <span>Выберите дату</span>}
                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar
                                        mode='single'
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
