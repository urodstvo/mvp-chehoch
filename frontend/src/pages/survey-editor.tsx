import { PageLayout, PageLeftColumn, PageMiddleColumn, PageRightColumn } from '@/components/layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { usePageTitle } from '@/hooks/use-page-title';
import { useNavigate, useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AnswerVariant, Question, QuestionType, Survey, Tag } from '@/types';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Check, ChevronsUpDown, PencilIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react';
import { DialogHeader } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export const SurveyEditorPage = () => {
    const { surveyId } = useParams();
    usePageTitle(`Редактирование опроса ${surveyId}`);

    const { data, isFetching, isError } = useQuery({
        queryKey: ['survey', surveyId],
        queryFn: () =>
            api.get<{
                survey: Survey;
                tags: Tag[];
            }>(`/survey/${surveyId}`),
        staleTime: 0,
    });

    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: (organisation_id: string) => api.delete(`/survey/${surveyId}`),
        onSuccess: (_, v) => {
            toast('Опрос успешно удален');
            queryClient.invalidateQueries({
                queryKey: ['survey', 'organisation', v],
                exact: true,
            });
            navigate(`/organisations/${v}`);
        },
    });

    useEffect(() => {
        if (isError) {
            navigate(-1);
            toast.error('Не удалось загрузить данные опроса');
        }
    }, [isError, navigate]);

    return (
        <PageLayout>
            <PageLeftColumn>
                <QuestionCreator />
            </PageLeftColumn>
            <PageMiddleColumn>
                {data && !isFetching && (
                    <>
                        <div className='flex justify-end'>
                            <Button
                                variant='secondary'
                                className='border'
                                onClick={() => mutate(data.data.survey.organisation_id.toString())}
                                disabled={isPending}
                            >
                                Удалить опрос
                            </Button>
                        </div>
                        <EditorForm name={data.data.survey.name} description={data.data.survey.description} />
                    </>
                )}
                {!data && isFetching && <div>Загрузка...</div>}
                <QuestionsList />
            </PageMiddleColumn>
            <SurveyTags />
        </PageLayout>
    );
};

function QuestionCreator() {
    const { surveyId } = useParams();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: (type: number) =>
            api.post(`/question`, {
                survey_id: surveyId,
                type,
            }),
        onSuccess: () => {
            toast('Вопрос успешно добавлен');
            queryClient.invalidateQueries({
                queryKey: ['survey', 'questions', surveyId],
                exact: true,
            });
        },
        onError: () => {
            toast.error('Ошибка при создании вопроса');
        },
    });
    return (
        <div className='flex justify-start mt-[320px]'>
            <Card className='w-[300px] h-fit'>
                <CardContent className='mt-2 pt-4'>
                    <div
                        role='button'
                        className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                        onClick={() => mutate(QuestionType.FREE_INPUT)}
                    >
                        Свободный ввод
                        <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                    </div>
                    <div
                        role='button'
                        className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                        onClick={() => mutate(QuestionType.ONE_QUESTION)}
                    >
                        Один вариант
                        <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                    </div>
                    <div
                        role='button'
                        className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                        onClick={() => mutate(QuestionType.MULTI_QUESTION)}
                    >
                        Несколько вариантов
                        <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                    </div>
                    <div
                        role='button'
                        className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                        onClick={() => mutate(QuestionType.SCALE)}
                    >
                        Шкала (от 1 до 5)
                        <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
});

function EditorForm({ name, description }: { name?: string; description?: string }) {
    const { surveyId } = useParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name, description },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: Partial<z.infer<typeof formSchema>>) => api.patch(`/survey/${surveyId}`, data),
        onSuccess: (_, v) => {
            toast('Данные изменены');
            form.reset({
                ...form.getValues(),
                ...v,
            });
        },
        onError: () => {
            toast.error('Произошла ошибка во время изменения данных опроса');
        },
    });
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    const changed = Object.keys(form.formState.dirtyFields).reduce((acc, key) => {
                        acc[key] = data[key];
                        return acc;
                    }, {} as Partial<z.infer<typeof formSchema>>);
                    mutate(changed);
                })}
                className='flex flex-col gap-4 mb-[32px]'
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название опроса</FormLabel>
                            <FormControl>
                                <Input placeholder='Название опроса' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание опроса</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Описание опроса' {...field} className='h-[80px]' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={!form.formState.isDirty || isPending}>Сохранить</Button>
            </form>
        </Form>
    );
}

function QuestionsList() {
    const { surveyId } = useParams();
    const { data, isPending } = useQuery({
        queryKey: ['survey', 'questions', surveyId],
        queryFn: () => api.get<Question[]>(`/question/${surveyId}`),
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: (question_id: number) => api.delete(`/question/${question_id}`),
        onSuccess: () => {
            toast('Вопрос успешно удален');
            queryClient.invalidateQueries({
                queryKey: ['survey', 'questions', surveyId],
                exact: true,
            });
        },
        onError: () => {
            toast.error('Ошибка при удалении вопроса');
        },
    });

    return (
        <div className='flex flex-col gap-4 py-4 border bg-[#F4F4F5] bg-opacity-50 rounded-[8px]'>
            <div className='flex justify-end gap-2 px-4'>
                <Button
                    variant='outline'
                    onClick={() => {
                        navigator.clipboard.writeText(`http://localhost:3000/survey/${surveyId}`);
                        toast('Ссылка скопирована в буфер обмена');
                    }}
                >
                    Поделиться
                </Button>
            </div>

            <div className='flex flex-col'>
                {isPending && <div className='px-4'>Загрузка...</div>}
                {data &&
                    !isPending &&
                    data.data
                        .sort((a, b) => new Date(a.t_created_at).getTime() - new Date(b.t_created_at).getTime())
                        .map((q, ind) => (
                            <div className='flex justify-between items-center px-4 h-10 border-b' key={q.id}>
                                <div className='flex items-center gap-[32px]'>
                                    <p className='max-w-[300px] text-ellipsis whitespace-nowrap overflow-hidden'>
                                        {ind + 1}. {q.content || 'Текст вопроса'}
                                    </p>
                                    <span className='text-xs text-muted-foreground'>
                                        {+q.type === QuestionType.FREE_INPUT && 'Свободный ввод'}
                                        {+q.type === QuestionType.ONE_QUESTION && 'Один вариант'}
                                        {+q.type === QuestionType.MULTI_QUESTION && 'Несколько вариантов'}
                                        {+q.type === QuestionType.SCALE && 'Шкала (от 1 до 5)'}
                                    </span>
                                </div>
                                <div>
                                    <UpdateQuestionDialog question_id={q.id} content={q.content} type={q.type} />
                                    <Button size='icon' variant='ghost' onClick={() => mutate(q.id)}>
                                        <TrashIcon strokeWidth={1} />
                                    </Button>
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
}

function SurveyTags() {
    const { surveyId } = useParams();
    const queryClient = useQueryClient();
    const { data, isPending } = useQuery({
        queryKey: ['survey', 'tags', surveyId],
        queryFn: () => api.get<Tag[]>(`/tag/survey/${surveyId}`),
    });

    const { mutate: addTags } = useMutation({
        mutationFn: (data: { tags: number[] }) => api.post(`/tag/survey/${surveyId}`, data),
        onSuccess: () => {
            toast('Изменения успешно внесены');
            queryClient.invalidateQueries({
                queryKey: ['survey', 'tags', surveyId],
                exact: true,
            });
        },
        onError: () => {
            toast.error('Произошла ошибка при внесении изменений');
        },
    });

    const { mutate: deleteTags } = useMutation({
        mutationFn: (data: { tags: number[] }) =>
            api.delete(`/tag/survey/${surveyId}`, {
                data,
            }),
        onSuccess: () => {
            toast('Изменения успешно внесены');
            queryClient.invalidateQueries({
                queryKey: ['survey', 'tags', surveyId],
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
            <Card className='w-[300px] h-fit'>
                <CardHeader className='flex justify-between flex-row'>
                    <div className='flex flex-col flex-1 gap-2'>
                        <CardTitle className='w-fit font-normal'>Теги</CardTitle>
                        <CardDescription className='text-sm' style={{ lineHeight: '14px' }}>
                            Используются для выдачи в рекомендациях в ленте
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
                <CardContent className='mt-2 flex flex-wrap gap-2'>
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

const UpdateQuestionSchema = z.object({
    content: z.string({
        required_error: 'Текст вопроса обязателен',
    }),
    type: z.string(),
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

function UpdateQuestionDialog({ question_id, content, type }: { question_id: number; content: string; type: string }) {
    const [questionType, setQuestionType] = useState(type);
    const { data } = useQuery({
        queryKey: ['question', 'answer_variant', question_id],
        queryFn: () => api.get<AnswerVariant[]>(`/answer-variant/${question_id}`),
    });

    const [input, setInput] = useState<string>('');
    const queryClient = useQueryClient();

    const { mutate: add } = useMutation({
        mutationFn: (content: string) => api.post('/answer-variant', { content, question_id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['question', 'answer_variant', question_id],
            });
            setInput('');
        },
        onError: () => {
            toast.error('Произошла ошибка при создании варианта ответа');
        },
    });

    const { mutate: deleteVariant } = useMutation({
        mutationFn: (id: number) => api.delete(`/answer-variant/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['question', 'answer_variant', question_id],
            });
        },
        onError: () => {
            toast.error('Произошла ошибка при удалении варианта ответа');
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='icon' variant='ghost'>
                    <PencilIcon strokeWidth={1} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактирование вопроса</DialogTitle>
                </DialogHeader>
                <UpdateQuestionForm
                    question_id={question_id}
                    content={content}
                    type={type}
                    setQuestionType={setQuestionType}
                />
                {(questionType === '0' || questionType === '1') && (
                    <div className='w-full border rounded p-2 flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='variant-input'>Текст варианта ответа</Label>
                            <div className='w-full flex gap-2 items-center'>
                                <Input
                                    type='text'
                                    id='variant-input'
                                    className='flex-1'
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                />
                                <Button size='icon' variant='default' onClick={() => input !== '' && add(input)}>
                                    <PlusIcon strokeWidth={2} />
                                </Button>
                            </div>
                        </div>
                        {data?.data.map((variant) => (
                            <div key={variant.id} className='flex items-center justify-between border-b'>
                                <p>{variant.content}</p>
                                <Button size='icon' variant='ghost' onClick={() => deleteVariant(variant.id)}>
                                    <TrashIcon strokeWidth={2} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
function UpdateQuestionForm({
    question_id,
    content,
    type,
    setQuestionType,
}: {
    question_id: number;
    content: string;
    type: string;
    setQuestionType: React.Dispatch<React.SetStateAction<string>>;
}) {
    const { surveyId } = useParams();
    const form = useForm<z.infer<typeof UpdateQuestionSchema>>({
        resolver: zodResolver(UpdateQuestionSchema),
        mode: 'onChange',
        defaultValues: { content, type },
    });

    const questionType = form.watch('type');
    useEffect(() => {
        setQuestionType(questionType);
    }, [questionType, setQuestionType]);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (data: FormData) =>
            api.patch(`/question/${question_id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        onSuccess: (_, v) => {
            const obj: Partial<z.infer<typeof UpdateQuestionSchema>> = {};
            v.forEach((value, key) => {
                obj[key] = value;
            });

            toast('Вопрос успешно изменен');
            form.reset({
                ...form.getValues(),
                ...obj,
            });
            queryClient.invalidateQueries({
                queryKey: ['survey', 'questions', surveyId],
            });
        },
        onError: () => {
            toast.error('Произошла ошибка при изменении вопроса');
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    const changedData = Object.keys(form.formState.dirtyFields).reduce<
                        Partial<z.infer<typeof UpdateQuestionSchema>>
                    >((acc, key) => {
                        // @ts-expect-error any
                        acc[key] = data[key];
                        return acc;
                    }, {});
                    const formdata = new FormData();
                    if (changedData.content !== undefined) formdata.append('content', changedData.content);
                    if (changedData.image !== undefined) formdata.append('image', changedData.image);
                    if (changedData.type !== undefined) formdata.append('type', changedData.type);

                    mutate(formdata);
                })}
                className='grid gap-4'
            >
                <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Текст вопроса</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тип вопроса</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value || '0'}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a verified email to display' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='0'>Один вариант</SelectItem>
                                        <SelectItem value='1'>Несколько вариантов</SelectItem>
                                        <SelectItem value='2'>Свободный ввод</SelectItem>
                                        <SelectItem value='3'>Шкала (от 1 до 5)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='image'
                    render={({ field: { value, onChange, ...props } }) => (
                        <FormItem>
                            <FormLabel>Изображение вопроса</FormLabel>
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
                {form.formState.isDirty && <Button type='submit'>Сохранить</Button>}
            </form>
        </Form>
    );
}
