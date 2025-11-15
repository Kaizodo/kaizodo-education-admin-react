
import { lazy, Suspense, useEffect, useState } from 'react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Modal } from '@/components/common/Modal';
import { LeadService } from '@/services/LeadService';
import LeadCard from './components/LeadCard';


import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Lead } from './LeadDetail';
import SideDrawer from '@/components/common/SideDrawer';
const LazyEditorDialog = lazy(() => import('./components/LeadEditorDialog'));



export default function LeadListing() {
    const { internal_reference_number } = useParams();
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false)
    const [leadNavigationState, setLeadNavigationState] = useState<{
        found?: boolean,
        current: string,
        next?: string,
        prev?: string
    }>({
        found: false,
        current: '',
        next: '',
        prev: ''
    })

    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<Lead>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });

    const setFilter = useSetValue(setFilters);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await LeadService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);

    const openEditor = async () => {
        const modal_id = Modal.show({
            title: 'Add New Lead',
            subtitle: 'Provide lead information to get started',
            maxWidth: 500,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDialog
                    onSuccess={(data) => {
                        search();
                        Modal.close(modal_id);
                        setOpenDrawer(true);
                        navigate('/lead-management/leads/' + data.internal_reference_number);
                    }}

                />
            </Suspense>
        });
    }


    useEffect(() => {
        if (!internal_reference_number) {
            setOpenDrawer(false);
        } else {
            var found = paginated.records.find(r => r.internal_reference_number === internal_reference_number);
            var prev: string | undefined = undefined;
            var next: string | undefined = undefined;
            if (found) {
                prev = paginated.records[paginated.records.indexOf(found) - 1]?.internal_reference_number;
                next = paginated.records[paginated.records.indexOf(found) + 1]?.internal_reference_number;
            }

            setLeadNavigationState(_ => ({
                found: !!found,
                current: internal_reference_number,
                prev: prev,
                next: next
            }))
            setOpenDrawer(true);
        }
    }, [internal_reference_number])


    useEffect(() => {
        if (paginated.records.length > 0 && !!internal_reference_number) {
            var found = paginated.records.find(r => r.internal_reference_number === internal_reference_number);
            var prev: string | undefined = undefined;
            var next: string | undefined = undefined;
            if (found) {
                prev = paginated.records[paginated.records.indexOf(found) - 1]?.internal_reference_number;
                next = paginated.records[paginated.records.indexOf(found) + 1]?.internal_reference_number;
            }

            setLeadNavigationState(_ => ({
                found: !!found,
                current: internal_reference_number,
                prev: prev,
                next: next
            }))
        }
    }, [paginated]);


    return (
        <AppPage
            title='Lead Management'
            subtitle='Manage all leads from one place'
            actions={<Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn>}
            containerClassName="md:pt-0"
        >

            {searching && <CenterLoading className='h-[400px] relative' />}
            <div className='grid grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6'>
                {!searching && paginated.records.map((record) => {
                    return <LeadCard lead={record} onClick={() => {
                        setOpenDrawer(true);
                    }} />
                })}
            </div>
            {!searching && paginated.records.length == 0 && <NoRecords />}
            <div className='p-3'>
                <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
            </div>
            <SideDrawer
                maxWidth='70%'
                position="right"
                open={openDrawer}
                onOpenChange={(c) => {
                    setOpenDrawer(c);
                    if (!c) {
                        navigate('/lead-management/leads')
                    }
                }}

            >
                {leadNavigationState.found && <div className='flex flex-row  fixed  ml-[-90px] top-[30px] bg-white z-50  rounded-full shadow-2xl overflow-hidden'>
                    <button disabled={!leadNavigationState.prev} className='text-3xl border-e px-1 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500' onClick={() => {
                        navigate(`/lead-management/leads/${leadNavigationState.prev}`);
                    }}><LuChevronLeft /></button>
                    <button disabled={!leadNavigationState.next} className='text-3xl px-1 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500' onClick={() => {
                        navigate(`/lead-management/leads/${leadNavigationState.next}`)
                    }}><LuChevronRight /></button>
                </div>}
                <Outlet />
            </SideDrawer>
        </AppPage>
    );
};

