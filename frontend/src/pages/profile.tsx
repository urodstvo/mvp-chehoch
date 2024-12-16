/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { PageLayout, PageMiddleColumn, PageRightColumn } from '@/components/layout';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/use-page-title';
import { CalendarIcon, Check, ChevronsUpDown, PencilIcon, XIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import { format } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Profile, Tag, User } from '@/types';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

type isEditingFormContextProps = {
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
};
const isEditingFormContext = createContext<isEditingFormContextProps>({
    isEditing: false,
    setIsEditing: () => {},
});

const ProfilePageProvider = ({ children }: { children: React.ReactNode }) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <isEditingFormContext.Provider value={{ isEditing, setIsEditing }}>{children}</isEditingFormContext.Provider>
    );
};

const useIsEditingFormContext = () => useContext(isEditingFormContext);

export const ProfilePage = () => {
    usePageTitle('Профиль');

    return (
        <PageLayout>
            <ProfilePageProvider>
                <ProfilePageContent />
            </ProfilePageProvider>
            <ProfileTags />
        </PageLayout>
    );
};

function ProfileTags() {
    const queryClient = useQueryClient();
    const { data, isPending } = useQuery({
        queryKey: ['profile', 'tags'],
        queryFn: () => api.get<Tag[]>('/tag/user'),
    });

    const { mutate: addTags } = useMutation({
        mutationFn: (data: { tags: number[] }) => api.post('/tag/user', data),
        onSuccess: () => {
            toast('Изменения успешно внесены');
            queryClient.invalidateQueries({
                queryKey: ['profile', 'tags'],
                exact: true,
            });
        },
        onError: () => {
            toast.error('Произошла ошибка при внесении изменений');
        },
    });

    const { mutate: deleteTags } = useMutation({
        mutationFn: (data: { tags: number[] }) =>
            api.delete('/tag/user', {
                data,
            }),
        onSuccess: () => {
            toast('Изменения успешно внесены');
            queryClient.invalidateQueries({
                queryKey: ['profile', 'tags'],
                exact: true,
            });
        },
        onError: () => {
            toast.error('Произошла ошибка при внесении изменений');
        },
    });

    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        if (data) setTags(data.data);
    }, [data]);

    return (
        <PageRightColumn className='flex justify-end'>
            <Card className='w-[300px] h-fit mt-[100px]'>
                <CardHeader className='flex justify-between flex-row'>
                    <div className='flex flex-col flex-1 gap-2'>
                        <CardTitle className='w-fit font-normal'>Интересующие теги</CardTitle>
                        <CardDescription className='text-sm' style={{ lineHeight: '14px' }}>
                            Используются для рекомендации в ленте
                        </CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size='icon' className='rounded-full' variant='outline'>
                                <PencilIcon strokeWidth={1} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Редактирование профиля</DialogTitle>
                                <DialogDescription>Изменение тегов, участвующих в рекомендациях</DialogDescription>
                            </DialogHeader>
                            <TagsCombobox currentTags={tags} setCurrentTags={setTags} />
                            <div className='flex flex-wrap items-center gap-x-2'>
                                {isPending &&
                                    new Array(5)
                                        .fill(0)
                                        .map((_, ind) => <Skeleton key={ind} className={badgeVariants()} />)}
                                {!isPending &&
                                    tags.map((tag) => (
                                        <div className={cn(badgeVariants(), 'w-fit gap-2 items-center')} key={tag.id}>
                                            {tag.name}
                                            <Button
                                                size={null}
                                                variant={null}
                                                onClick={() => setTags((prev) => prev.filter((t) => t.id !== tag.id))}
                                                className='rounded-full'
                                            >
                                                <XIcon />
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                            {data && JSON.stringify(tags) !== JSON.stringify(data.data) && (
                                <Button
                                    onClick={() => {
                                        const deleted = data.data
                                            .filter((tag) => !tags.find((t) => t.id === tag.id))
                                            .map((el) => el.id);
                                        const added = tags
                                            .filter((tag) => !data.data.find((t) => t.id === tag.id))
                                            .map((el) => el.id);

                                        if (deleted.length > 0) deleteTags({ tags: deleted });
                                        if (added.length > 0) addTags({ tags: added });
                                    }}
                                >
                                    Сохранить
                                </Button>
                            )}
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className='mt-2'>
                    {data?.data.map((tag) => (
                        <Badge key={tag.id}>{tag.name}</Badge>
                    ))}
                </CardContent>
            </Card>
        </PageRightColumn>
    );
}

export function TagsCombobox({
    currentTags,
    setCurrentTags,
}: {
    currentTags: Tag[];
    setCurrentTags: Dispatch<SetStateAction<Tag[]>>;
}) {
    const [open, setOpen] = useState(false);
    const { data } = useQuery({
        queryKey: ['tags'],
        queryFn: () => api.get<Tag[]>('/tag/'),
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className='w-full'>
                <Button variant='outline' role='combobox' aria-expanded={open} className='justify-between'>
                    Добавить тег
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0' align='start' side='right'>
                <Command className='w-full'>
                    <CommandInput placeholder='Найдите тег...' />
                    <CommandList>
                        <CommandEmpty>Теги не найдены.</CommandEmpty>
                        <CommandGroup>
                            {data?.data.map((tag) => (
                                <CommandItem
                                    key={tag.id}
                                    value={tag.id.toString()}
                                    onSelect={(currentValue) => {
                                        setCurrentTags((prev) =>
                                            prev.some((v) => v.id === Number(currentValue))
                                                ? prev
                                                : [data.data.find((v) => v.id === Number(currentValue))!, ...prev]
                                        );
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            currentTags.some((v) => v.id === tag.id) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {tag.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

type Response = {
    user: User;
    profile: Profile;
};
function ProfilePageContent() {
    const { setIsEditing } = useIsEditingFormContext();
    const { data, isPending } = useQuery({
        queryKey: ['profile', 'info'],
        queryFn: () => api.get<Response>('/user/me'),
    });
    return (
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
                    <Button
                        size='icon'
                        className='rounded-full'
                        variant='outline'
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        <PencilIcon strokeWidth={1} />
                    </Button>
                </div>
                <TabsContent value='info' className='mt-[32px]'>
                    {data && !isPending && (
                        <ProfileForm
                            login={data.data.user.login}
                            email={data.data.user.email}
                            proffession={data.data.profile.profession}
                            birdthDate={data.data.profile.birth_date}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </PageMiddleColumn>
    );
}

const formSchema = z.object({
    login: z.string(),
    email: z.string().email(),
    proffession: z.string().nullable().optional(),
    birth_date: z.date().nullable().optional(),
});

function ProfileForm({
    login,
    email,
    proffession,
    birdthDate,
}: {
    login: string;
    email: string;
    proffession?: string;
    birdthDate?: Date;
}) {
    const { isEditing, setIsEditing } = useIsEditingFormContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login,
            email,
            proffession,
            birth_date: birdthDate,
        },
    });

    useEffect(() => {
        form.reset({
            birth_date: birdthDate ? new Date(birdthDate) : null, // Приводим к Date
            proffession,
            email,
            login,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: Partial<z.infer<typeof formSchema>>) => api.patch('/user/me', data),
        onSuccess: () => {
            toast('Данные успешено изменены');
            queryClient.resetQueries({
                queryKey: ['profile', 'info'],
                exact: true,
            });
            setIsEditing(false);
        },
        onError: () => {
            toast('Произошла ошибка при изменение профиля');
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    const changedData = Object.keys(form.formState.dirtyFields).reduce<
                        Partial<z.infer<typeof formSchema>>
                    >((acc, key) => {
                        if (key === 'birth_date' && data[key]) {
                            const date = new Date(data[key] as Date);
                            date.setHours(date.getHours() + 3); // Прибавляем 3 часа
                            acc[key] = date.toISOString(); // Отправляем в формате ISO
                        } else {
                            acc[key] = data[key];
                        }
                        return acc;
                    }, {});
                    mutate(changedData);
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
                                <Input {...field} disabled={!isEditing} />
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
                            <FormLabel>Электронная почта</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='proffession'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Профессия</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='birth_date'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full'>
                            <FormLabel>Дата рождения</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild disabled={!isEditing}>
                                    <FormControl>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'w-full pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            {field.value ? format(field.value, 'PPP') : <span>Дата рождения</span>}
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
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {form.formState.isDirty && <Button disabled={isPending}>Сохранить</Button>}
            </form>
        </Form>
    );
}
