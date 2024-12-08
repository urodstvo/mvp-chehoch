import { SurveyCard } from '@/components';
import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { Survey, Tag } from '@/types';

export const FeedPage = () => {
    return (
        <PageLayout>
            <PageMiddleColumn>
                <Feed />
            </PageMiddleColumn>
        </PageLayout>
    );
};

function Feed() {
    const surveys: {
        survey: Survey;
        tags: Tag[];
    }[] = [
        {
            survey: {
                id: 1,
                name: 'Survey 1',
                description: 'Description 1',
                questions_amount: 1,
                answers_amount: 1,
                created_by: 1,
                organisation_id: 1,
                t_created_at: new Date(),
                t_updated_at: new Date(),
                t_deleted: false,
            },
            tags: [],
        },
    ];
    return (
        <div>
            {surveys.map((survey) => (
                <SurveyCard key={survey.survey.id} survey={survey.survey} tags={survey.tags} />
            ))}
        </div>
    );
}
