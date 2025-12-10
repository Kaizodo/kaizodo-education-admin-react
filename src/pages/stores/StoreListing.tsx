
import { useEffect, useState } from 'react';
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
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { useNavigate } from 'react-router-dom';
import { LuCopy, LuImage } from 'react-icons/lu';

import SafeImage from '@/components/common/SafeImage';
import { Modal } from '@/components/common/Modal';
import CloneOrganizationDialog from './components/CloneOrganizationDialog';
import { StoreService } from '@/services/StoreService';
import { Badge } from '@/components/ui/badge';


export default function StoreListing() {
    const navigate = useNavigate();
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string
        is_internal: number
    }>({
        is_internal: 1,
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
        var r = await StoreService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    const clone = (record: any) => {
        const modal_id = Modal.show({
            title: 'Clone Organization',
            subtitle: 'Create copy of organization',
            content: () => <CloneOrganizationDialog organization={record} onSuccess={() => {
                search();
                Modal.close(modal_id);
            }} />
        })
    }



    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);






    return (
        <AppPage
            title='Stores'
            subtitle='Manage stores and create new one'
            actions={<Btn size={'sm'} onClick={() => navigate('/stores/create')}><FaPlus />Add New</Btn>}
        >
            <div className='bg-white rounded-lg py-6 border'>
                <div className="flex flex-col sm:flex-row gap-4 px-6">
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
                                <TableHead></TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Domain</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Locality</TableHead>
                                <TableHead>Pincode</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <SafeImage src={record.logo_short} className='h-20 w-20 border rounded-lg p-1 items-center justify-center flex'>
                                            <LuImage className='text-3xl text-gray-400' />
                                        </SafeImage>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col justify-start items-start'>
                                            <span className='font-medium text-sm'>{record.name}</span>
                                            <span className='text-xs text-gray-600 mb-1'>{record.nickname}</span>
                                            {!record.organization_id && <Badge>Main Organization</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{record.domain}</TableCell>
                                    <TableCell>{record.country_name}</TableCell>
                                    <TableCell>
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-sm'>{record.state_name}</span>
                                            <span className='text-xs text-gray-600'>GST:- {record.gst_number}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{record.city_name}</TableCell>
                                    <TableCell>{record.locality_name}</TableCell>
                                    <TableCell>{record.pincode}</TableCell>
                                    <TableCell>

                                        <div className="flex gap-2 justify-end">
                                            <Btn variant={'outline'} size={'sm'} onClick={() => clone(record)}><LuCopy /> Clone</Btn>
                                            <Btn variant="outline" size="sm" onClick={() => navigate('/stores/update/' + record.id)}>
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
            </div>
        </AppPage>
    );
};

