
import { lazy, Suspense, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import AppCard from '@/components/app/AppCard';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Modal } from '@/components/common/Modal';
import { TopupPlanService } from '@/services/TopupPlanService';
import { Search } from '@/components/ui/search';
import { getTopupTypeName } from '@/data/Subscription';

const LazyEditorDialog = lazy(() => import('./components/TopupPlanEditorDialog'));

export default function SubscriptionTopups() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
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
        var r = await TopupPlanService.search(filters);
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

    const openEditor = async (id?: number) => {
        const modal_id = Modal.show({
            title: !id ? 'Add Topup Plan' : 'Update Topup Plan',
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDialog id={id} onSuccess={() => {
                    search();
                    Modal.close(modal_id);
                }} onCancel={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }





    return (
        <AppPage
            title='Topup Plans'
            subtitle='Manage topup plans for bulk sms, email ,whatsapp etc'
            actions={<div className='me-4'><Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn></div>}
            containerClassName="md:pt-0"
        >
            <AppCard contentClassName="p-0">

                <div className='p-3'>
                    <Search placeholder='Search by name...' value={filters.keyword} onChange={v => setFilter('keyword', 'debounce')(v.target.value, true)} />
                </div>

                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Popular</TableHead>
                                <TableHead>Publish</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{getTopupTypeName(record.topup_type)}</TableCell>
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>₹{record.price}</TableCell>
                                    <TableCell>{record.quantity}</TableCell>
                                    <TableCell>{record.description}</TableCell>
                                    <TableCell>{record.popular ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{record.publish ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                            <Btn onClick={() => {
                                                msg.confirm('Delete ' + record.name, 'Are you sure you want to delete ' + record.name + '? this action cannot be undone.', {
                                                    onConfirm: async () => {
                                                        var r = await TopupPlanService.delete(record.id);
                                                        if (r.success) {
                                                            search();
                                                        }
                                                        return r.success;
                                                    }
                                                })
                                            }} variant="outline" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Btn>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}
                    {!searching && paginated.records.length == 0 && <NoRecords />}
                    <div className='p-3'>
                        <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />

                    </div>
                </div>
            </AppCard>
        </AppPage>
    );
};

