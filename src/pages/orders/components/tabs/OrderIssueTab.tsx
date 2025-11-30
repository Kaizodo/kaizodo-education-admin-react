import { useEffect, useState } from 'react';
import CenterLoading from '@/components/common/CenterLoading';
import { useForm } from '@/hooks/use-form';
import { LuArrowRight, LuImage, LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { formatDate, formatTime } from '@/lib/utils';
import Dropdown from '@/components/common/Dropdown';
import Btn from '@/components/common/Btn';
import { Badge } from '@/components/ui/badge';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { UserOrderService } from '@/services/UserOrderService';
import { getUserOrderIssueStatusName, UserOrderIssueType, UserOrderStatusArray } from '@/data/order';
import { Link, useNavigate } from 'react-router-dom';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import SuggestProduct from '@/components/common/suggest/SuggestProduct';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SafeImage from '@/components/common/SafeImage';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestCurrency from '@/components/common/suggest/SuggestCurrency';
import { useDebounce } from '@/hooks/use-debounce';
import DateTimeField from '@/components/common/DateTimeField';
import DownloadInvoiceBtn from '@/pages/invoices/components/DownloadInvoiceBtn';
import { Search } from '@/components/ui/search';
import { Shipment } from '@/data/Shipment';

const defaultFilters = {
    page: 1,
    keyword: '',
    debounce: false,
    is_renwal: undefined,
    duration: undefined,
    product_id: undefined,
    progress: undefined,
    currency_id: undefined,
    country_id: undefined,
    status: undefined,
    date_from: undefined,
    date_to: undefined
}




export default function OrderIssueTab({ showFilters, tab }: { tab: string, showFilters: boolean }) {
    const navigate = useNavigate();
    const [searching, setSeraching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<Shipment>>(getDefaultPaginated());
    const [filters, setFilter, setFilters] = useForm(defaultFilters);

    const search = async () => {
        setSeraching(true);
        var r = await UserOrderService.searchOrderIssues(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSeraching(false);
    }

    const debounceSearch = useDebounce(() => {
        search();
    }, 300)

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }
    }, [filters])


    useEffect(() => {
        if (tab == 'replacements') {
            setFilter('issue_type', 'debounce')(UserOrderIssueType.Replacement);
        } else if (tab == 'cancellations') {
            setFilter('issue_type', 'debounce')(UserOrderIssueType.Cancellation);
        } else if (tab == 'returns') {
            setFilter('issue_type', 'debounce')(UserOrderIssueType.Return);
        }
    }, [tab])



    return (
        <div className='w-full'>
            <div className='border bg-white rounded-lg p-3 shadow gap-3 flex flex-col'>
                <Search placeholder='Search by order number' value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
                {showFilters && <div className='flex flex-row items-end gap-3'>
                    <div className=' grid grid-cols-5 gap-3 flex-1'>
                        <Dropdown
                            searchable={false}
                            value={filters.is_renwal}
                            onChange={setFilter('is_renwal', 'debounce')}
                            placeholder='Select an option'
                            getOptions={async () => [
                                { id: 1, name: 'Renwal' },
                                { id: 0, name: 'Purchase' },

                            ]}>Order Type</Dropdown>
                        <Dropdown
                            searchable={false}
                            value={filters.duration}
                            onChange={setFilter('duration', 'debounce')}
                            placeholder='Select a duration'
                            getOptions={async () => [
                                { id: '30d', name: 'Within 30 Days' },
                                { id: '1y', name: '30 Days+ and within 1 Year' },
                                { id: '1y+', name: '1 Year+' },
                            ]}>Duration</Dropdown>
                        <SuggestProduct
                            value={filters.product_id}
                            onChange={setFilter('product_id', 'debounce')}
                        />
                        <Dropdown
                            value={filters.progress}
                            onChange={setFilter('progress', 'debounce')}
                            placeholder='Select progress'
                            getOptions={async () => [
                                { id: '!dma', name: 'Deployment Manager Not Assigned' },
                                { id: 'dma', name: 'Deployment Manager Assigned' },
                                { id: '!ta', name: 'Team Not Assigned' },
                                { id: 'ta', name: 'Team Assigned' },
                                { id: 'rfd', name: 'Ready for deployment' },
                                { id: '!rfd', name: 'Not ready for deployment' },
                                { id: 'dc', name: 'Deployment Completed' },
                                { id: 'do', name: 'Deployment Onboing' },
                                { id: 'rma', name: 'Relationship Manager Assigned' },
                                { id: '!rma', name: 'Relationship manager not assigned' },

                            ]}>Deployment Progress</Dropdown>
                        <SuggestCountry
                            value={filters.country_id}
                            onChange={setFilter('country_id', 'debounce')}
                        />
                        <SuggestCurrency
                            value={filters.currency_id}
                            onChange={setFilter('currency_id', 'debounce')}
                        />
                        <Dropdown
                            value={filters.status}
                            onChange={setFilter('status', 'debounce')}
                            getOptions={async () => (UserOrderStatusArray)}
                            placeholder='Select order status'
                        >Order Status</Dropdown>
                        <div className='grid grid-cols-2 gap-3'>
                            <DateTimeField
                                onChange={setFilter('date_from')}
                                value={filters.date_from}
                                mode='date'
                                placeholder='Select date from'
                            >Date From</DateTimeField>
                            <DateTimeField
                                onChange={setFilter('date_to')}
                                value={filters.date_to}
                                mode='date'
                                placeholder='Select date to'
                            >Date To</DateTimeField>
                        </div>
                    </div>
                    <Btn onClick={() => setFilters(defaultFilters)}>Clear Filters</Btn>
                </div>}
            </div>
            {!searching && <span className='text-xs italic flex mt-2 mb-6'>Found {paginated.total} Orders | Showing {paginated.records.length} on current page {paginated.page}</span>}

            <div className="space-y-6">
                {searching && <CenterLoading className="relative h-[400px]" />}
                {!searching && paginated.records.length == 0 && <NoRecords title='No Orders found' />}
                {!searching && paginated.records.length > 0 && (
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Buyer</TableHead>
                                    <TableHead>Order Date</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.records.map((order) => {
                                    return (<TableRow key={`heading_${order.id}`}>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <SafeImage src={order.country_image} className='w-5 rounded-lg overflow-hidden'>
                                                    <LuImage />
                                                </SafeImage>
                                                <span className='text-xs text-gray-500'>{order.country_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900">{order?.buyer_party.name}</div>
                                                <span className='flex text-xs flex-row items-center gap-1'><LuPhone />{order?.buyer_party.mobile}</span>
                                                <span className='flex text-xs flex-row items-center gap-1'><LuMail />{order?.buyer_party.email}</span>
                                                <span className='flex text-xs flex-row items-center gap-1'><LuMapPin />{order?.buyer_party.address}</span>
                                            </div>
                                        </TableCell>


                                        <TableCell>
                                            <div className='flex flex-col gap-1 text-xs'>
                                                <span>{formatDate(order.created_at)}</span>
                                                <span>{formatTime(order.created_at)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {!!order.order_internal_reference_number && <Link className='text-blue-600 underline' to={'/orders/' + order.order_internal_reference_number}>{order.order_internal_reference_number}</Link>}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {!!order.invoice_internal_reference_number && <Link className='text-blue-600 underline' to={'/invoices/' + order.invoice_internal_reference_number}>{order.invoice_internal_reference_number}</Link>}
                                        </TableCell>





                                        <TableCell>{order.items_count == 1 ? '1 Item' : order.items_count + ' Items'}</TableCell>


                                        <TableCell>
                                            <Badge variant={'outline'}>{getUserOrderIssueStatusName(order.status)}</Badge>
                                        </TableCell>

                                        <TableCell className="text-right space-x-2">

                                            <div className='flex flex-row items-center gap-3 justify-end'>
                                                {!!order.invoice_internal_reference_number && <DownloadInvoiceBtn internal_reference_number={order.invoice_internal_reference_number} />}
                                                <Btn
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/order-issue/${order.internal_reference_number}`)}
                                                >
                                                    Details <LuArrowRight className="ml-1" />
                                                </Btn>
                                            </div>
                                        </TableCell>
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

            </div>
            <Pagination className="p-3" paginated={paginated} onChange={setFilter('page', 'debounce')} />
            {!searching && <span className='text-xs italic flex mt-2 mb-6'>Found {paginated.total} Orders | Showing {paginated.records.length} on current page {paginated.page}</span>}

        </div>
    );
};

