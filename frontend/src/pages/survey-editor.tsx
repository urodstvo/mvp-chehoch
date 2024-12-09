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
import { Question, QuestionType, Tag } from '@/types';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';

export const SurveyEditorPage = () => {
    const { surveyId } = useParams();
    usePageTitle(`Редактирование опроса ${surveyId}`);

    const tags: Tag[] = [];

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
            <PageRightColumn>
                <div className='flex justify-end'>
                    <Card className='w-[300px] h-fit'>
                        <CardHeader className='flex justify-between flex-row'>
                            <div className='flex flex-col flex-1 gap-2'>
                                <CardTitle className='w-fit font-normal'>Теги</CardTitle>
                                <CardDescription className='text-sm' style={{ lineHeight: '14px' }}>
                                    Используются для выдачи в рекомендациях в ленте
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
                </div>
            </PageRightColumn>
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
                    <div className='flex justify-between items-center px-4 h-10 border-b'>
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
                            <Button size='icon' variant='ghost'>
                                <PencilIcon strokeWidth={1} />
                            </Button>
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
