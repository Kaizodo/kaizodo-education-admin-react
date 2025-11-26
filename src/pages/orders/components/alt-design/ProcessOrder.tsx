import Btn from '@/components/common/Btn'
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import { OrderDetailState, UserOrderItem } from '@/data/UserOrder'
import { TbFileTextSpark } from 'react-icons/tb'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useForm } from '@/hooks/use-form'
import SafeImage from '@/components/common/SafeImage'
import { AlertTriangle, MapPin, Package, Phone } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LuUser } from 'react-icons/lu'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { msg } from '@/lib/msg'
import { UserOrderService } from '@/services/UserOrderService'


export default function ProcessOrder({ state, selected, onSuccess }: { selected: number[], state: OrderDetailState, onSuccess: () => void }) {
    const [form, setValue] = useForm({
        items: state.order_items.filter(i => selected.includes(i.id)).map(i => ({
            ...i,
            selected_quantity: i.quantity_unlocked
        })),
        cancel_items: false

    });

    const missingItems = form.items.filter(i => i.selected_quantity < i.quantity_unlocked);

    const singleItemCalculation = (item: UserOrderItem) => {
        var total = Number(item.total_amount) / item.quantity;
        var base = Number(item.base) / item.quantity;
        var tax = Number(item.tax) / item.quantity;

        return { total, base, tax }
    }


    const calculations = form.items.filter(i => i.selected_quantity > 0).map(i => ({
        quantity: i.selected_quantity,
        ...singleItemCalculation(i)
    }));

    const subtotal = calculations.reduce((pv, cv) => pv += cv.base * cv.quantity, 0);
    const tax = calculations.reduce((pv, cv) => pv += cv.tax * cv.quantity, 0);
    const total = calculations.reduce((pv, cv) => pv += cv.total * cv.quantity, 0);

    return (<>
        <ModalBody className='p-0 flex flex-row gap-0'>
            <div className='flex-1 bg-white'>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50">

                            <TableHead className="w-20">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-center">Qty</TableHead>

                            <TableHead className="text-center">Process Qty</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {form.items.map((item) => {
                            const calculation = singleItemCalculation(item);
                            return (
                                <TableRow
                                    key={item.id}

                                >

                                    <TableCell>
                                        <SafeImage src={item.image} className="w-10 h-10 object-contain  overflow-hidden rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
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
                                        <span>{item.quantity_unlocked}</span>
                                    </TableCell>
                                    <TableCell className="text-right font-medium w-[150px]">
                                        <Input
                                            type='number'
                                            value={item.selected_quantity}
                                            max={item.quantity_unlocked}
                                            min={0}
                                            onChange={e => setValue(`items[id:${item.id}].selected_quantity`)(Number(e.target.value) > item.quantity_unlocked ? item.quantity_unlocked : Number(e.target.value) < 0 ? 0 : e.target.value)} />
                                    </TableCell>

                                    <TableCell className="text-right font-semibold">
                                        {state.order.currency_symbol}{Number(calculation.total) * item.selected_quantity}
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <div className='w-full max-w-[350px] border-s'>
                <ScrollArea className="flex-1">
                    <div className="p-5 space-y-6">
                        {/* Customer Details */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Customer</h4>
                            <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <LuUser className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="font-medium text-sm">{state?.order?.first_name} {state.order.last_name}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <span className="text-sm text-slate-600 leading-relaxed">{state?.order?.address}</span>
                                </div>
                                {state?.order?.mobile && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <Phone className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <span className="text-sm text-slate-600">{state.order.mobile}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Calculations */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Order Value</h4>
                            <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium">{state.order.currency_symbol}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax</span>
                                    <span className="font-medium">{state.order.currency_symbol}{tax.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2" />
                                <div className="flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-lg text-indigo-600">{state.order.currency_symbol}{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Missing Items */}
                        {missingItems.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    <h4 className="font-semibold text-amber-700 text-sm">Incomplete Items</h4>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-4 space-y-2 border border-amber-200">
                                    {missingItems.map(item => {
                                        const missing = item.quantity_unlocked - item.selected_quantity
                                        return (<div key={item.id} className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-amber-900">{item.name}</span>
                                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                                {missing} missing
                                            </span>
                                        </div>);
                                    })}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={form.cancel_items}
                                            onCheckedChange={setValue('cancel_items')}
                                            className="border-amber-400"
                                        />
                                        <span className="text-xs text-amber-700">Cancel remaining items</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </ModalBody>
        <ModalFooter className=' gap-3'>
            <div className='flex flex-row items-center gap-1 text-xs flex-1 text-gray-600'>
                <TbFileTextSpark />
                <span>Shipment labels will also be generated</span>
            </div>
            <Btn size={'sm'} asyncClick={async () => {
                await msg.confirm('Confirm Generate invoice', 'You are about to generate invoice', {
                    onConfirm: async () => {
                        var r = await UserOrderService.generateInvoice({
                            user_order_id: state.order.id,
                            items: form.items.map(i => ({
                                id: i.id,
                                quantity: i.selected_quantity
                            })),
                            cancel_items: form.cancel_items
                        });
                        if (r.success) {
                            onSuccess();
                        }
                        return r.success;
                    },
                })
            }}>Generate Invoice</Btn>
        </ModalFooter>
    </>)
}
