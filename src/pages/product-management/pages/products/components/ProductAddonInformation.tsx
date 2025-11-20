import { useState } from "react";
import Btn from "@/components/common/Btn";
import { useForm } from "@/hooks/use-form";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
import { CommonProductStateProps } from '@/data/Product';
import { LuCamera, LuPlus, LuSave, LuX } from "react-icons/lu";
import SuggestProduct from "@/components/common/suggest/SuggestProduct";
import NoRecords from "@/components/common/NoRecords";
import { TbHeartPlus } from "react-icons/tb";
import SafeImage from "@/components/common/SafeImage";
import { Badge } from "@/components/ui/badge";

export default function ProductAddonInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm<any>({});
    const save = async () => {
        setSaving(true);
        const r = await ProductService.saveAddonInformation({
            product_id: state.product.id,
            addon_product_ids: state.product_addons.map(pa => pa.id)
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
                    <SuggestProduct
                        exclude_ids={[...state.product_addons.map(pa => pa.id), state.product.id]}
                        value={form.product_id}
                        onChange={setValue('product_id')}
                        onSelect={setValue('product')}
                    >Search addon product</SuggestProduct>
                </div>
                <Btn disabled={!form.product_id} onClick={() => {
                    setStateValue('product_addons[]')(form.product);
                    setValue('product_id', 'product')();
                }}><LuPlus />Add Addon</Btn>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {state.product_addons.map(record => {
                    return <div className='flex flex-row gap-2 border  p-2 rounded-lg items-center' key={record.id}>
                        <span>#{record.id}</span>
                        <SafeImage src={record?.media?.media_path} className="h-12 w-12 rounded-md border object-cover">
                            <div className="text-2xl flex items-center justify-center flex-1  h-full w-full text-gray-400">
                                <LuCamera />
                            </div>
                        </SafeImage>
                        <div className="flex flex-col flex-1">
                            <div className="flex flex-row items-center gap-1">
                                <span>{record.name}</span>
                                {!!record.product_id && <Badge>Cloned</Badge>}
                            </div>
                            {!!record.product_id && <div className="text-xs text-gray-500">
                                <span>Clone of </span>
                                <span className="text-blue-700 font-medium cursor-pointer hover:text-blue-900">{record.main_product_name}</span>
                            </div>}
                        </div>
                        <Btn size={'xs'} variant={'destructive'} onClick={() => setStateValue('product_addons')(state.product_addons.filter(pa => (pa.id !== record.id) || !pa.id))}><LuX /></Btn>
                    </div>
                })}
            </div>
            {state.product_addons.length == 0 && <NoRecords icon={TbHeartPlus} title="Add Addons" subtitle="Try adding some addons on product" />}
            <div className="flex flex-row justify-end w-full">
                <Btn loading={saving} onClick={save}><LuSave />Save Addons</Btn>
            </div>
        </>
    )
}
