import { PageLayout, PageLeftColumn, PageMiddleColumn } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/use-page-title';
import { cn } from '@/lib/utils';
import { Organisation } from '@/types';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { NavLink, Outlet, useParams } from 'react-router';

export const OrganisationsPage = () => {
    usePageTitle('Организации');
    const { organisationId } = useParams();

    const organisations: Organisation[] = [
        {
            id: 1,
            name: 'Организация 1',
            email: 'email 1',
            phone: 'phone 1',
            address: 'address 1',
            web_site: 'web_site 1',
            inn: 'inn 1',
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
            logo: null,
            logo_url: null,
        },
    ];
    return (
        <PageLayout>
            <PageLeftColumn>
                <div className='flex flex-col w-[300px] gap-4 mt-[68px]'>
                    {organisations.map((org) => (
                        <NavLink to={`/organisations/${org.id}`}>
                            <div
                                key={org.id}
                                className={cn('border rounded bg-[#F4F4F5] p-2 relative', {
                                    'bg-[#38BDF8] bg-opacity-20': organisationId && org.id === +organisationId,
                                })}
                            >
                                {org.logo_url && <img className='w-[64px] h-[48px]' src={org.logo_url} />}
                                <p className='text-sm'>{org.name}</p>
                                <span className='text-xs'>ИНН: {org.inn}</span>
                                <Button className='absolute top-2 right-2 rounded-full' size='icon' variant='outline'>
                                    <PencilIcon strokeWidth={1} />
                                </Button>
                            </div>
                        </NavLink>
                    ))}
                    <Button className='w-full h-[64px] border [&_svg]:size-[48px]' variant='secondary'>
                        <PlusIcon strokeWidth={1} color='#aaaaaa' />
                    </Button>
                </div>
            </PageLeftColumn>
            <PageMiddleColumn>
                {!organisationId && (
                    <h4 className='text-center text-muted-foreground'>Выберите организацию для просмотра опросов</h4>
                )}
                <Outlet />
            </PageMiddleColumn>
        </PageLayout>
    );
};
