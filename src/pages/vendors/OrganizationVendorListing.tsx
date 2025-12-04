
import { lazy, Suspense, useEffect, useState } from 'react';
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
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { OrganizationVendorService } from '@/services/OrganizationVendorService';
import { LuPlus } from 'react-icons/lu';
import { Modal } from '@/components/common/Modal';
import { useGlobalContext } from '@/hooks/use-global-context';
const LazyEditorDialog = lazy(() => import('./components/OrganizationVendorEditor'));


export default function OrganizationVendorListing() {
    const { context } = useGlobalContext();
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
        var r = await OrganizationVendorService.search({ ...filters, organization_id: context.organization.id });
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }


    const openEditor = async (id?: number) => {
        const modal_id = Modal.show({
            title: !id ? 'Add Vendor' : 'Update Vendor',
            maxWidth: 500,
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


    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);


    useEffect(() => {
        if (context?.organization) {
            setFilter('organization_id')(context.organization.id);
        }
    }, [context.organization])




    return (
        <AppPage title='Vendors' subtitle='Manage vendors for purchases' actions={<Btn onClick={() => openEditor()}><LuPlus />Add New</Btn>}>
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
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Contact Number</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>

                                    <TableCell>
                                        {record.name}
                                    </TableCell>


                                    <TableCell>{record.mobile}</TableCell>
                                    <TableCell>{record.email}</TableCell>
                                    <TableCell>
                                        {record.organization ? (
                                            <div className="space-y-1 text-sm">
                                                <div className="font-medium">{record.organization.name}</div>
                                                {record.organization.gst_number && <div className="text-xs text-muted-foreground">GST: {record.organization.gst_number}</div>}
                                                {record.organization.billing_address && (
                                                    <div className="text-xs text-muted-foreground">
                                                        <span className="font-medium">Billing Address:</span> {record.organization.billing_address}
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                    {record.organization.pincode && <div>Pin: {record.organization.pincode}</div>}
                                                    {record.organization.state_name && <div>State: {record.organization.state_name}</div>}
                                                    {record.organization.country_name && <div>Country: {record.organization.country_name}</div>}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No Organization</span>
                                        )}
                                    </TableCell>
                                    <TableCell>

                                        <div className="flex gap-2 justify-end">
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
                    <div className='p-3'>
                        <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />

                    </div>
                </div>
            </div>
        </AppPage>
    );
};

