import { api } from '@/api';
import { SurveyCard } from '@/components';
import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/use-page-title';
import { Survey, Tag } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const FeedPage = () => {
    usePageTitle('Лента опросов');
    return (
        <PageLayout>
            <PageMiddleColumn>
                <Feed />
            </PageMiddleColumn>
        </PageLayout>
    );
};

type Response = {
    survey: Survey;
    tags: Tag[];
}[];

function Feed() {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['surveys-feed'],
        queryFn: () => api.get<Response>('/survey/feed'),
    });

    return (
        <div>
            {data?.data.map((survey) => (
                <SurveyCard key={survey.survey.id} survey={survey.survey} tags={survey.tags} />
            ))}
            {!data && !isError && !isFetching && 'Не найдено опросов для Вас'}
            {isError && (
                <div className='flex flex-col items-center'>
                    <h6>Произошла ошибка при загрузке ленты</h6>
                    <Button onClick={() => refetch()}>Попробовать еще раз</Button>
                </div>
            )}
            {isFetching && 'Загрузка...'}
        </div>
    );
}
