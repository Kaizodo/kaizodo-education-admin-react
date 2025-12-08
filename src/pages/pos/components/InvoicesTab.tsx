import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import Pagination from "@/components/common/Pagination";
import { Search } from "@/components/ui/search";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useForm } from "@/hooks/use-form";
import { useGlobalContext } from "@/hooks/use-global-context";
import { msg } from "@/lib/msg";
import { formatDate, formatTime } from "@/lib/utils";
import { downloadInvoice } from "@/pages/invoices/components/DownloadInvoiceBtn";
import { PosService } from "@/services/PosService";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LuArrowRight, LuDownload } from "react-icons/lu";

export default function InvoicesTab({ is_draft, is_proforma, has_project }: { is_draft: boolean, is_proforma: boolean, has_project: boolean }) {
    const { context } = useGlobalContext();
    const { loadStats } = useOutletContext<{ loadStats: (mainLoading: boolean) => void }>();
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginatedValue, setPaginated] = useForm<PaginationType<any>>(getDefaultPaginated());

    const [filters, setFilter] = useForm<any>({
        debounce: true,
        is_proforma,
        is_draft,
        has_project,
        page: 1
    });
    const debounceSearch = useDebounce(() => {
        search();
    }, 300);

    const search = async () => {
        setSearching(true);
        var r = await PosService.searchInvoices({ ...filters, organization_id: context.organization.id });
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
            setFilter('is_draft', 'is_proforma', 'has_project')(is_draft, is_proforma, has_project);
        }
    }, [is_draft, is_proforma, has_project, context.organization?.id])

    return (
        <div className="bg-white rounded-lg border">
            <div className="border-b p-3">
                {has_project && <span className=" text-2xl font-medium uppercase flex mb-2">Job Cards</span>}
                {is_draft && <span className=" text-2xl font-medium uppercase flex mb-2">Draft</span>}
                {is_proforma && <span className=" text-2xl font-medium uppercase flex mb-2">Proforma Invoices</span>}
                {!has_project && !is_draft && !is_proforma && <span className=" text-2xl font-medium uppercase flex mb-2">Invoices</span>}
                <Search placeholder="Search by number" value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
            </div>
            {!searching && <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Due</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Items</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginated.records.map((record: any) => <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.internal_reference_number}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">{record.first_name} {record.last_name}</span>
                                    <span className="text-sm text-gray-600">{record.mobile}</span>
                                </div>
                            </TableCell>
                            <TableCell>{formatDate(record.invoice_date)}</TableCell>
                            <TableCell>{formatDate(record.due_date)}</TableCell>
                            <TableCell className="text-right">{record.currency_symbol}{record.amount}</TableCell>
                            <TableCell className="text-center">{record.items_count}</TableCell>
                            <TableCell className="text-center">{record.total_quantity}</TableCell>
                            <TableCell className="">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm">{formatDate(record.created_at)}</span>
                                    <span className="text-xs text-gray-500">{formatTime(record.created_at)}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {(is_draft || is_proforma || has_project) && <Link to={'/pos/' + record.internal_reference_number}><Btn size="sm" variant="outline">Edit</Btn></Link>}
                                    {is_draft && <>


                                        <Btn size="sm" variant="destructive" asyncClick={async () => {
                                            await msg.confirm('Delete ' + record.is_draft ? 'Draft' : 'Proforma', 'You are about to delete the record, this action cannot be undone.', {
                                                onConfirm: async () => {
                                                    var r = await PosService.deleteInvoice({
                                                        organization_id: record.organization_id,
                                                        internal_reference_number: record.internal_reference_number
                                                    });
                                                    if (r.success) {
                                                        setPaginatedValue(`records[id:${record.id}]-`)();
                                                        loadStats(false);
                                                        msg.success('Record deleted successfuly');
                                                    }
                                                    return r.success;
                                                }
                                            })
                                        }}>Delete</Btn>
                                    </>}

                                    {!is_draft && !has_project && <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Btn variant="outline" size={'sm'}>Downloads <LuDownload /></Btn>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="start">
                                            <DropdownMenuLabel>Available Downloads</DropdownMenuLabel>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={async () => {
                                                    var msg_id = msg.loading('Downloading...');
                                                    await downloadInvoice({ internal_reference_number: record.internal_reference_number });
                                                    msg.dismiss(msg_id);
                                                }} className="justify-between">Download Invoice <LuDownload /></DropdownMenuItem>
                                                <DropdownMenuItem onClick={async () => {
                                                    var msg_id = msg.loading('Downloading...');
                                                    await downloadInvoice({
                                                        internal_reference_number: record.internal_reference_number, additional_data: {
                                                            label: 'dc'
                                                        }
                                                    });
                                                    msg.dismiss(msg_id);
                                                }} className="justify-between">Delivery Challan <LuDownload /></DropdownMenuItem>
                                                <DropdownMenuItem onClick={async () => {
                                                    var msg_id = msg.loading('Downloading...');
                                                    await downloadInvoice({
                                                        internal_reference_number: record.internal_reference_number, additional_data: {
                                                            label: 'dc1'
                                                        }
                                                    });
                                                    msg.dismiss(msg_id);
                                                }} className="justify-between">Delivery Challan Copy(1)<LuDownload /></DropdownMenuItem>
                                            </DropdownMenuGroup>

                                        </DropdownMenuContent>
                                    </DropdownMenu>}
                                    {(!is_draft && !has_project) && <Link to={'/pos/invoices/' + record.internal_reference_number}><Btn size="sm" variant="outline">View Details <LuArrowRight /></Btn></Link>}

                                </div>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>}
            {searching && <CenterLoading className="relative h-[500px]" />}
            {!searching && paginated.records.length == 0 && <NoRecords />}
            <Pagination paginated={paginated} onChange={setFilter('page', 'debounce')} />
        </div>
    )
}
