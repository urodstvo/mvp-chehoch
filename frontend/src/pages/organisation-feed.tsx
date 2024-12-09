import { usePageTitle } from '@/hooks/use-page-title';
import { useParams } from 'react-router';

import { Survey, Tag } from '@/types';
import { OrganisationSurveyCard } from '@/components';
import { Button } from '@/components/ui/button';

export const OrganisationFeedPage = () => {
    const { organisationId } = useParams();
    usePageTitle(`Опросы организации ${organisationId}`);
    const surveys: {
        survey: Survey;
        tags: Tag[];
    }[] = [
        {
            survey: {
                id: 1,
                name: 'Опрос организации',
                description: 'Описание опроса',
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
        <>
            <div className='flex justify-end w-full mb-[32px]'>
                <Button>Создать опрос</Button>
            </div>
            <div>
                {surveys.map((survey) => (
                    <OrganisationSurveyCard key={survey.survey.id} survey={survey.survey} tags={survey.tags} />
                ))}
                {surveys.length === 0 && <h4 className='text-center text-muted-foreground'>Опросы не найдены</h4>}
            </div>
        </>
    );
};
