import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import Pagination from "@/components/common/Pagination";
import { Search } from "@/components/ui/search";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useForm } from "@/hooks/use-form";
import { useGlobalContext } from "@/hooks/use-global-context";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";

import { ClientService } from "@/services/ClientService";

export default function PosCustomers() {
    const { context } = useGlobalContext();
    const [searching, setSearching] = useState(true);
    const [paginated, _, setPaginated] = useForm<PaginationType<any>>(getDefaultPaginated());

    const [filters, setFilter] = useForm<any>({
        debounce: true,
        keyword: '',
        page: 1
    });
    const debounceSearch = useDebounce(() => {
        search();
    }, 300);

    const search = async () => {
        setSearching(true);
        var r = await ClientService.search({ ...filters, organization_id: context.organization.id });
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
    }, [filters])


    useEffect(() => {
        if (context.organization?.id) {
            setFilter('organization_id')(context.organization?.id);
        }
    }, [context.organization?.id])

    return (
        <div className="bg-white rounded-lg border">
            <div className="border-b p-3">
                <span className=" text-2xl font-medium uppercase flex mb-2">Customers</span>
                <Search placeholder="Search by number" value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
            </div>
            {!searching && <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Purchase Value</TableHead>
                            <TableHead>Last Purchase</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginated.records.map((record: any) => <TableRow key={record.id}>
                            <TableCell>
                                {record.first_name ?? 'Unnamed Customer'} {record.last_name}
                            </TableCell>
                            <TableCell>{record.mobile}</TableCell>
                            <TableCell>{record.email}</TableCell>
                            <TableCell >{record.total_purchase}</TableCell>
                            <TableCell>{formatDateTime(record.last_purchase_at)}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 justify-start items-start">
                                    <span className="text-sm">{formatDate(record.created_at)}</span>
                                    <span className="text-xs text-gray-500">{formatTime(record.created_at, 'Y-MM-DD HH:mm:ss')}</span>
                                </div>
                            </TableCell>

                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>}
            {searching && <CenterLoading className="relative h-[500px]" />}
            {!searching && paginated.records.length == 0 && <NoRecords />}
            <Pagination className="p-3" paginated={paginated} onChange={setFilter('page', 'debounce')} />
        </div>
    )
}
