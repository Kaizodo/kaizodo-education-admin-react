
import { lazy, Suspense, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { UserSearchFilters } from '@/data/user';
import { EmployeeService } from '@/services/EmployeeService';
import { nameLetter } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import moment from 'moment';
import { MdOutlinePassword } from 'react-icons/md';
import { LuUsers } from 'react-icons/lu';


const LazyEditorDialog = lazy(() => import('./components/EmployeeEditorDialog'));
const LazyEmployeeSubordinateEditorDialog = lazy(() => import('./components/EmployeeSubordinateEditorDialog'));
const LazySetupPassword = lazy(() => import('./components/SetupPassword'));



export default function EmployeeListing() {
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
        var r = await EmployeeService.search(filters);
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


    const openSubordinatesDialog = async (record: any) => {
        Modal.show({
            title: `${record.first_name} ${record.last_name}`,
            subtitle: `Manager subordinates of ${record.first_name} ${record.last_name}`,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEmployeeSubordinateEditorDialog id={record.id} />
            </Suspense>
        });
    }


    const openEditor = async (id?: number) => {
        const modal_id = Modal.show({
            title: id ? 'Edit Employee Details' : 'Add New Employee',
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

    const setPassword = async (id: number) => {
        const modal_id = Modal.show({
            title: 'Set Password',
            subtitle: 'Create or change password so that employees can login',
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazySetupPassword id={id} onSuccess={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }


    return (
        <AppPage
            title={'Employees & Team'}
            subtitle={'Manage employees list'}
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
                                <TableHead>Date Added</TableHead>
                                <TableHead>Contact Information</TableHead>
                                <TableHead>Is Manager</TableHead>
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



                                    <TableCell >
                                        <div className="flex flex-col gap-1 text-sm">
                                            {!!record.email && <div className="text-sm text-gray-500 flex flex-row items-center gap-2"><FaEnvelope />{record.email}</div>}
                                            {!!record.mobile && <div className="text-sm text-gray-500 flex flex-row items-center gap-2"><FaPhone />{record.mobile}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{record.is_manager ? 'Manager' : 'Not Manager'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">

                                            {!!record.is_manager && <Btn
                                                size="sm"

                                                onClick={() => openSubordinatesDialog(record)}
                                            >
                                                <LuUsers />
                                                Subordinates
                                            </Btn>}
                                            <Btn
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setPassword(record.id)}
                                            >
                                                <MdOutlinePassword className="h-4 w-4" /> Set Password
                                            </Btn>
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" /> Edit
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

