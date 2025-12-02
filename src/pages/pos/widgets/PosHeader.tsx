import posIcon from '@/assets/icons/pos.png';
import customersIcon from '@/assets/icons/clients.png';
import holdIcon from '@/assets/icons/hold-order.png';
import demandIcon from '@/assets/icons/demand.png';

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { NavLink } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa6';

type PosHeaderNavProps = {
    image: string,
    name: string,
    route: {
        to: string,
        options?: any
    },
    badge?: number
}
const PosHeaderNav = ({ image, name, badge = 0, route }: PosHeaderNavProps) => {
    return (
        <NavLink to={route.to}>
            {({ isActive }) => (
                <div className={`flex flex-col items-center text-center p-3 border-r ${isActive ? 'shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]' : ''}`}>
                    <img src={image} className="h-[30px]" />
                    <span className="text-sm font-bold">{name}</span>
                    {!!badge && <span>{badge}</span>}
                </div>
            )}
        </NavLink>
    );
};


export default function PosHeader() {
    const navs: PosHeaderNavProps[] = [
        { name: 'Sales Desk', image: posIcon, route: { to: '/app/pos' } },
        { name: 'Customers', image: customersIcon, route: { to: '/app/pos/customers' } },
        { name: 'Out of stock', image: demandIcon, route: { to: '/app/pos/demand' } },
        { name: 'Order on hold', image: holdIcon, route: { to: '/app/pos/orders-on-hold' } }
    ];
    return (
        <div className='bg-primary-foreground shadow-sm'>
            <div className='flex flex-row border-b'>
                <NavLink to={'/app'} className='min-w-[70px] flex flex-row items-center justify-center hover:bg-red-300 cursor-pointer hover:text-primary-foreground'>
                    <FaArrowLeft size={20} />
                </NavLink>
                <div className='flex flex-row items-center px-3 flex-1'>

                    <img src={posIcon} className='h-[60px]' />
                    <div className='flex flex-col'>
                        <span className='text-2xl font-bold'>Sales Desk</span>
                        <span className='text-sm'>Point of sale (POS), Billing and more</span>
                    </div>
                    <div className='flex flex-row border-s mx-auto'>
                        {navs.map((nav, index) => <PosHeaderNav key={'pos_nav_' + index} {...nav} />)}
                    </div>
                </div>
            </div>
            <div className='px-2 py-1'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Sales Desk</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    )
}
