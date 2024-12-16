import { api } from '@/api';
import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePageTitle } from '@/hooks/use-page-title';
import { QuestionType, SurveyReport } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';

export const SurveyReportPage = () => {
    const { surveyId } = useParams();

    usePageTitle(`Отчет по опросу ${surveyId}`);

    const { data } = useQuery({
        queryKey: ['report'],
        staleTime: 0,
        queryFn: () => api.get<SurveyReport>(`/survey/${surveyId}/report`),
        select: (data) => {
            const questions = data.data.questions.sort(
                (a, b) => new Date(a.question.t_created_at).getTime() - new Date(b.question.t_created_at).getTime()
            );

            return {
                survey: data.data.survey,
                questions,
            };
        },
    });

    if (!data) return null;

    return (
        <PageLayout>
            <PageMiddleColumn>
                <div className='rounded-lg bg-slate-50 p-4 border'>
                    <p className='text-end text-muted-foreground text-sm'>Отчет по опросу {surveyId}</p>
                    <p className='mt-2'>{data.survey.name}</p>
                </div>
                <div className='mt-4 rounded-lg bg-slate-50 p-4 text-sm border'>
                    <p>Количество вопросов: {data.survey.questions_amount}</p>
                    <p>Количество ответов: {data.survey.answers_amount}</p>
                </div>
                {data.questions.map((q) => (
                    <Card className='mt-4 rounded-lg bg-slate-50 p-2 text-sm last-of-type:mb-[32px]'>
                        <CardHeader>
                            <CardTitle>{q.question.content ? q.question.content : 'Без текста вопроса'}</CardTitle>
                            <CardDescription className='flex items-center justify-between'>
                                <div>Вопрос {q.question.id}</div>
                                <span>
                                    {+q.question.type === QuestionType.FREE_INPUT && 'Свободный ввод'}
                                    {+q.question.type === QuestionType.ONE_QUESTION && 'Один вариант'}
                                    {+q.question.type === QuestionType.MULTI_QUESTION && 'Несколько вариантов'}
                                    {+q.question.type === QuestionType.SCALE && 'Шкала (от 1 до 5)'}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-4'>
                            {(+q.question.type === QuestionType.ONE_QUESTION ||
                                +q.question.type === QuestionType.MULTI_QUESTION) &&
                                q.answer_variants.map((av) => {
                                    const percent =
                                        (q.answers.filter((a) => a.answer_variant_id === av.id).length /
                                            q.answers.length) *
                                            100 || undefined;
                                    return (
                                        <div className='flex flex-col whitespace-nowrap'>
                                            <span>{av.content}</span>
                                            <div className='flex items-center gap-4'>
                                                <Progress value={percent} key={av.id} />
                                                <span className='whitespace-nowrap w-[64px]'>
                                                    {!!percent && `${percent.toFixed(2)}%`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            {+q.question.type === QuestionType.SCALE &&
                                new Array(5).fill(0).map((_, ind) => {
                                    const percent =
                                        (q.answers.filter((a) => +a.content === ind + 1).length / q.answers.length) *
                                            100 || undefined;
                                    return (
                                        <div className='flex flex-col whitespace-nowrap'>
                                            <span>{ind + 1}</span>
                                            <div className='flex items-center gap-4'>
                                                <Progress value={percent} key={ind} />
                                                <span className='whitespace-nowrap w-[64px]'>
                                                    {!!percent && `${percent.toFixed(2)}%`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            {+q.question.type === QuestionType.FREE_INPUT && (
                                <Collapsible className='w-full'>
                                    <CollapsibleTrigger className='flex items-center w-full gap-2 transition hover:bg-[#000] hover:bg-opacity-5 rounded px-2 text-lg'>
                                        <ChevronsUpDown size={16} strokeWidth={1} />
                                        Ответов: {q.answers.filter((el) => el.question_id === q.question.id).length}
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className='flex flex-col gap-4 mt-[24px]'>
                                            {q.answers
                                                .filter((el) => el.question_id === q.question.id)
                                                .map((el) => (
                                                    <div className='w-full text-sm border-b px-4'>{el.content}</div>
                                                ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </PageMiddleColumn>
        </PageLayout>
    );
};
