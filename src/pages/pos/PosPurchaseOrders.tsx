import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import Pagination from "@/components/common/Pagination";
import { Search } from "@/components/ui/search";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useForm } from "@/hooks/use-form";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";
import { PosService } from "@/services/PosService";
import { useEffect, useState } from "react";
import { HiOutlineArrowTurnDownRight } from "react-icons/hi2";
import { LuCircleCheck } from "react-icons/lu";
import { RiExpandUpDownLine } from "react-icons/ri";
import { Link, useOutletContext } from "react-router-dom";
import DownloadPoBtn from "./components/DownloadPoBtn";
export default function PosPurchaseOrders() {
    const { organization_id } = useOutletContext<{ organization_id: number }>()
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginatedValue, setPaginated] = useForm<PaginationType<any>>(getDefaultPaginated());

    const [filters, setFilter] = useForm<any>({
        organization_id,
        page: 1
    });
    const debounceSearch = useDebounce(() => {
        search();
    }, 300);

    const search = async () => {
        setSearching(true);
        var r = await PosService.searchPurchaseOrders(filters);
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
        setFilter('organization_id')(organization_id);
    }, [organization_id])

    return (
        <div className="bg-white rounded-lg border">
            <div className="border-b p-3">
                <span className=" text-2xl font-medium uppercase flex mb-2">Purchase Orders</span>
                <Search placeholder="Search by number" value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
            </div>
            {!searching && <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>PO</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead className="text-start">Items</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-center">SKU</TableHead>

                            <TableHead className="text-center">MRP</TableHead>

                            <TableHead className="text-center">Selling Price</TableHead>
                            <TableHead className="text-center">Cost</TableHead>

                            <TableHead className="text-center">Amount</TableHead>

                            <TableHead>Created At</TableHead>
                            <TableHead></TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginated.records.flatMap((record: any) => [
                            (<TableRow key={record.id}>
                                <TableCell className="font-medium">{record.internal_reference_number}</TableCell>
                                <TableCell>
                                    {record.seller_party && <div className="flex flex-col gap-1">
                                        <span className="font-medium">{record.seller_party.name}</span>
                                        {!!record.seller_party.gst_number && <span className="text-xs text-gray-600">GST :- {record.seller_party.gst_number}</span>}
                                        <span className="text-xs text-gray-600">{record.seller_party.mobile}</span>
                                    </div>}
                                </TableCell>

                                <TableCell className="text-start">
                                    <Btn size={'xs'} variant={!record.collapse_open ? 'outline' : 'destructive'} onClick={() => setPaginatedValue(`records[id:${record.id}].collapse_open`)(!record.collapse_open)}>
                                        {record.items.length} Items
                                        <RiExpandUpDownLine />
                                    </Btn>
                                </TableCell>
                                <TableCell className="text-center">{record.items.reduce((pv: number, cv: any) => pv += Number(cv.quantity), 0)}</TableCell>
                                <TableCell className="text-center"></TableCell>
                                <TableCell className="text-center">{record.currency_symbol}{record.items.reduce((pv: number, cv: any) => pv += Number(cv.mrp) * Number(cv.quantity_received), 0)}</TableCell>
                                <TableCell className="text-center">{record.currency_symbol}{record.items.reduce((pv: number, cv: any) => pv += Number(cv.sp) * Number(cv.quantity_received), 0)}</TableCell>
                                <TableCell className="text-center">{record.currency_symbol}{record.items.reduce((pv: number, cv: any) => pv += Number(cv.cp) * Number(cv.quantity_received), 0)}</TableCell>
                                <TableCell className="text-center">{record.currency_symbol}{record.amount}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm">{formatDate(record.created_at)}</span>
                                        <span className="text-xs text-gray-500">{formatTime(record.created_at)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        {!!record.is_received && <>
                                            <span className=' flex flex-row items-center gap-2 py-1 px-3 rounded-full bg-green-100 border-green-600s border self-start'>Recevied <LuCircleCheck /></span>
                                            <span className="text-xs mt-1">{formatDateTime(record.received_at)}</span>
                                            {!!record.receiving_number && <span className="text-xs mt-1">#{record.receiving_number}</span>}
                                        </>}

                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={'/pos/purchase-orders/' + record.internal_reference_number}><Btn variant="outline">View</Btn></Link>
                                        <DownloadPoBtn organization_id={record.organization_id} internal_reference_number={record.internal_reference_number} />

                                    </div>
                                </TableCell>
                            </TableRow>),
                            ...record.items.filter(() => !!record.collapse_open).map((poi: any) => {

                                return (<TableRow key={`store_${record.id}_${poi.id}`}>
                                    <TableCell colSpan={2}>

                                    </TableCell>
                                    <TableCell className='text-start'>
                                        <div className="flex flex-row items-center gap-2">
                                            <HiOutlineArrowTurnDownRight />
                                            <span>{poi.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{poi.quantity}</TableCell>
                                    <TableCell className="text-center">{poi.sku_received}</TableCell>
                                    <TableCell className="text-center">{record.currency_symbol}{poi.mrp_received}</TableCell>
                                    <TableCell className="text-center">{record.currency_symbol}{poi.sp_received}</TableCell>
                                    <TableCell className="text-center">{record.currency_symbol}{poi.cp_received}</TableCell>

                                    <TableCell className="text-center">{record.currency_symbol}{poi.total_amount}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>);
                            })
                        ])}
                    </TableBody>
                </Table>
            </div>}
            {searching && <CenterLoading className="relative h-[500px]" />}
            {!searching && paginated.records.length == 0 && <NoRecords />}
            <Pagination className="p-3" paginated={paginated} onChange={setFilter('page', 'debounce')} />
        </div>
    )
}
