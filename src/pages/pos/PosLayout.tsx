import { useState, useEffect } from 'react';
import { User, FileText, Users, Clock, Save, } from 'lucide-react';
import { LuArrowLeft, LuLoader, LuStore } from 'react-icons/lu';
import CenterLoading from '@/components/common/CenterLoading';

import { useForm } from '@/hooks/use-form';

import moment from 'moment';

import NoRecords from '@/components/common/NoRecords';
import Btn from '@/components/common/Btn';

import { useGlobalContext } from '@/hooks/use-global-context';

import { PiCashRegister } from 'react-icons/pi';
import SessionManager from './components/SessionManager';
import { PosService } from '@/services/PosService';
import SuggestStore from '@/components/common/suggest/SuggestStore';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Storage } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { MdAddTask, MdOutlineInventory } from 'react-icons/md';
import { Organization } from '@/data/Organization';



export default function PosLayout() {
    const { context, setContext } = useGlobalContext();
    const [form, setValue] = useForm<any>({
        loaded: false,
        country_id: undefined,
        invoice_date: moment().format('Y-MM-DD'),
        due_date: moment().format('Y-MM-DD'),
        user_id: undefined,
        products: []
    });
    const [stats, setStats] = useState({
        last_internal_reference_number: '',
        total_draft: 0,
        total_invoices: 0,
        total_proforma: 0,
        total_customers: 0,
        total_job_cards: 0,
        total_demands: 0,
        stock_alerts: 0
    })

    const [statsLoading, setStatsLoading] = useState(false);
    const [loading, setLoading] = useState(false);


    const loadStats = async (mainLoading = true) => {
        if (mainLoading) {
            setLoading(true);
        }
        setStatsLoading(true);
        var r = await PosService.dashboard({ organization_id: form.organization_id });
        if (r.success) {
            setStats(r.data);
        }
        setLoading(false);
        setStatsLoading(false);
    }



    useEffect(() => {
        if (form.organization_id) {
            Storage.set('organization_id', form.organization_id);
            loadStats();
        }
    }, [form.organization_id])


    useEffect(() => {
        (async () => {
            var organization_id = await Storage.get('organization_id');
            if (organization_id) {
                setValue('organization_id')(organization_id);
            }
        })()
    }, [])



    if (!context.pos_session) {
        return <SessionManager />
    }

    return (
        <div className="h-screen bg-gray-50 font-sans flex flex-col">
            <header className="bg-indigo-700 text-white shadow-xl sticky top-0 z-20">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

                    <div className="flex items-center space-x-3 min-w-fit text-primary">
                        <Link to={'/'}>
                            <Btn variant={'outline'} size={'sm'}><LuArrowLeft /></Btn>
                        </Link>
                        <SuggestStore children='' value={form.organization_id} onChange={setValue('organization_id')} onSelect={(o: Organization) => setContext(c => ({ ...c, organization: o }))} />
                    </div>

                    <nav className="flex-1 flex justify-center h-full">
                        {[
                            { route: '/pos', icon: PiCashRegister, label: `Billing`, count: null, color: 'text-yellow-300' },
                            { route: '/pos/drafts', icon: Save, label: 'Drafts', count: stats.total_draft, color: 'text-blue-300' },
                            { route: '/pos/invoices', icon: FileText, label: 'Invoices', count: stats.total_invoices, color: 'text-green-300' },
                            { route: '/pos/proforma-invoices', icon: FileText, label: 'Proforma', count: stats.total_proforma, color: 'text-green-300' },
                            { route: '/pos/job-cards', icon: MdAddTask, label: 'Job Cards', count: stats.total_job_cards, color: 'text-green-300' },
                            { route: '/pos/customers', icon: Users, label: 'Customers', count: null, color: 'text-pink-300' },
                            { route: '/pos/purchase', icon: MdOutlineInventory, label: `Purchase`, count: stats.stock_alerts, color: 'text-green-300' },
                            { route: '/pos/session', icon: Clock, label: "Today's Closing", count: null, color: 'text-red-300' },

                        ].map(item => (<NavLink
                            to={item.route}
                            end={item.route === '/pos'}
                            className={({ isActive }) => cn(
                                isActive && "flex items-center space-x-2 text-sm md:text-base font-semibold px-4 transition-all h-full bg-indigo-800 border-b-4 border-yellow-400 text-white",
                                !isActive && "flex items-center space-x-2 text-sm md:text-base font-semibold px-4 transition-all h-full text-indigo-200 hover:bg-indigo-600 hover:text-white"
                            )}
                            style={{ minWidth: '130px' }}
                        >
                            <item.icon size={20} className={item.color} />
                            <span className="hidden sm:inline">{item.label}</span>
                            {statsLoading && <LuLoader className='text-xs animate-spin' />}
                            {!statsLoading && item.count !== null && (
                                <span className="bg-white/20 px-2 rounded-full text-xs font-bold">
                                    {item.count}
                                </span>
                            )}

                        </NavLink>))}
                    </nav>

                    <div className="flex items-center space-x-3 min-w-fit text-sm">
                        <User size={20} className="text-white" />
                        <div className='flex flex-col max-w-[150px]'>
                            <span>{context.user.first_name} {context.user.last_name}</span>
                            <span className='text-xs text-ellipsis whitespace-nowrap overflow-hidden'>{context.user.email}</span>
                        </div>
                    </div>
                </div>
            </header>

            {!!form.organization_id && !loading && <div className="w-full flex-1">
                <Outlet context={{ organization_id: form.organization_id, loadStats }} />
            </div>}
            {!form.organization_id && <NoRecords icon={LuStore} title='Select a store' subtitle='To continue billing please select a store' action={<SuggestStore children='' value={form.organization_id} onChange={setValue('organization_id')} />} />}
            {!!form.organization_id && loading && <CenterLoading className="relative h-screen" />}
        </div>
    );
};
