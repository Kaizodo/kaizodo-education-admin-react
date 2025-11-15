import TextField from "@/components/common/TextField";
import SuggestProductCategory from "@/components/common/suggest/SuggestProductCategory";
import { useState } from "react";
import Richtext from "@/components/common/Richtext";
import Btn from "@/components/common/Btn";
import { useForm } from "@/hooks/use-form";
import { CommonProductStateProps } from './ProductEditorForm'
import { ProductPaymentTypeArray, ProductType, ProductTypeArray } from "@/data/Product";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
import SuggestUnit from "@/components/common/suggest/SuggestUnit";
import Radio from "@/components/common/Radio";

export default function ProductBasicInformation({ state, setState, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm(state.product);
    const save = async () => {
        setSaving(true);
        const r = await ProductService.saveBasicInformation(form);
        if (r.success) {
            msg.success('Details saved!');
            setStateValue('product')(form);
        }
        setSaving(false);
    }
    return (
        <>
            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3 ">
                    <TextField value={form.name} onChange={setValue('name')} placeholder="Enter product name">Product Name</TextField>
                </div>
                <div>
                    <Radio value={form.is_draft} onChange={setValue('is_draft')} options={[{ id: 1, name: 'Draft' }, { id: 0, name: 'Publish' }]} >Publising Status</Radio>
                </div>
            </div>


            <div className=" grid grid-cols-4 gap-3">
                <Radio value={form.product_type} onChange={setValue('product_type')} options={ProductTypeArray} >Product Type</Radio>
                <TextField value={form.quantity} onChange={setValue('quantity')} placeholder="Enter quantity" type="number">Quantity</TextField>
                <SuggestUnit value={form.unit_id} onChange={setValue('unit_id')} selected={{ id: form.unit_id, name: form.unit_name }} />
                {form.product_type === ProductType.Service && <>
                    <Radio value={form.product_payment_type} onChange={setValue('product_payment_type')} options={ProductPaymentTypeArray} >Payment Type</Radio>
                </>}
                <TextField value={form.code} onChange={setValue('code')} placeholder="Enter product code" >Product Code</TextField>
                {form.product_type === ProductType.Goods && <>
                    <TextField value={form.sku} onChange={setValue('sku')} placeholder="Enter sku ">SKU (Stock Keeping Unit)</TextField>
                    <TextField value={form.barcode} onChange={setValue('barcode')} placeholder="Enter barcode" >Barcode</TextField>
                    <TextField value={form.ean} onChange={setValue('ean')} placeholder="Enter ean">EAN (Article Number)</TextField>
                </>}

            </div>
            <div className="  space-y-3 pb-3">
                <TextField value={form.description} onChange={setValue('description')} multiline placeholder="Enter short description max 160">Short Description</TextField>
                <Richtext value={form.content} onChange={setValue('content')}>Product Description</Richtext>
            </div>
            <div className="flex flex-row justify-end w-full">
                <Btn loading={saving} onClick={save}>Save Details</Btn>
            </div>
        </>
    )
}
