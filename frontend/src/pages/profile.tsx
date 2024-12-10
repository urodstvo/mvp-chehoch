import { PageLayout, PageMiddleColumn, PageRightColumn } from '@/components/layout';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
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
import { Tag } from '@/types';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

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

const date = new Date();

function ProfileTags() {
    const [tags, setTags] = useState<Tag[]>([
        {
            id: 1,
            name: 'React',
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
    ]);

    const data = {
        tags: [
            {
                id: 1,
                name: 'React',
                t_created_at: date,
                t_updated_at: date,
                t_deleted: false,
            },
        ],
    };
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
                                {tags.map((tag) => (
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
                            {JSON.stringify(tags) !== JSON.stringify(data.tags) && (
                                <Button
                                    onClick={() => {
                                        const deleted = data.tags.filter((tag) => !tags.find((t) => t.id === tag.id));
                                        const added = tags.filter((tag) => !data.tags.find((t) => t.id === tag.id));
                                        console.log('@tags modal deleted:', deleted);
                                        console.log('@tags modal added:', added);
                                    }}
                                >
                                    Сохранить
                                </Button>
                            )}
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className='mt-2'>
                    {data.tags.map((tag) => (
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

    const tags: Tag[] = [
        {
            id: 1,
            name: 'React',
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
        {
            id: 2,
            name: 'Vue',
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
        {
            id: 3,
            name: 'Angular',
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
        {
            id: 4,
            name: 'Svelte',
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
        {
            id: 5,
            name: 'Next.js',
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
    ];

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
                            {tags.map((tag) => (
                                <CommandItem
                                    key={tag.id}
                                    value={tag.id.toString()}
                                    onSelect={(currentValue) => {
                                        setCurrentTags((prev) =>
                                            prev.some((v) => v.id === Number(currentValue))
                                                ? prev
                                                : [tags.find((v) => v.id === Number(currentValue))!, ...prev]
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

function ProfilePageContent() {
    const { setIsEditing } = useIsEditingFormContext();
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
                    <ProfileForm
                        login='login'
                        email='email@test.com'
                        profession='profession'
                        birdthDate={new Date(Date.parse('2003-01-09'))}
                    />
                </TabsContent>
            </Tabs>
        </PageMiddleColumn>
    );
}

const formSchema = z.object({
    login: z.string(),
    email: z.string().email(),
    profession: z.string().min(2),
    birdthDate: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
});

function ProfileForm({
    login,
    email,
    profession,
    birdthDate,
}: {
    login: string;
    email: string;
    profession: string;
    birdthDate: Date;
}) {
    const { isEditing } = useIsEditingFormContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login,
            email,
            profession,
            birdthDate,
        },
    });

    useEffect(() => {
        form.resetField('birdthDate');
        form.resetField('profession');
        form.resetField('email');
        form.resetField('login');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    const changedData = Object.keys(form.formState.dirtyFields).reduce<
                        Partial<z.infer<typeof formSchema>>
                    >((acc, key) => {
                        // @ts-expect-error any
                        acc[key] = data[key];
                        return acc;
                    }, {});
                    console.log(changedData);
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
                                <Input {...field} disabled={!isEditing} />
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
                                <PopoverTrigger asChild disabled={!isEditing}>
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
                {form.formState.isDirty && <Button>Сохранить</Button>}
            </form>
        </Form>
    );
}
