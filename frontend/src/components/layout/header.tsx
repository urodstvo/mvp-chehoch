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

import { NavLink } from 'react-router';

export const Header = () => {
    const { hasCookie } = useSession();

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
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                    <NavLink to='/'>Лента</NavLink>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <NavLink to='/organisations'>Организации</NavLink>
                                </NavigationMenuLink>
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
