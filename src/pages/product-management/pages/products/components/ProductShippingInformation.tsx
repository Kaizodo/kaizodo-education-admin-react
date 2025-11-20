import TextField from "@/components/common/TextField";
import { useState } from "react";
import Btn from "@/components/common/Btn";
import { useForm } from "@/hooks/use-form";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
import Radio from "@/components/common/Radio";
import { YesNoArray } from "@/data/Common";
import { CommonProductStateProps } from '@/data/Product';
import SuggestCourierChannel from "@/components/common/suggest/SuggestCourierChannel";
import NoRecords from "@/components/common/NoRecords";
import { TbTruckOff } from "react-icons/tb";

export default function ProductShippingInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm(state.product);
    const save = async () => {
        setSaving(true);
        const r = await ProductService.saveShippingInformation(form);
        if (r.success) {
            msg.success('Details saved!');
            setStateValue('product')(form);
        }
        setSaving(false);
    }
    return (
        <>
            <Radio value={form.has_shipping} onChange={setValue('has_shipping')} options={YesNoArray} >Has Shipping</Radio>

            {!!form.has_shipping && <>
                <div className=" grid grid-cols-2 max-w-[500px] gap-3">
                    <TextField value={form.package_weight} onChange={setValue('package_weight')} placeholder="Enter weight">Weight (kg)</TextField>
                    <TextField value={form.package_length} onChange={setValue('package_length')} placeholder="Enter length">Length (cm)</TextField>
                    <TextField value={form.package_width} onChange={setValue('package_width')} placeholder="Enter width">Width (cm)</TextField>
                    <TextField value={form.package_height} onChange={setValue('package_height')} placeholder="Enter height">Height (cm)</TextField>
                    <Radio value={form.is_fragile} onChange={setValue('is_fragile')} options={YesNoArray}>Fragile?</Radio>

                </div>
                <div className=" grid grid-cols-2 max-w-[500px] gap-3">
                    <SuggestCourierChannel value={form.courier_channel_id} onChange={setValue('courier_channel_id')} selected={{ id: form.courier_channel_id, name: form.courier_channel_name }} />
                    <TextField value={form.shipping_charge} onChange={setValue('shipping_charge')} placeholder="Enter charge">Shipping Charge</TextField>
                </div>
            </>}
            {!form.has_shipping && <NoRecords
                icon={TbTruckOff}
                title="No Shipping Required"
                subtitle="This will not charge or show shipping releated information"
            />}

            <div className="flex flex-row justify-end w-full">
                <Btn loading={saving} onClick={save}>Save Details</Btn>
            </div>
        </>
    )
}
