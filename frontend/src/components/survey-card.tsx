import { Survey, Tag } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Link } from 'react-router';

export const SurveyCard = ({ survey, tags }: { survey: Survey; tags: Tag[] }) => {
    return (
        <Card className='w-[600px]'>
            <CardHeader>
                <CardTitle>{survey.name}</CardTitle>
                <CardDescription>{survey.description}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                {tags.length > 0 && (
                    <div>
                        {tags.map((t) => (
                            <Badge key={t.id}>{t.name}</Badge>
                        ))}
                    </div>
                )}
                <div>
                    <div>
                        <div className='flex justify-between'>
                            <span>Количество вопросов:</span>
                            <span>{survey.questions_amount}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Количество прошедших:</span>
                            <span>{survey.answers_amount}</span>
                        </div>
                    </div>
                </div>
                <Button asChild>
                    <Link to={`/survey/${survey.id}`}>Пройти опрос</Link>
                </Button>
            </CardContent>
        </Card>
    );
};

export const OrganisationSurveyCard = ({ survey, tags }: { survey: Survey; tags: Tag[] }) => {
    return (
        <Card className='w-[600px]'>
            <CardHeader>
                <CardTitle>{survey.name}</CardTitle>
                <CardDescription>{survey.description}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                {tags.length > 0 && (
                    <div>
                        {tags.map((t) => (
                            <Badge key={t.id}>{t.name}</Badge>
                        ))}
                    </div>
                )}
                <div>
                    <div>
                        <div className='flex justify-between'>
                            <span>Количество вопросов:</span>
                            <span>{survey.questions_amount}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Количество прошедших:</span>
                            <span>{survey.answers_amount}</span>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-10'>
                    <Button asChild variant='secondary'>
                        <Link to={`/survey/${survey.id}/report`}>Отчет</Link>
                    </Button>
                    <Button asChild>
                        <Link to={`/survey/${survey.id}/edit`}>Редактировать</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
