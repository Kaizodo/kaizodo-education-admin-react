import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LuChevronDown, LuListCheck } from "react-icons/lu";
import { getUserOrderStatusMeta, UserOrderStatus, UserOrderStatusArray } from "@/data/order";
import { UserOrderService } from "@/services/UserOrderService";
import { msg } from "@/lib/msg";



export default function StatusDropdown({
    status,
    user_order_item_id,
    onChange,
    order_updates
}: {
    status: UserOrderStatus,
    user_order_item_id: number,
    onChange?: (v: number[]) => void;
    order_updates: UserOrderStatus[]
}) {
    const [updating, setUpdating] = useState(false);
    const [updatedStatus, setUpdateStatus] = useState(status)
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number[]>(order_updates);

    const toggle = (id: number) => {
        const next = selected.includes(id)
            ? selected.filter((x) => x !== id)
            : [...selected, id];
        setSelected(next);
        onChange?.(next);
    };

    const updateStatus = async (selected_status?: UserOrderStatus) => {
        setUpdating(true);
        var r = await UserOrderService.updateOrderItemStatus({
            user_order_item_id,
            status: selected_status,
            status_updates: selected
        });

        if (r.success) {
            msg.success('Status updated');
            setUpdateStatus(r.data.status);
        }
        setUpdating(false);
        return r.success;
    }

    const meta = getUserOrderStatusMeta(updatedStatus);
    if ([
        UserOrderStatus.New,
        UserOrderStatus.Pending,
        UserOrderStatus.ProcessingCompleted,
        UserOrderStatus.ReadyForShipment,
        UserOrderStatus.Dispatched
    ].includes(updatedStatus)) {
        return <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button size={'xs'} variant={'outline'} loading={updating}>{meta.name} <LuChevronDown /></Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-1">
                {UserOrderStatusArray.filter(i => [
                    UserOrderStatus.New,
                    UserOrderStatus.Pending,
                    UserOrderStatus.Processing,
                    UserOrderStatus.ReadyForShipment,
                    UserOrderStatus.Dispatched
                ].includes(i.id)).map(i => <DropdownMenuItem
                    key={i.id}
                    className="cursor-default flex items-center gap-2 py-2"
                    onClick={() => updateStatus(i.id)}
                >{i.name}</DropdownMenuItem>)}
            </DropdownMenuContent>
        </DropdownMenu>
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button size={'xs'} variant={'destructive'}>{`Process (${selected.length})`}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-60 p-2">
                <label className="px-2 py-1 bg-gray-100 rounded-lg border mb-1 hover:bg-accent cursor-pointer select-none w-full flex items-center gap-1">
                    <Checkbox onCheckedChange={checked => setSelected(checked ? [UserOrderStatus.MatchedStock,
                    UserOrderStatus.Picked,
                    UserOrderStatus.LabelAndInvoicePrinted,
                    UserOrderStatus.Packaged] : [])} /> <span>Select all</span>
                </label>
                {UserOrderStatusArray.filter(i => [
                    UserOrderStatus.MatchedStock,
                    UserOrderStatus.Picked,
                    UserOrderStatus.LabelAndInvoicePrinted,
                    UserOrderStatus.Packaged,
                ].includes(i.id)).map((opt) => (
                    <DropdownMenuItem
                        key={opt.id}
                        className="cursor-default flex items-center gap-2 py-2"
                        onClick={(e) => {
                            e.preventDefault();
                            toggle(opt.id);
                        }}
                    >
                        <Checkbox checked={selected.includes(opt.id)} />
                        {opt.name}
                    </DropdownMenuItem>
                ))}

                <div className="flex justify-end gap-2 mt-2">
                    <Button size="xs" variant="outline" asyncClick={async () => {
                        await updateStatus();
                        setOpen(false);
                    }}>
                        Processed <LuListCheck />
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
