import { PageLayout, PageLeftColumn, PageMiddleColumn } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePageTitle } from '@/hooks/use-page-title';
import { cn } from '@/lib/utils';
import { Organisation } from '@/types';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { NavLink, Outlet, useParams } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { toast } from 'sonner';
import { useState } from 'react';

export const OrganisationsPage = () => {
    usePageTitle('Организации');
    const { organisationId } = useParams();

    const { data } = useQuery({
        queryKey: ['organisations'],
        queryFn: () => api.get<Organisation[]>('/organisation'),
    });

    return (
        <PageLayout>
            <PageLeftColumn>
                <div className='flex flex-col w-[300px] gap-4 mt-[68px]'>
                    {data &&
                        data.data.map((org) => (
                            <div className='relative'>
                                <NavLink to={`/organisations/${org.id}`} key={org.id}>
                                    <div
                                        key={org.id}
                                        className={cn('border rounded bg-[#F4F4F5] p-2 flex gap-4', {
                                            'bg-[#38BDF8] bg-opacity-20': organisationId && org.id === +organisationId,
                                        })}
                                    >
                                        {org.logo_url && <img className='w-[64px] h-[48px]' src={org.logo_url} />}
                                        <div className='flex flex-col'>
                                            <p className='text-sm'>{org.name}</p>
                                            <span className='text-xs text-muted-foreground'>
                                                {org.inn ? `ИНН: ${org.inn}` : 'Незаполнена'}
                                            </span>
                                        </div>
                                    </div>
                                </NavLink>
                                <UpdateOrganisationDialog organisation={org} />
                            </div>
                        ))}
                    <CreateOrganisationDialog />
                </div>
            </PageLeftColumn>
            <PageMiddleColumn>
                {!organisationId && (
                    <h4 className='text-center text-muted-foreground'>Выберите организацию для просмотра опросов</h4>
                )}
                <Outlet />
            </PageMiddleColumn>
        </PageLayout>
    );
};

function UpdateOrganisationDialog({ organisation }: { organisation: Organisation }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: (data: FormData) => api.patch(`/organisation/${organisation.id}`, data),
        onSuccess: () => {
            toast('Организация изменена');
            queryClient.invalidateQueries({
                queryKey: ['organisations'],
                exact: true,
            });
            setOpen(false);
        },
        onError: () => {
            toast.error('Произошла ошибка при изменении организации');
        },
    });

    const handleSubmit = (
        data: Partial<z.infer<typeof formSchema>>,
        dirtyFields: Partial<
            Readonly<{
                name?: boolean | undefined;
                phone?: boolean | undefined;
                email?: boolean | undefined;
                inn?: boolean | undefined;
                image?: any;
            }>
        >
    ) => {
        const changedData = Object.keys(dirtyFields).reduce<Partial<z.infer<typeof formSchema>>>((acc, key) => {
            acc[key] = data[key];
            return acc;
        }, {});

        const formData = new FormData();

        // Добавляем каждое поле из data в FormData
        if (changedData.name) formData.append('name', changedData.name);
        if (changedData.phone) formData.append('phone', changedData.phone);
        if (changedData.email) formData.append('email', changedData.email);
        if (changedData.inn) formData.append('inn', changedData.inn);
        if (changedData.image) formData.append('image', changedData.image);
        mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='absolute top-2 right-2 rounded-full z-[1]' size='icon' variant='outline'>
                    <PencilIcon strokeWidth={1} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изменение организации</DialogTitle>
                    <DialogDescription>Введите новые данные организации</DialogDescription>
                </DialogHeader>
                <OrganisationForm
                    name={organisation.name}
                    email={organisation.email || ''}
                    phone={organisation.phone || ''}
                    inn={organisation.inn || ''}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}

function CreateOrganisationDialog() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: (data: FormData) =>
            api.post('/organisation', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        onSuccess: () => {
            toast('Организация добавлена');
            queryClient.invalidateQueries({
                queryKey: ['organisations'],
                exact: true,
            });

            setOpen(false);
        },
        onError: () => {
            toast.error('Произошла ошибка при добавлении организации');
        },
    });

    const handleSubmit = (data: Partial<z.infer<typeof formSchema>>) => {
        const formData = new FormData();

        // Добавляем каждое поле из data в FormData
        formData.append('name', data.name!);
        if (data.phone) formData.append('phone', data.phone);
        if (data.email) formData.append('email', data.email);
        if (data.inn) formData.append('inn', data.inn);
        if (data.image) formData.append('image', data.image);
        mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='w-full h-[64px] border [&_svg]:size-[48px]' variant='secondary'>
                    <PlusIcon strokeWidth={1} color='#aaaaaa' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Создание новой организации</DialogTitle>
                    <DialogDescription>Введите данные организации</DialogDescription>
                </DialogHeader>
                <OrganisationForm name='' onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
    );
}

const formSchema = z.object({
    name: z.string({
        required_error: 'Имя обязательно',
    }),
    phone: z.string().nullable().optional(),
    email: z.string().email().nullable().optional().or(z.literal(null)),
    inn: z.string().nullable().optional(),
    image:
        typeof window === 'undefined'
            ? z.any()
            : z
                  .instanceof(File)
                  .refine((file) => file?.size <= 5_000_000, `Максимальный размер файла 5Мб`)
                  .refine(
                      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file?.type),
                      '.jpg, .jpeg, .png and .webp форматы поддерживаются.'
                  )
                  .nullable()
                  .optional(),
});

function OrganisationForm({
    name = '',
    phone,
    email,
    inn,
    onSubmit = () => {},
}: Omit<z.infer<typeof formSchema>, 'image'> & {
    onSubmit?: (
        data: Partial<z.infer<typeof formSchema>>,
        dirtyFields: Partial<
            Readonly<{
                name?: boolean | undefined;
                phone?: boolean | undefined;
                email?: boolean | undefined;
                inn?: boolean | undefined;
                image?: any;
            }>
        >
    ) => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: { name, phone, email: email !== '' ? email : undefined, inn },
    });
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => onSubmit(d, form.formState.dirtyFields))} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название организации*</FormLabel>
                            <FormControl>
                                <Input placeholder='ООО "7Б"' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Телефон организации</FormLabel>
                            <FormControl>
                                <Input placeholder='7xxxxxxxxxx' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Электронная почта организации</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='inn'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ИНН организации</FormLabel>
                            <FormControl>
                                <Input placeholder='XXXXXXXXXX' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='image'
                    render={({ field: { value, onChange, ...props } }) => (
                        <FormItem>
                            <FormLabel>Логотип организации</FormLabel>
                            <FormControl>
                                <Input
                                    {...props}
                                    type='file'
                                    accept='image/jpeg,image/jpg,image/png,image/webp'
                                    onChange={(e) => onChange(e.target.files && e.target.files[0])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={!form.formState.isDirty || !form.formState.isValid}>
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
