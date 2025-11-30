import { Organization } from '@/data/Organization';
import { OrderDetailState } from '@/data/UserOrder';
import { UserOrderService } from '@/services/UserOrderService';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal } from '@/components/common/Modal';

import DetailSkeleton from './components/OrderDetailSkeleton';
import AppPage from '@/components/app/AppPage';
import { cn, formatDateTime } from '@/lib/utils';
import CustomerInformationCard from './components/alt-design/CustomerInformationCard';
import OrderValueCard from './components/alt-design/OrderValueCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import SafeImage from '@/components/common/SafeImage';
import { Package, Store } from 'lucide-react';
import Btn from '@/components/common/Btn';
import { LuArrowRight, LuSquare, LuSquareCheck } from 'react-icons/lu';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@/hooks/use-form';
import InvoicesCard from './components/alt-design/InvoicesCard';
import FloatingSelectionBar from './components/alt-design/FloatingSelectionBar';
import ProcessOrder from './components/alt-design/ProcessOrder';
import StatusDropdown from './components/alt-design/StatusCheck';
import DownloadListBtn from './components/DownloadListBtn';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getUserOrderIssueTypeName, getUserOrderStatusMeta, UserOrderIssueType, UserOrderStatus } from '@/data/order';
import CancellationCard from './components/alt-design/CancellationCard';
import ShipmentsCard from './components/alt-design/ShipmentsCard';
import PartyInformationCard from './components/alt-design/PartyInformationCard';
export default function UserOrderDetail() {
    const navigate = useNavigate();
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<OrderDetailState>();
    const [form, setValue] = useForm<{
        selected: number[],
    }>({
        selected: []
    });

    const load = async () => {
        setLoading(true);
        var r = await UserOrderService.detail(internal_reference_number ?? '');
        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            navigate(-1);
        }
    }



    useEffect(() => {
        if (!internal_reference_number) {
            return;
        }
        load();
    }, [internal_reference_number])

    if (loading || !state) {
        return <DetailSkeleton />
    }



    return (<AppPage
        enableBack={true}
        backRoute={'/orders'}
        title={'Order #' + state.order.internal_reference_number}
        subtitle={`Placed on ${formatDateTime(state.order.created_at)}`}
        containerClassName='space-y-3'
    >
        <div className='grid grid-cols-3 gap-6'>
            <CustomerInformationCard state={state} />
            <PartyInformationCard state={state} />
            <OrderValueCard state={state} />
        </div>
        <span className='uppercase font-medium flex'>ITEMS IN ORDER</span>
        {state.organizations.map((organization: Organization) => {
            var items = state.order_items.filter(i => i.organization_id == organization.id);

            const set = new Set(items.filter(i => i.quantity_unlocked > 0).map(i => i.id));
            var all_checked = form.selected.length !== items.filter(i => i.quantity_unlocked > 0).length ? false : form.selected.length > 0 ? form.selected.every(id => set.has(id)) : false;

            return (<div className='bg-white shadow-lg rounded-lg'>
                <div className="flex items-center gap-2  p-3 border-b">
                    <SafeImage src={organization.logo_short} className="w-8 h-8 p-1 object-contain rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Store className="w-4 h-4 text-indigo-600" />
                    </SafeImage>
                    <h3 className="font-semibold text-gray-900 flex-1">{organization.name}</h3>
                    <DownloadListBtn internal_reference_number={state.order.internal_reference_number} organization_id={organization.id} />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50">
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={all_checked}
                                    onCheckedChange={checked => setValue('selected')(checked ? items.filter(i => i.quantity_unlocked > 0).map(i => i.id) : [])}
                                    className="border-slate-300"
                                />
                            </TableHead>
                            <TableHead className="w-20">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Discount</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Updates</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-end">
                                <Btn
                                    variant={all_checked ? 'default' : 'outline'}
                                    size={'xs'}
                                    onClick={() => setValue('selected')(all_checked ? [] : items.filter(i => i.quantity_unlocked > 0).map(i => i.id))}
                                >Process All</Btn>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => {
                            var invoices = state.invoices.filter(i => state.invoice_items.filter(ii => ii.invoice_id == i.id).map(ii => ii.user_order_item_id).includes(item.id));
                            var issues = state.user_order_issues.filter(uoi => state.user_order_issue_items.filter(uoii => uoii.user_order_issue_id == uoi.id).map(ii => ii.user_order_item_id).includes(item.id));
                            var checked = form.selected.includes(item.id);
                            var remaining_count = item.quantity_unlocked;
                            var invoiced_count = state.invoice_items.filter(ii => invoices.filter(i => i.status !== UserOrderStatus.Cancelled).map(i => i.id).includes(ii.invoice_id)).reduce((pv, cv) => pv += cv.quantity, 0);
                            var cancelled_count = state.user_order_issue_items.filter(uoii => issues.filter(i => i.issue_type === UserOrderIssueType.Cancellation && i.order_cancelled == 1).map(i => i.id).includes(uoii.user_order_issue_id)).reduce((pv, cv) => pv += cv.quantity, 0);
                            var returns_count = state.user_order_issue_items.filter(uoii => issues.filter(i => i.issue_type === UserOrderIssueType.Return).map(i => i.id).includes(uoii.user_order_issue_id)).reduce((pv, cv) => pv += cv.quantity, 0);
                            var replacement_count = state.user_order_issue_items.filter(uoii => issues.filter(i => i.issue_type === UserOrderIssueType.Replacement).map(i => i.id).includes(uoii.user_order_issue_id)).reduce((pv, cv) => pv += cv.quantity, 0);
                            var shipment = state.shipments.find(s => !!s.items.find(i => i.user_order_item_id == item.id) && s.status !== UserOrderStatus.Cancelled);

                            return (<TableRow
                                key={item.id}
                                className={cn(
                                    `transition-colors 'hover:bg-slate-50/50`,
                                    form.selected.includes(item.id) && `bg-indigo-50/50`,
                                    item.quantity_unlocked == 0 && "bg-green-50"
                                )}
                            >
                                <TableCell>
                                    <Checkbox
                                        disabled={item.quantity_unlocked <= 0}
                                        checked={checked}
                                        onCheckedChange={checked_new => checked_new ? setValue('selected', 'selected[]')(form.selected.filter(s => items.filter(i => i.organization_id == organization.id).map(i => i.id).includes(s)), item.id) : setValue('selected')(form.selected.filter(s => s !== item.id))}
                                        className="border-slate-300"
                                    />
                                </TableCell>
                                <TableCell>
                                    <SafeImage src={item.image} className="w-16 h-16 min-h-16 min-w-16 grow-0 object-contain p-1 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </SafeImage>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-col'>
                                        <span className="font-medium text-slate-900">{item.name}</span>
                                        <span className='text-xs text-gray-600'>{item.product_category_name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-slate-500 font-mono text-sm">{item.sku}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold">{item.quantity}</span>

                                    <div className="text-xs text-slate-500 flex flex-col">
                                        {remaining_count > 0 && remaining_count !== item.quantity && (
                                            <span>{remaining_count} Unhandled</span>
                                        )}

                                        {invoiced_count > 0 && <span>{invoiced_count} Invoiced</span>}
                                        {cancelled_count > 0 && <span className="text-red-600">{cancelled_count} Cancelled</span>}
                                        {returns_count > 0 && <span className="text-orange-600">{returns_count} Returned</span>}
                                        {replacement_count > 0 && <span className="text-blue-600">{replacement_count} Replaced</span>}
                                    </div>

                                    {item.quantity_unlocked < item.quantity && (
                                        <span className="text-xs text-slate-500 block">
                                            ({item.quantity - item.quantity_unlocked} processed)
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="text-right font-medium">
                                    {state.order.currency_symbol}{item.sp}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.discount_amount > 0 ? (
                                        <span className="text-emerald-600">-{state.order.currency_symbol}{item.discount_amount}</span>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {state.order.currency_symbol}{item.total_amount}
                                </TableCell>
                                <TableCell className="text-center font-semibold">
                                    {invoices.length == 0 && issues.length == 0 && <span className='italic text-xs text-gray-600 font-normal'>No Updates Yet</span>}
                                    {(invoices.length > 0 || issues.length > 0) && <div className="flex flex-col gap-1 items-center justify-center">

                                        <HoverCard openDelay={0} closeDelay={0}>
                                            <HoverCardTrigger>
                                                <div className="min-w-[70px] px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded cursor-pointer hover:bg-sky-200">
                                                    {invoices.length} Invoices
                                                </div>
                                            </HoverCardTrigger>

                                            <HoverCardContent className="p-2 space-y-1.5 w-56">
                                                {invoices.map(inv => (
                                                    <Link
                                                        key={inv.id}
                                                        to={`/invoices/${inv.internal_reference_number}`}
                                                        className="bg-sky-50 border border-sky-300 rounded p-1 w-full flex flex-col hover:bg-sky-100 transition"
                                                    >
                                                        <span className="text-[10px] text-sky-800 font-medium">Invoice</span>
                                                        <span className="text-xs">{inv.internal_reference_number}</span>
                                                    </Link>
                                                ))}
                                            </HoverCardContent>
                                        </HoverCard>

                                        {issues.length > 0 && (
                                            <HoverCard openDelay={0} closeDelay={0}>
                                                <HoverCardTrigger>
                                                    <div className="min-w-[70px] px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded cursor-pointer hover:bg-rose-200">
                                                        {issues.length} Issues
                                                    </div>
                                                </HoverCardTrigger>

                                                <HoverCardContent className="p-2 space-y-1.5 w-56">
                                                    {issues.map(issue => (
                                                        <Link
                                                            key={issue.id}
                                                            to={`/order-issue/${issue.internal_reference_number}`}
                                                            className="bg-rose-50 border border-rose-300 rounded p-1 w-full flex flex-col hover:bg-rose-100 transition"
                                                        >
                                                            <span className="text-[10px] text-rose-800 font-medium">
                                                                {getUserOrderIssueTypeName(issue.issue_type)}
                                                            </span>
                                                            <span className="text-xs">{issue.internal_reference_number}</span>
                                                        </Link>
                                                    ))}
                                                </HoverCardContent>
                                            </HoverCard>
                                        )}

                                    </div>}
                                </TableCell>



                                <TableCell className="text-center">
                                    <StatusDropdown user_order_item_id={item.id} status={item.status} order_updates={state.user_order_item_statuses.filter(i => i.user_order_item_id == item.id).map(i => i.status)} />
                                </TableCell>
                                <TableCell className="text-end">
                                    {shipment && (() => {
                                        const meta = getUserOrderStatusMeta(shipment.status);
                                        return <div className='flex flex-col gap-1 items-end'>
                                            <span className={`${meta.bg} ${meta.fg} flex px-2 rounded-lg text-xs`}>{meta?.name}</span>
                                            <Link to={'/shipments/' + shipment.internal_reference_number}>
                                                <Btn
                                                    size={'xs'}
                                                    variant={'destructive'}
                                                >View Details <LuArrowRight /></Btn>
                                            </Link>
                                        </div>
                                    })()}
                                    {!shipment && <Btn
                                        size={'xs'}
                                        variant={checked ? 'default' : 'outline'}
                                        disabled={item.quantity_unlocked <= 0}
                                        onClick={() => checked ? setValue('selected')(form.selected.filter(s => s !== item.id)) : setValue('selected', 'selected[]')(form.selected.filter(s => items.filter(i => i.organization_id == organization.id).map(i => i.id).includes(s)), item.id)}
                                    >Process {checked ? <LuSquareCheck /> : <LuSquare />}</Btn>}
                                </TableCell>
                            </TableRow>);
                        })}
                    </TableBody>
                </Table>
            </div>);
        })}

        <div className='grid grid-cols-3 gap-6'>
            <InvoicesCard state={state} />
            <ShipmentsCard state={state} />
            <CancellationCard state={state} />
        </div>
        <FloatingSelectionBar count={form.selected.length} onProcess={() => {
            const modal_id = Modal.show({
                title: `Process Selected Items | ${state.order.internal_reference_number}`,
                subtitle: `You have selected ${form.selected.length} items`,
                maxWidth: 1200,
                content: () => <ProcessOrder
                    state={state}
                    selected={form.selected}
                    onSuccess={() => {
                        Modal.close(modal_id);
                        load();
                        setValue('selected')([])
                    }}
                />
            })
        }} onClear={() => setValue('selected')([])} />
    </AppPage>);


}
