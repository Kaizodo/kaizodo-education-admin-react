import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react'
import Btn from '@/components/common/Btn';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDefaultParams } from '@/hooks/use-default-params';
import NoRecords from '@/components/common/NoRecords';
import SuggestEmployee from '@/components/common/suggest/SuggestEmployee';
import { formatDate, nameLetter } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { UserSearchFilters } from '@/data/user';
import { useDebounce } from '@/hooks/use-debounce';
import { EmployeeService } from '@/services/EmployeeService';
import { Search } from '@/components/ui/search';
import Pagination from '@/components/common/Pagination';
import { LuUserX } from 'react-icons/lu';
import { StoreService } from '@/services/StoreService';

export default function StoreOnboardingStepEmployees({ organization_id, registerCallback }: OrganizationOnboardingStepsProps & {
    organization_id?: number
}) {
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const [form, setForm] = useState<any>({
        all_categories: 1
    });
    const setValue = useSetValue(setForm);
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
        var r = await EmployeeService.search({ ...filters, organization_id: id });
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



    useEffect(() => {
        registerCallback?.(async () => {
            return true;
        })
    });






    return (<div className='p-6 space-y-6'>
        <div className='bg-sky-50 border-sky-400 border p-3 rounded-lg flex flex-row items-end gap-3'>

            <div className='flex-1'>
                <SuggestEmployee value={form.user_id} onChange={setValue('user_id')} placeholder='Select existing employee'>Employee</SuggestEmployee>
            </div>
            <div>
                <Btn disabled={!form.user_id} asyncClick={async () => {
                    var r = await StoreService.assignEmployee({
                        id,
                        user_id: form.user_id
                    });
                    if (r.success) {
                        setValue('user_id')()
                        search();
                    }
                    return r.success;

                }}>Assign Employee</Btn>
            </div>
        </div>

        <AppCard>

            <div className="w-full p-3">
                <Search
                    placeholder="Search..."
                    value={filters.keyword}
                    onChange={(e) => setFilter('keyword', 'debounce')(e.target.value, true)}

                />

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
                                    <Badge variant="secondary">{formatDate(record.created_at)}</Badge>
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


                                        <Btn variant="outline" size="sm" asyncClick={async () => {
                                            await msg.confirm('Remove' + ` ${record.first_name} ${record.last_name}`, `Employee won't able to login on the organization panel`, {
                                                onConfirm: async () => {
                                                    var r = await StoreService.removeEmployee({
                                                        id,
                                                        user_id: record.id
                                                    });
                                                    if (r.success) {
                                                        setPaginated(p => ({ ...p, records: p.records.filter(px => px.id !== record.id) }));
                                                    }
                                                    return r.success;

                                                }

                                            })
                                        }} >
                                            Remove <LuUserX />
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
    </div>)
}
