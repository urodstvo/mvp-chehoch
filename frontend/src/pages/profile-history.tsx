import { api } from '@/api';
import { SurveyCard } from '@/components';
import { PageLayout, PageMiddleColumn, PageRightColumn } from '@/components/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/use-page-title';
import { Survey, Tag } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router';

export const ProfileHistoryPage = () => {
    usePageTitle(`История опросов`);

    const { data } = useQuery({
        queryKey: ['profile', 'history'],
        queryFn: () =>
            api.get<
                {
                    survey: Survey;
                    tags: Tag[];
                }[]
            >('/survey/completed'),
    });
    return (
        <PageLayout>
            <PageMiddleColumn>
                <Tabs defaultValue='history'>
                    <TabsList>
                        <NavLink to='/profile'>
                            <TabsTrigger value='info' type={undefined}>
                                Информация о пользователе
                            </TabsTrigger>
                        </NavLink>
                        <NavLink to='/profile/history'>
                            <TabsTrigger value='history' type={undefined}>
                                История опросов
                            </TabsTrigger>
                        </NavLink>
                    </TabsList>
                    <TabsContent value='history' className='mt-[32px]'>
                        {data && data.data.map((d) => <SurveyCard key={d.survey.id} survey={d.survey} tags={d.tags} />)}
                        {!data || (data.data.length === 0 && <p>История опросов пуста</p>)}
                    </TabsContent>
                </Tabs>
            </PageMiddleColumn>
            <PageRightColumn></PageRightColumn>
        </PageLayout>
    );
};
