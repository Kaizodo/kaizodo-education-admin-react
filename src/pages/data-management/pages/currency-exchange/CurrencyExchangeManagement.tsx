
import { lazy, Suspense, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit } from 'lucide-react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import AppCard from '@/components/app/AppCard';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Modal } from '@/components/common/Modal';
import { CurrencyExchangeService } from '@/services/CurrencyExchangeService';
import { formatDateTime } from '@/lib/utils';
import { LuUsers } from 'react-icons/lu';

const LazyEditorDalog = lazy(() => import('./components/CurrencyExchangeEditorDailog'));

export default function CurrencyExchangeManagement() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string
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
        var r = await CurrencyExchangeService.search(filters);
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
            title: id ? 'Update Currency Exchange' : 'Add Currency Exchange',
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDalog id={id} onSuccess={() => {
                    search();
                    Modal.close(modal_id);
                }} onCancel={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }





    return (
        <AppPage title='Currency Exchange' subtitle='Manage currency rates from this section' actions={<Btn onClick={() => openEditor()}><FaPlus />Add New</Btn>}>
            <AppCard>
                <div className="flex flex-col sm:flex-row gap-4 px-6 pt-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search..."
                            value={filters.keyword}
                            onChange={(e) => setFilter('keyword', 'debounce')(e.target.value, true)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Base Currency</TableHead>
                                <TableHead>Target Currency</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Reverse Rate</TableHead>
                                <TableHead>Affected clients</TableHead>
                                <TableHead>Publising Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Last Updated At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.base_currency_name} ({record.base_currency_symbol})</TableCell>
                                    <TableCell>{record.target_currency_name} ({record.target_currency_symbol})</TableCell>
                                    <TableCell>{record.base_currency_symbol}1  = {record.target_currency_symbol}{record.rate}</TableCell>
                                    <TableCell>{record.target_currency_symbol}1  = {record.base_currency_symbol}{record.reverse_rate}</TableCell>
                                    <TableCell>
                                        <div className='flex flex-row items-center gap-1'>
                                            <span>{record.affected_clients}</span>
                                            <LuUsers />
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-xs'>{record.publish ? 'Published' : 'Unpublished'}</TableCell>
                                    <TableCell className='text-xs'>{formatDateTime(record.created_at)}</TableCell>
                                    <TableCell className='text-xs'>{formatDateTime(record.updated_at ?? record.created_At)}</TableCell>
                                    <TableCell className='w-[50px]'>
                                        <div className='justify-end flex'>
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                Update
                                                <Edit className="h-4 w-4" />
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

