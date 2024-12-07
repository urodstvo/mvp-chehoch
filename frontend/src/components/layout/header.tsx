import { useSession } from '@/hooks/use-session';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';

import { Link, NavLink } from 'react-router';

export const Header = () => {
    const { hasCookie } = useSession();
    const organisations = [
        {
            id: 1,
            name: 'Организация 1',
        },
        {
            id: 2,
            name: 'Организация 2',
        },
    ];

    const user = {
        id: 1,
        login: 'urodstvo',
    };

    if (hasCookie)
        return (
            <header className='grid grid-cols-[1fr_auto_1fr] mt-[10px] mb-[32px] px-10'>
                <div>
                    <NavigationMenu className='w-full'>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavLink to='/' className='font-roboto'>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Лента
                                    </NavigationMenuLink>
                                </NavLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Организации</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className='grid gap-2 p-4 w-[210px]'>
                                        {organisations.map((organisation) => (
                                            <NavigationMenuLink asChild key={organisation.id}>
                                                <Link
                                                    to={`/organisations/${organisation.id}`}
                                                    className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                                >
                                                    {organisation.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className='w-full p-2 lg:w-[600px]'>
                    <NavLink
                        to='/'
                        className='font-oi flex justify-center'
                        style={{
                            fontSize: '2rem',
                            lineHeight: '2rem',
                            color: '#38BDF8',
                        }}
                    >
                        ЧЕХОЧ
                    </NavLink>
                </div>
                <div className='flex justify-end'>
                    <Menubar className='w-fit'>
                        <MenubarMenu>
                            <MenubarTrigger className='shadow-none'>{user.login}</MenubarTrigger>
                            <MenubarContent side='bottom' align='end'>
                                <NavLink to={`/profile`}>
                                    <MenubarItem>Профиль</MenubarItem>
                                </NavLink>
                                <MenubarSeparator />
                                <MenubarItem>Выйти из аккаунта</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </header>
        );

    return (
        <header className='grid mt-[10px] mb-[32px]'>
            <span
                className='text-center w-full p-2 font-oi'
                style={{
                    fontSize: '2rem',
                    lineHeight: '2rem',
                    color: '#38BDF8',
                }}
            >
                ЧЕХОЧ
            </span>
        </header>
    );
};
