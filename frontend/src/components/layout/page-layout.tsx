import { cn } from '@/lib/utils';
import { Header } from './header';

type LayoutProps = {
    children?: React.ReactNode;
    className?: string;
};

export const PageLayout = ({ children, className }: LayoutProps) => {
    return (
        <div className={cn('page-layout font-roboto', className)}>
            <Header />
            <div className='page-columns'>{children}</div>
        </div>
    );
};

export const PageLeftColumn = ({ children, className }: LayoutProps) => {
    return (
        <div className={cn('pl-10', className)} style={{ gridArea: 'left' }}>
            {children}
        </div>
    );
};

export const PageMiddleColumn = ({ children, className }: LayoutProps) => {
    return (
        <div className={cn('lg:w-[600px]', className)} style={{ gridArea: 'main' }}>
            {children}
        </div>
    );
};

export const PageRightColumn = ({ children, className }: LayoutProps) => {
    return (
        <div className={cn('pr-10', className)} style={{ gridArea: 'right' }}>
            {children}
        </div>
    );
};
