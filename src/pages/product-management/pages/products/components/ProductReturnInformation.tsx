import TextField from "@/components/common/TextField";
import { useState } from "react";
import Btn from "@/components/common/Btn";
import { useForm } from "@/hooks/use-form";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
import Radio from "@/components/common/Radio";
import { YesNoArray } from "@/data/Common";
import { CommonProductStateProps } from '@/data/Product';
import NoRecords from "@/components/common/NoRecords";
import Richtext from "@/components/common/Richtext";
import { LuX } from "react-icons/lu";

export default function ProductReturnInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm(state.product);

    const save = async () => {
        setSaving(true);
        const r = await ProductService.saveReturnInformation(form);
        if (r.success) {
            msg.success('Details saved!');
            setStateValue('product')(form);
        }
        setSaving(false);
    }

    return (
        <>
            <Radio value={form.has_return} onChange={setValue('has_return')} options={YesNoArray}>
                Allow Returns / Replacements ?
            </Radio>

            {!!form.has_return && <>
                <div className=" max-w-[500px]">

                    <TextField
                        type="number"
                        value={form.return_duration_days}
                        onChange={setValue('return_duration_days')}
                        placeholder="Enter days"
                    >
                        Return / Replacement Window (days)
                    </TextField>

                </div>
                <Richtext

                    value={form.return_policy_content}
                    onChange={setValue('return_policy_content')}
                >Return / Replacement Policy & Terms</Richtext>
            </>}

            {!form.has_return && (
                <NoRecords
                    icon={LuX}
                    title="No Returns"
                    subtitle="Returns and replacement not allowed on this product"
                />
            )}

            <div className="flex flex-row justify-end w-full">
                <Btn loading={saving} onClick={save}>Save Details</Btn>
            </div>
        </>
    )
}
