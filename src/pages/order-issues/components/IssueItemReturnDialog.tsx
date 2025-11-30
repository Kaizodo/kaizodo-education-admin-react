import Btn from '@/components/common/Btn';
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import { UserOrderService } from '@/services/UserOrderService';
import { LuCornerDownLeft } from 'react-icons/lu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import SafeImage from '@/components/common/SafeImage';
import { Package } from 'lucide-react';
import { useForm } from '@/hooks/use-form';
import { Switch } from '@/components/ui/switch';
import TextField from '@/components/common/TextField';
import { OrderIssueDetailState } from '@/data/order-issue';
export default function IssueItemReturnDialog({ state, onSuccess }: { state: OrderIssueDetailState, onSuccess: () => void }) {
    const [form, setValue, setForm] = useForm({
        remarks: '',
        items: state.user_order_issue_items.map(i => ({
            ...i,
            quantity_returned: i.quantity,
            update_stock: true
        }))
    });

    const all = form.items.every(i => i.update_stock);
    const toggleAll = (val: boolean) => {
        setForm({
            items: form.items.map(i => ({ ...i, update_stock: val })),
            remarks: ''
        });
    };

    return (
        <>
            <ModalBody className='p-0'>
                <div className='bg-white border-b'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[48px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="w-40">Returned</TableHead>
                                <TableHead className='w-[120px] text-center'>
                                    <div>
                                        <span className='text-xs'>Update Stock</span>
                                        <Switch checked={all} onCheckedChange={toggleAll} />
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {form.items.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <SafeImage src={p.image} className="min-w-12 min-h-12 shrink-0 grow-0 p-1 rounded-lg bg-white border border-gray-200 flex items-center justify-center object-contain">
                                            <Package className="w-6 h-6 text-gray-400" />
                                        </SafeImage>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{p.name}</span>
                                            <span className="text-sm text-muted-foreground">ID: {p.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{p.quantity}</TableCell>
                                    <TableCell>{p.sku}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                max={p.quantity}
                                                step={1}
                                                value={p.quantity_returned}
                                                onChange={(e) => setValue(`items[id:${p.id}].quantity_returned`)(e.target.value)}
                                            />
                                            <div className="text-sm text-muted-foreground text-nowrap">
                                                / {p.quantity}
                                            </div>
                                        </div>

                                    </TableCell>
                                    <TableCell className='w-[120px] text-center'>
                                        <Switch checked={p.update_stock} onCheckedChange={setValue(`items[id:${p.id}].update_stock`)} />
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </div>
                <div className='p-3'>
                    <div className='p-3 w-full bg-sky-50 border-sky-400 border rounded-lg'>
                        <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter remarks / Notes' multiline>Remarks / Notes</TextField>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                    var r = await UserOrderService.handleIssueReceivedItemStock({
                        user_order_issue_id: state.user_order_issue.id,
                        remarks: form.remarks,
                        items: form.items.map(i => ({
                            id: i.id,
                            quantity_returned: i.quantity_returned,
                            update_stock: i.update_stock
                        }))
                    });
                    if (r.success) {
                        onSuccess();
                    }
                    return r.success;
                }}>Items Returned<LuCornerDownLeft /></Btn>
            </ModalFooter>
        </>
    )
}
