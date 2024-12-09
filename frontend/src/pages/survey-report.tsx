import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePageTitle } from '@/hooks/use-page-title';
import { SurveyReport } from '@/types';
import { useParams } from 'react-router';

export const SurveyReportPage = () => {
    const { surveyId } = useParams();

    usePageTitle(`Отчет по опросу ${surveyId}`);

    const report: SurveyReport = {
        survey: {
            id: 1,
            name: 'Название опроса',
            description: 'test',
            questions_amount: 1,
            answers_amount: 1,
            created_by: 1,
            organisation_id: 1,
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
        },
        questions: [
            {
                question: {
                    id: 1,
                    content: 'test',
                    type: 1,
                    answers_amount: 1,
                    survey_id: 1,
                    t_created_at: new Date(),
                    t_updated_at: new Date(),
                    t_deleted: false,
                    image: null,
                    image_url: null,
                },
                answers: [
                    {
                        id: 1,
                        answer_variant_id: 1,
                        t_created_at: new Date(),
                        t_updated_at: new Date(),
                        t_deleted: false,
                        question_id: 1,
                        content: 'test',
                    },
                ],
                answer_variants: [
                    {
                        id: 1,
                        content: 'test',
                        t_created_at: new Date(),
                        t_updated_at: new Date(),
                        t_deleted: false,
                        question_id: 1,
                    },
                    {
                        id: 2,
                        content: 'test test',
                        t_created_at: new Date(),
                        t_updated_at: new Date(),
                        t_deleted: false,
                        question_id: 1,
                    },
                ],
            },
        ],
    };

    return (
        <PageLayout>
            <PageMiddleColumn>
                <div className='rounded-lg bg-slate-50 p-2 border'>
                    <p className='text-end text-muted-foreground text-sm'>Отчет по опросу {surveyId}</p>
                    <p className='mt-2'>{report.survey.name}</p>
                </div>
                <div className='mt-4 rounded-lg bg-slate-50 p-2 text-sm border'>
                    <p>Количество вопросов: {report.survey.questions_amount}</p>
                    <p>Количество ответов: {report.survey.answers_amount}</p>
                </div>
                {report.questions.map((q) => (
                    <Card className='mt-4 rounded-lg bg-slate-50 p-2 text-sm'>
                        <CardHeader>
                            <CardTitle>{q.question.content}</CardTitle>
                            <CardDescription>Вопрос {q.question.id}</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-4'>
                            {q.answer_variants.map((av) => {
                                const percent =
                                    (q.answers.filter((a) => a.answer_variant_id === av.id).length / q.answers.length) *
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
                        </CardContent>
                    </Card>
                ))}
            </PageMiddleColumn>
        </PageLayout>
    );
};
