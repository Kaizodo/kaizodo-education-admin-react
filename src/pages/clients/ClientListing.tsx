
import { lazy, Suspense, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Eye } from 'lucide-react';
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
import { UserSearchFilters } from '@/data/user';
import { ClientService } from '@/services/ClientService';
import { nameLetter } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import moment from 'moment';


const LazyEditorDalog = lazy(() => import('./components/ClientEditorDialog'));



export default function ClientListing() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<UserSearchFilters>({
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
        var r = await ClientService.search(filters);
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
            title: id ? 'Edit Client Details' : 'Add New Client',
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
        <AppPage
            title={'Clients'}
            subtitle={'Manage client accounts'}
            actions={<Btn onClick={() => openEditor()}><FaPlus />Add New</Btn>}
            containerClassName="pt-0 md:pt-0"
        >
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
                                <TableHead>Client</TableHead>
                                <TableHead className="hidden md:table-cell">Date Added</TableHead>
                                <TableHead className="hidden lg:table-cell">Contact Information</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarImage src={record.image} />
                                                <AvatarFallback>
                                                    {nameLetter(record.first_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{moment(record.created_at).format('DD MMM, Y')}</Badge>
                                    </TableCell>



                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex flex-col gap-1 text-sm">
                                            {!!record.email && <div className="text-sm text-gray-500 flex flex-row items-center gap-2"><FaEnvelope />{record.email}</div>}
                                            {!!record.mobile && <div className="text-sm text-gray-500 flex flex-row items-center gap-2"><FaPhone />{record.mobile}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">


                                            <Btn
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {

                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Btn>
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Btn>





                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}
                    {!searching && paginated.records.length == 0 && <NoRecords />}
                    <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
                </div>
            </AppCard>
        </AppPage>
    );
};

