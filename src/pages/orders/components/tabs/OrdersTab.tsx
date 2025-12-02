import { useEffect, useState } from 'react';
import CenterLoading from '@/components/common/CenterLoading';
import { useForm } from '@/hooks/use-form';
import { LuArrowRight, LuImage, LuMail, LuPhone } from 'react-icons/lu';
import { formatDate, formatTime } from '@/lib/utils';
import Dropdown from '@/components/common/Dropdown';
import Btn from '@/components/common/Btn';
import { Badge } from '@/components/ui/badge';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { UserOrderService } from '@/services/UserOrderService';
import { getUserOrderIssueTypeName, getUserOrderStatusMeta, UserOrder, UserOrderStatus, UserOrderStatusArray } from '@/data/order';
import { useNavigate } from 'react-router-dom';
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
import { nameLetter } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SafeImage from '@/components/common/SafeImage';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestCurrency from '@/components/common/suggest/SuggestCurrency';
import { useDebounce } from '@/hooks/use-debounce';
import DateTimeField from '@/components/common/DateTimeField';
import { HiOutlineArrowTurnDownRight } from 'react-icons/hi2';
import { RiExpandUpDownLine } from 'react-icons/ri';
import DownloadInvoiceBtn from '@/pages/invoices/components/DownloadInvoiceBtn';
import { Search } from '@/components/ui/search';
import { UserOrderItem } from '@/data/UserOrder';

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




export default function OrdersTab({ showFilters, tab }: { tab: string, showFilters: boolean }) {
    const navigate = useNavigate();
    const [searching, setSeraching] = useState(true);
    const [paginated, setPaginatedValue, setPaginated] = useForm<PaginationType<UserOrder>>(getDefaultPaginated());
    const [filters, setFilter, setFilters] = useForm(defaultFilters);

    const search = async () => {
        setSeraching(true);
        var r = await UserOrderService.search(filters);
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
        if (tab == 'all') {
            setFilter('payment_completed', 'status', 'debounce')(1);
        } else if (tab == 'new') {
            setFilter('payment_completed', 'status', 'debounce')(1, UserOrderStatus.New);
        } else if (tab == 'payment') {
            setFilter('payment_completed', 'status', 'debounce')(0);
        }
    }, [tab])


    var all_collaped = !!paginated.records.find(r => !!r.collapse_open);

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
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Purchased On</TableHead>
                                    <TableHead>Type</TableHead>

                                    <TableHead>
                                        <div
                                            className='flex flex-row items-center gap-1  self-center hover:text-destructive cursor-pointer h-full'
                                            onClick={() => setPaginated(p => ({ ...p, records: p.records.map(r => ({ ...r, collapse_open: !all_collaped })) }))}
                                        >
                                            Stores
                                            <RiExpandUpDownLine />
                                        </div>
                                    </TableHead>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Order Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.records.flatMap((order) => {
                                    var organization_orders = paginated.data.organization_orders.filter((oo: any) => oo.user_order_id == order.id);
                                    var organizations = paginated.data.organizations.filter((ox: any) => organization_orders.map((oo: any) => oo.organization_id).includes(ox.id));
                                    var items: UserOrderItem[] = paginated.data.items.filter((i: any) => i.user_order_id == order.id);
                                    var refunds: { id: number, user_order_id: number, organization_id: number, organization_order_id: number, status: number }[] = paginated.data.refunds.filter((i: any) => i.user_order_id == order.id);
                                    var issues: { id: number, organization_id: number, organization_order_id: number, status: number, issue_type: number }[] = paginated.data.issues.filter((i: any) => i.user_order_id == order.id);
                                    var top_level_item_status = [...new Set(items.map(i => i.status))];

                                    return [
                                        (<TableRow key={`heading_${order.id}`}>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <SafeImage src={order.country_image} className='w-5 rounded-lg overflow-hidden'>
                                                        <LuImage />
                                                    </SafeImage>
                                                    <span className='text-xs text-gray-500'>{order.country_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Avatar className="h-10 w-10 mr-3">
                                                        <AvatarImage src={order?.user?.image} />
                                                        <AvatarFallback>
                                                            {nameLetter(order?.user?.first_name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{order?.user?.first_name} {order?.user?.last_name}</div>
                                                        <span className='flex text-xs flex-row items-center gap-1'><LuPhone />{order?.user?.mobile}</span>
                                                        <span className='flex text-xs flex-row items-center gap-1'><LuMail />{order?.user?.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>


                                            <TableCell>
                                                <div className='flex flex-col gap-1 text-xs'>
                                                    <span>{formatDate(order.created_at)}</span>
                                                    <span>{formatTime(order.created_at)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{order.is_renewed ? "Renewal" : "Purchase"}</TableCell>

                                            <TableCell>
                                                <Btn size={'xs'} variant={!order.collapse_open ? 'outline' : 'destructive'} onClick={() => setPaginatedValue(`records[id:${order.id}].collapse_open`)(!order.collapse_open)}>
                                                    {organizations.length} Stores
                                                    <RiExpandUpDownLine />
                                                </Btn>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div>
                                                    {order.internal_reference_number}
                                                    {order.is_renewed && <Badge className="ml-2">Renewed</Badge>}
                                                </div>
                                            </TableCell>


                                            <TableCell>{order.items_count == 1 ? '1 Item' : order.items_count + ' Items'}</TableCell>

                                            <TableCell className="text-right">
                                                {order.currency_symbol}{order.amount}
                                            </TableCell>

                                            <TableCell>
                                                <div className='flex flex-col gap-1 justify-start items-start'>
                                                    {refunds.length > 0 && <Badge variant={'outline'}>Refunds {refunds.length}</Badge>}
                                                    {top_level_item_status.map(status => {
                                                        const s_meta = getUserOrderStatusMeta(status);
                                                        const items_count = items.filter(i => i.status == status).length;
                                                        if (items_count == 0) {
                                                            return null;
                                                        }
                                                        return <Badge key={status} variant={'destructive'} className={`${s_meta.bg} ${s_meta.fg} gap-1 flex`}>{s_meta.name} <b>{items_count}</b></Badge>;
                                                    })}
                                                    {issues.map(issue => <Badge key={issue.id} variant={'destructive'} className='gap-1 flex'>{getUserOrderIssueTypeName(issue.issue_type)} <b>{issues.length}</b></Badge>)}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right space-x-2">

                                                <div className='flex flex-row items-center gap-3 justify-end'>
                                                    <DownloadInvoiceBtn internal_reference_number={order.internal_reference_number} />
                                                    <Btn
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate(`/orders/${order.internal_reference_number}`)}
                                                    >
                                                        Details <LuArrowRight className="ml-1" />
                                                    </Btn>
                                                </div>
                                            </TableCell>
                                        </TableRow>),
                                        ...organization_orders.filter(() => !!order.collapse_open).map((oo: any) => {
                                            var organization = paginated.data.organizations.find((ox: any) => ox.id == oo.organization_id);
                                            if (!organization) {
                                                return null;
                                            }
                                            var org_level_item_status = [...new Set(items.filter(i => i.organization_id == organization.id).map(i => i.status))];
                                            return (<TableRow key={`store_${order.id}_${oo.id}`}>
                                                <TableCell></TableCell>
                                                <TableCell className='text-end'>
                                                    <div className='text-end w-full flex justify-end'>
                                                        <HiOutlineArrowTurnDownRight />
                                                    </div>
                                                </TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>

                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <SafeImage src={organization.logo_short} className='h-6 w-6 object-contain p-1'>
                                                            <span>{nameLetter(organization.name)}</span>
                                                        </SafeImage>

                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{organization.name}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        {oo.internal_reference_number}
                                                        {order.is_renewed && <Badge className="ml-2">Renewed</Badge>}
                                                    </div>
                                                </TableCell>



                                                <TableCell>{oo.items_count == 1 ? '1 Item' : oo.items_count + ' Items'}</TableCell>

                                                <TableCell className="text-right">
                                                    {oo.currency_symbol}{oo.amount}
                                                </TableCell>



                                                <TableCell className="text-right space-x-2" colSpan={3}>
                                                    <div className='flex flex-row gap-1 flex-wrap'>
                                                        {refunds.filter(r => r.organization_id == organization.id).length > 0 && <Badge variant={'outline'}>Refunds {refunds.length}</Badge>}
                                                        {org_level_item_status.map(status => {
                                                            const s_meta = getUserOrderStatusMeta(status);
                                                            const items_count = items.filter(i => i.status == status).length;
                                                            if (items_count == 0) {
                                                                return null;
                                                            }
                                                            return <Badge key={status} variant={'destructive'} className={`${s_meta.bg} ${s_meta.fg} gap-1 flex`}>{s_meta.name} <b>{items_count}</b></Badge>;
                                                        })}
                                                        {issues.filter(s => s.organization_id == organization.id).map(issue => <Badge key={issue.id} variant={'destructive'} className='gap-1 flex'>{getUserOrderIssueTypeName(issue.issue_type)} <b>{issues.length}</b></Badge>)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>);
                                        })

                                    ];
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

