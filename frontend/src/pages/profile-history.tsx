import { SurveyCard } from '@/components';
import { PageLayout, PageMiddleColumn, PageRightColumn } from '@/components/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/use-page-title';
import { NavLink } from 'react-router';

export const ProfileHistoryPage = () => {
    usePageTitle(`История опросов`);

    const surveys = [];
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
                        {surveys.length > 0 &&
                            surveys.map((survey) => (
                                <SurveyCard key={survey.id} survey={survey.survey} tags={survey.tags} />
                            ))}
                        {surveys.length === 0 && <p>История опросов пуста</p>}
                    </TabsContent>
                </Tabs>
            </PageMiddleColumn>
            <PageRightColumn></PageRightColumn>
        </PageLayout>
    );
};
