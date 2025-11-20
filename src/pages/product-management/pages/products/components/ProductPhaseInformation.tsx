import { useState } from "react";
import Btn from "@/components/common/Btn";
import { useForm } from "@/hooks/use-form";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
import { CommonProductStateProps } from '@/data/Product';
import { LuPlus, LuSave, LuX } from "react-icons/lu";
import NoRecords from "@/components/common/NoRecords";
import SuggestPhase from "@/components/common/suggest/SuggestPhase";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

export default function ProductPhaseInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm<any>({});
    const save = async () => {
        setSaving(true);
        const r = await ProductService.savePhasesInformation({
            product_id: state.product.id,
            phase_ids: state.product_phases.map(pa => pa.id)
        });
        if (r.success) {
            msg.success('Details saved!');
            setStateValue('product')(form);
        }
        setSaving(false);
    }
    return (
        <>
            <div className="flex flex-row items-end gap-3 max-w-[450px] p-2 border bg-sky-50 border-sky-300 rounded-lg">
                <div className="flex-1">
                    <SuggestPhase
                        exclude_ids={[...state.product_phases.map(pa => pa.id), state.product.id]}
                        value={form.phase_id}
                        onChange={setValue('phase_id')}
                        onSelect={setValue('phase')}
                    >Search installation phase</SuggestPhase>

                </div>
                <Btn disabled={!form.phase_id} onClick={() => {
                    setStateValue('product_phases[]')(form.phase);
                    setValue('phase_id', 'phase')();
                }}><LuPlus />Add Phase</Btn>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {state.product_phases.map(record => {
                    return <div className='flex flex-row gap-2 border  p-2 rounded-lg items-center' key={record.id}>

                        <div className="flex flex-col flex-1">
                            <div className="flex flex-row items-center gap-1">
                                <span>{record.name}</span>
                            </div>

                        </div>
                        <Btn size={'xs'} variant={'destructive'} onClick={() => setStateValue('product_phases')(state.product_phases.filter(pa => (pa.id !== record.id) || !pa.id))}><LuX /></Btn>
                    </div>
                })}
            </div>
            {state.product_phases.length == 0 && <NoRecords icon={HiOutlineWrenchScrewdriver} title="Add Phases" subtitle="Try adding some addons on product" />}
            <div className="flex flex-row justify-end w-full">
                <Btn loading={saving} onClick={save}><LuSave />Save Installation Phases</Btn>
            </div>
        </>
    )
}
