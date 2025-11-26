import { Organization } from '@/data/Organization';
import { OrderDetailState, UserOrderItem } from '@/data/UserOrder';
import { UserOrderService } from '@/services/UserOrderService';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import CreateShipmentDialog from './components/CreateShipmentDialog';
import { Modal } from '@/components/common/Modal';
import OrderIssueDialog from './components/OrderIssueDialog';
import DetailSkeleton from './components/OrderDetailSkeleton';
import AppPage from '@/components/app/AppPage';
import { formatDateTime } from '@/lib/utils';
import DownloadInvoiceBtn from './components/DownloadInvoiceBtn';
import CustomerInformationCard from './components/alt-design/CustomerInformationCard';
import OrderValueCard from './components/alt-design/OrderValueCard';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import SafeImage from '@/components/common/SafeImage';
import { Package, Store } from 'lucide-react';
import Btn from '@/components/common/Btn';
import { LuDownload } from 'react-icons/lu';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@/hooks/use-form';
import InvoicesCard from './components/alt-design/InvoicesCard';
import CancellationCard from './components/alt-design/CancellationCard';
import FloatingSelectionBar from './components/alt-design/FloatingSelectionBar';
import ProcessOrder from './components/alt-design/ProcessOrder';
import StatusDropdown from './components/alt-design/StatusCheck';
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



    const openNewShipmentForm = (organization: Organization, items: UserOrderItem[]) => {
        const modal_id = Modal.show({
            title: 'Add Shipment',
            subtitle: `#${state?.order.internal_reference_number}`,
            maxWidth: 600,
            content: () => <CreateShipmentDialog
                user_order_id={state?.order.id}
                organization={organization}
                items={items.filter(i => !!i.has_shipping && i.quantity_unlocked > 0)}
                currency_code={state?.order.currency_code}
                currency_symbol={state?.order.currency_symbol}
                onSuccess={() => {
                    Modal.close(modal_id);
                    load();
                }}

            />

        })
    }

    const openOrderIssueForm = (organization: Organization, items: UserOrderItem[]) => {
        const modal_id = Modal.show({
            title: 'New Order Issue',
            subtitle: `#${state?.order.internal_reference_number}`,
            maxWidth: 600,
            content: () => <OrderIssueDialog
                user_order_id={state?.order.id ?? 0}
                organization={organization}
                items={items.filter(i => !!i.has_shipping && i.quantity_unlocked > 0)}
                currency_code={state?.order.currency_code ?? ''}
                currency_symbol={state?.order.currency_symbol ?? ''}
                onSuccess={() => {
                    Modal.close(modal_id);
                    load();
                }}

            />

        })
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






    const has_shipments = state.order_items.filter(i => !!i.has_shipping).length > 0;

    return (<AppPage
        enableBack={true}
        backRoute={'/orders'}
        title={'Order #' + state.order.internal_reference_number}
        subtitle={`Placed on ${formatDateTime(state.order.created_at)}`}
        containerClassName='space-y-3'
    >
        <div className='grid grid-cols-2 gap-6'>
            <CustomerInformationCard state={state} />
            <OrderValueCard order={state.order} />
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
                    <Btn variant={'outline'} size={'sm'}>Download List <LuDownload /></Btn>
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
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                className={`transition-colors ${form.selected.includes(item.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}
                            >
                                <TableCell>
                                    <Checkbox
                                        disabled={item.quantity_unlocked <= 0}
                                        checked={form.selected.includes(item.id)}
                                        onCheckedChange={checked => checked ? setValue('selected', 'selected[]')(form.selected.filter(s => items.filter(i => i.organization_id == organization.id).map(i => i.id).includes(s)), item.id) : setValue('selected')(form.selected.filter(s => s !== item.id))}
                                        className="border-slate-300"
                                    />
                                </TableCell>
                                <TableCell>
                                    <SafeImage src={item.image} className="w-16 h-16 min-h-16 min-w-16 grow-0 object-contain p-1 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </SafeImage>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium text-slate-900">{item.name}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-slate-500 font-mono text-sm">{item.sku}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold">{item.quantity}</span>
                                    {item.quantity_unlocked < item.quantity && (
                                        <span className="text-xs text-slate-500 block">
                                            ({item.quantity - item.quantity_unlocked} invoiced)
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
                                <TableCell className="text-center">
                                    <StatusDropdown user_order_item_id={item.id} status={item.status} order_updates={state.user_order_item_statuses.filter(i => i.user_order_item_id == item.id).map(i => i.status)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>);
        })}

        <div className='grid grid-cols-2 gap-6'>
            <InvoicesCard />
            <CancellationCard cancellations={[]} />
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
                    }}
                />
            })
        }} onClear={() => setValue('selected')([])} />
    </AppPage>);


}
