
import { lazy, Suspense, useEffect, useState } from 'react';
import CustomTabs from './components/alt-design/CustomTabs';
import { Storage } from '@/lib/storage';
import CenterLoading from '@/components/common/CenterLoading';
import { UserOrderService } from '@/services/UserOrderService';


const LazyOrdersTab = lazy(() => import('./components/tabs/OrdersTab'));
const LazyShipmentsTab = lazy(() => import('./components/tabs/ShipmentsTab'));
const LazyOrderIssueTab = lazy(() => import('./components/tabs/OrderIssueTab'));



export default function Orders() {
    const [tab, setTab] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [tabSynced, setTabSynked] = useState(false);
    const [stats, setStats] = useState({
        all: 0,
        new: 0,
        payment_pending: 0,
        processing: 0,
        ready: 0,
        returns: 0,
        replacements: 0,
        nextday: 0,
        cancellations: 0,
        delivered: 0
    });

    const navs = [
        { id: 'all', label: 'All', count: stats.all },
        { id: 'new', label: "New Orders", count: stats.new },
        { id: 'payment', label: 'Payment required', count: stats.payment_pending },
        { id: 'processing', label: 'Processing', count: stats.processing },
        { id: 'ready', label: 'Ready to ship', count: stats.ready },
        { id: 'returns', label: "Returns", count: stats.returns },
        { id: 'replacements', label: "Replacements", count: stats.replacements },
        { id: 'cancellations', label: "Cancellations", count: stats.cancellations },
        { id: 'delivered', label: "Delivered", count: stats.delivered },
    ];


    const load = async () => {
        var r = await UserOrderService.stats();
        if (r.success) {
            setStats(r.data);
        }
    }


    useEffect(() => {
        (async () => {
            var synkedTab = await Storage.get<string>('orders_tab');
            console.log(synkedTab);
            if (synkedTab && navs.find(t => t.id == synkedTab)) {
                setTab(synkedTab);
            }
            setTimeout(() => {
                setTabSynked(true);
            }, 50)
        })()

        load();

        const id = setInterval(load, 5000);

        return () => clearInterval(id);
    }, [])


    if (!tabSynced) {
        return <CenterLoading className='relative h-full' />
    }

    return (<CustomTabs
        loading={false}
        activeTab={tab}
        navs={navs}
        onCreateBtnClick={() => { }}
        onTabSelect={t => {
            setTab(t);
            Storage.set('orders_tab', t);
        }} filtersToggle={setShowFilters}    >
        {['all', 'new', 'payment'].includes(tab) && <Suspense fallback={<CenterLoading className="h-screen relative" />}><LazyOrdersTab tab={tab} showFilters={showFilters} /></Suspense>}
        {['processing', 'ready', 'delivered', 'nextday'].includes(tab) && <Suspense fallback={<CenterLoading className="h-screen relative" />}><LazyShipmentsTab tab={tab} showFilters={showFilters} /></Suspense>}
        {['returns', 'replacements', 'cancellations'].includes(tab) && <Suspense fallback={<CenterLoading className="h-screen relative" />}><LazyOrderIssueTab tab={tab} showFilters={showFilters} /></Suspense>}
    </CustomTabs>);
};

