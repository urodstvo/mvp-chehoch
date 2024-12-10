import { PageLayout, PageLeftColumn, PageMiddleColumn, PageRightColumn } from '@/components/layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { usePageTitle } from '@/hooks/use-page-title';
import { useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AnswerVariant, Question, QuestionType, Tag } from '@/types';
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

export const SurveyEditorPage = () => {
    const { surveyId } = useParams();
    usePageTitle(`Редактирование опроса ${surveyId}`);

    return (
        <PageLayout>
            <PageLeftColumn>
                <div className='flex justify-start mt-[320px]'>
                    <Card className='w-[300px] h-fit'>
                        {/* <CardHeader className='flex justify-between flex-row'></CardHeader> */}
                        <CardContent className='mt-2 pt-4'>
                            <div
                                role='button'
                                className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                            >
                                Свободный ввод
                                <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                            </div>
                            <div
                                role='button'
                                className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                            >
                                Один вариант
                                <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                            </div>
                            <div
                                role='button'
                                className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                            >
                                Несколько вариантов
                                <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                            </div>
                            <div
                                role='button'
                                className='px-2 py-1 hover:bg-[#E4E4E7] hover:bg-opacity-50 group flex justify-between items-center rounded'
                            >
                                Шкала (от 1 до 5)
                                <PlusIcon strokeWidth={1} className='hidden group-hover:block' size={16} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageLeftColumn>
            <PageMiddleColumn>
                <div className='flex justify-end'>
                    <Button variant='secondary' className='border'>
                        Удалить опрос
                    </Button>
                </div>
                <EditorForm />
                <QuestionsList />
            </PageMiddleColumn>
            <SurveyTags />
        </PageLayout>
    );
};

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
});

function EditorForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))} className='flex flex-col gap-4 mb-[32px]'>
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
                <Button disabled>Сохранить</Button>
            </form>
        </Form>
    );
}

function QuestionsList() {
    const questions: Question[] = [
        {
            id: 1,
            content: 'Вопрос 1',
            type: 0,
            answers_amount: 0,
            survey_id: 1,
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
            image: null,
            image_url: null,
        },
    ];
    return (
        <div className='flex flex-col gap-4 py-4 border bg-[#F4F4F5] bg-opacity-50 rounded-[8px]'>
            <div className='flex justify-end gap-2 px-4'>
                <Button variant='outline'>Поделиться</Button>
            </div>

            <div className='flex flex-col'>
                {questions.map((q) => (
                    <div className='flex justify-between items-center px-4 h-10 border-b' key={q.id}>
                        <div className='flex items-center gap-[32px]'>
                            <p className='max-w-[300px] text-ellipsis whitespace-nowrap overflow-hidden'>
                                {q.id}. {q.content}
                            </p>
                            <span className='text-xs text-muted-foreground'>
                                {q.type === QuestionType.FREE_INPUT && 'Свободный ввод'}
                                {q.type === QuestionType.ONE_QUESTION && 'Один вариант'}
                                {q.type === QuestionType.MULTI_QUESTION && 'Несколько вариантов'}
                                {q.type === QuestionType.SCALE && 'Шкала (от 1 до 5)'}
                            </span>
                        </div>
                        <div>
                            <UpdateQuestionDialog question_id={q.id} content='' type='0' />
                            <Button size='icon' variant='ghost'>
                                <TrashIcon strokeWidth={1} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const date = new Date();

function SurveyTags() {
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
    const answer_variant: AnswerVariant[] = [
        {
            id: 1,
            content: 'Вариант 1',
            question_id: question_id,
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
        {
            id: 2,
            content: 'Вариант 2',
            question_id: question_id,
            t_created_at: date,
            t_updated_at: date,
            t_deleted: false,
        },
    ];

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
                                <Input type='text' id='variant-input' className='flex-1' />
                                <Button size='icon' variant='default'>
                                    <PlusIcon strokeWidth={2} />
                                </Button>
                            </div>
                        </div>
                        {answer_variant.map((variant) => (
                            <div key={variant.id} className='flex items-center justify-between border-b'>
                                <p>{variant.content}</p>
                                <Button size='icon' variant='ghost'>
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
    const form = useForm<z.infer<typeof UpdateQuestionSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: { content, type },
    });

    const questionType = form.watch('type');
    useEffect(() => {
        setQuestionType(questionType);
    }, [questionType]);

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
                {form.formState.isDirty && <Button>Сохранить</Button>}
            </form>
        </Form>
    );
}
