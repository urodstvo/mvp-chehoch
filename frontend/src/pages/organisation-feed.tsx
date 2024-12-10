import { usePageTitle } from '@/hooks/use-page-title';
import { useParams } from 'react-router';

import { Survey, Tag } from '@/types';
import { OrganisationSurveyCard } from '@/components';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';

export const OrganisationFeedPage = () => {
    const { organisationId } = useParams();
    usePageTitle(`Опросы организации ${organisationId}`);

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['survey', 'organisation', organisationId],
        queryFn: () =>
            api.get<
                {
                    survey: Survey;
                    tags: Tag[];
                }[]
            >(`/survey/organisation/${organisationId}`),
    });
    const { mutate } = useMutation({
        mutationFn: () => api.post('/survey', { organisation_id: organisationId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['survey', 'organisation', organisationId],
                exact: true,
            });
        },
    });

    return (
        <>
            <div className='flex justify-end w-full mb-[32px]'>
                <Button onClick={() => mutate()}>Создать опрос</Button>
            </div>
            <div className='flex flex-col gap-4'>
                {data &&
                    data.data.map((survey) => (
                        <OrganisationSurveyCard key={survey.survey.id} survey={survey.survey} tags={survey.tags} />
                    ))}
                {!data ||
                    (data.data.length === 0 && (
                        <h4 className='text-center text-muted-foreground'>Опросы не найдены</h4>
                    ))}
            </div>
        </>
    );
};
