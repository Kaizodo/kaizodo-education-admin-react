
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Trash2 } from 'lucide-react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { OrganizationService } from '@/services/OrganizationService';
import { useNavigate } from 'react-router-dom';
import { LuImage } from 'react-icons/lu';

import SafeImage from '@/components/common/SafeImage';


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
        var r = await OrganizationService.search(filters);
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
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>{record.domain}</TableCell>
                                    <TableCell>

                                        <div className="flex gap-2 justify-end">
                                            <Btn variant="outline" size="sm" onClick={() => navigate('/stores/update/' + record.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                            <Btn onClick={() => {
                                                msg.confirm('Delete ' + record.name, 'Are you sure you want to delete ' + record.name + '? this action cannot be undone.', {
                                                    onConfirm: async () => {
                                                        var r = await OrganizationService.delete(record.id);
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
            </div>
        </AppPage>
    );
};

