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

export const OrganisationsPage = () => {
    usePageTitle('Организации');
    const { organisationId } = useParams();

    const organisations: Organisation[] = [
        {
            id: 1,
            name: 'Организация 1',
            email: 'email 1',
            phone: 'phone 1',
            address: 'address 1',
            web_site: 'web_site 1',
            inn: 'inn 1',
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
            logo: null,
            logo_url: null,
        },
    ];
    return (
        <PageLayout>
            <PageLeftColumn>
                <div className='flex flex-col w-[300px] gap-4 mt-[68px]'>
                    {organisations.map((org) => (
                        <div className='relative'>
                            <NavLink to={`/organisations/${org.id}`} key={org.id}>
                                <div
                                    key={org.id}
                                    className={cn('border rounded bg-[#F4F4F5] p-2 ', {
                                        'bg-[#38BDF8] bg-opacity-20': organisationId && org.id === +organisationId,
                                    })}
                                >
                                    {org.logo_url && <img className='w-[64px] h-[48px]' src={org.logo_url} />}
                                    <p className='text-sm'>{org.name}</p>
                                    <span className='text-xs'>ИНН: {org.inn}</span>
                                </div>
                            </NavLink>
                            <UpdateOrganisationDialog />
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

function UpdateOrganisationDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className='absolute top-2 right-2 rounded-full z-[1]'
                    size='icon'
                    variant='outline'
                    // onClick={(e) => e.stopPropagation()}
                >
                    <PencilIcon strokeWidth={1} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изменение организации</DialogTitle>
                    <DialogDescription>Введите новые данные организации</DialogDescription>
                </DialogHeader>
                <OrganisationForm name='' email='' phone='' inn='' />
            </DialogContent>
        </Dialog>
    );
}

function CreateOrganisationDialog() {
    return (
        <Dialog>
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
                <OrganisationForm name='' />
            </DialogContent>
        </Dialog>
    );
}

const formSchema = z.object({
    name: z.string({
        required_error: 'Имя обязательно',
    }),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    inn: z.string().optional(),
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
                  .optional(),
});

function OrganisationForm({
    name,
    phone,
    email,
    inn,
    onSubmit = () => {},
}: Omit<z.infer<typeof formSchema>, 'image'> & { onSubmit?: () => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: { name, phone, email, inn },
    });
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((d) => {
                    onSubmit();
                    console.log(d);
                })}
                className='space-y-8'
            >
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
                <Button type='submit' disabled={!form.formState.isValid}>
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
