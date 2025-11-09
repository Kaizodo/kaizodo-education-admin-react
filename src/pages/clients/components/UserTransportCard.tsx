import AppCard from "@/components/app/AppCard"
import Btn from "@/components/common/Btn"
import CenterLoading from "@/components/common/CenterLoading"
import Checkable from "@/components/common/Checkable"
import SuggestPickupPoint from "@/components/common/suggest/SuggestPickupPoint"
import SuggestRoute from "@/components/common/suggest/SuggestRoute"
import { useSetValue } from "@/hooks/use-set-value"
import { msg } from "@/lib/msg"
import { UserService } from "@/services/UserService"
import moment from "moment"
import { useEffect, useState } from "react"

type Props = {
    id: number
}

export default function UserTransportCard({ id }: Props) {
    const months = moment.localeData().months();
    const [form, setForm] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const detail = async () => {
        setLoading(true);
        var r = await UserService.getTransportDetail(id);
        if (r.success) {
            setForm(r.data);
        }
        setLoading(false);
    }

    const save = async () => {
        setSaving(true);
        var r = await UserService.saveTransportDetail({
            user_id: id,
            route_id: form.route_id,
            pickup_point_id: form.pickup_point_id,
            months: form.months
        });

        if (r.success) {
            msg.success('Transport fee details saved');
        }

        setSaving(false);
    }

    useEffect(() => {
        detail();
    }, [])

    return (
        <div className="flex flex-col gap-3">
            <AppCard title="Transport Details">
                {loading && <CenterLoading className='relative h-[400px]' />}
                {!loading && <div className="pb-4 px-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <SuggestRoute value={form.route_id} selected={{ id: form.route_id, name: form.route_name }} onChange={setValue('route_id')} />
                        <SuggestPickupPoint value={form.pickup_point_id} route_id={form.route_id} selected={{ id: form.pickup_point_id, name: form.pickup_point_name }} onChange={setValue('pickup_point_id')} onSelect={(selected) => {
                            setValue('amount', 'vehicle_name', 'route_name', 'distance', 'pickup_point_name')(selected.amount, selected.vehicle_name, selected.route_name, selected.distance, selected.name);
                        }} />
                    </div>
                    <div className="border p-2 rounded-lg">
                        <Checkable
                            size="sm"
                            value={form.months || []}
                            onChange={setValue('months')}
                            options={months.map((m, mi) => ({
                                id: mi,
                                name: m
                            }))}
                        >Transport fee months</Checkable>
                    </div>
                    <div className="flex flex-row justify-between">
                        {!!form.pickup_point_id && <div className="flex flex-col">
                            <span className="font-bold text-sm">{form.pickup_point_name} / {form.vehicle_name} / {Number(form.distance / 1000).toFixed(2)} KM</span>
                            <span className="text-red-500  text-xs">₹{form.amount}</span>
                        </div>}
                        <Btn size="sm" onClick={save} loading={saving}>Update</Btn>
                    </div>
                </div>}
            </AppCard>

        </div>
    )
}
