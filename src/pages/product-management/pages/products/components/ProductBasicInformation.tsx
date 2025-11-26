import TextField from "@/components/common/TextField";
import { useState } from "react";
import Richtext from "@/components/common/Richtext";
import Btn from "@/components/common/Btn";
import { useForm } from "@/hooks/use-form";
import { ProductPaymentTypeArray, ProductType, ProductTypeArray } from "@/data/Product";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
import SuggestUnit from "@/components/common/suggest/SuggestUnit";
import Radio from "@/components/common/Radio";
import { YesNoArray } from "@/data/Common";
import { CommonProductStateProps } from '@/data/Product';
import SuggestStore from "@/components/common/suggest/SuggestStore";

export default function ProductBasicInformation({ state, setStateValue }: CommonProductStateProps) {
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
                <div>
                    <SuggestStore value={form.organization_id} onChange={setValue('organization_id')} selected={{
                        id: state?.product?.organization_id,
                        name: state?.product?.organization_name,
                        image: state?.product?.organization_logo_short
                    }} />
                </div>
                <div className="col-span-2">
                    <TextField value={form.name} onChange={setValue('name')} placeholder="Enter product name">Product Name</TextField>
                </div>
                <div>
                    <Radio value={form.is_draft} onChange={setValue('is_draft')} options={[{ id: 1, name: 'Draft' }, { id: 0, name: 'Publish' }]} >Publising Status</Radio>
                </div>
            </div>


            <div className=" grid grid-cols-4 gap-3">
                <div className="col-span-2 flex flex-row items-end">
                    <div className="flex flex-col min-w-[170px]">
                        <Radio value={form.complimentary} onChange={setValue('complimentary')} options={YesNoArray} >Complimentary</Radio>
                    </div>
                    <span className="text-xs italic">Complimentary products will require to have atleast one non complimentary product either in cart or either in active orders</span>
                </div>
                <Radio value={form.product_type} onChange={setValue('product_type')} options={ProductTypeArray} >Product Type</Radio>

                {form.product_type === ProductType.Service && <>
                    <Radio value={form.product_payment_type} onChange={setValue('product_payment_type')} options={ProductPaymentTypeArray} >Payment Type</Radio>
                </>}
                <TextField value={form.code} onChange={setValue('code')} placeholder="Enter product code" >Product Code</TextField>
                {form.product_type === ProductType.Goods && <>
                    <TextField value={form.sku} onChange={setValue('sku')} placeholder="Enter sku ">SKU (Stock Keeping Unit)</TextField>
                    <TextField value={form.barcode} onChange={setValue('barcode')} placeholder="Enter barcode" >Barcode</TextField>
                    <TextField value={form.ean} onChange={setValue('ean')} placeholder="Enter ean">EAN (Article Number)</TextField>
                </>}
                <SuggestUnit value={form.unit_id} onChange={setValue('unit_id')} selected={{ id: form.unit_id, name: form.unit_name }} />


            </div>
            <div className="flex flex-col gap-3">

                <div className="grid grid-cols-4 gap-3">
                    <Radio value={form.reduce_stock} onChange={setValue('reduce_stock')} options={YesNoArray} >Reduce Stock?</Radio>
                    {!!form.reduce_stock && <TextField value={form.quantity} onChange={setValue('quantity')} placeholder="Enter stock quantity" type="number">Stock Quantity</TextField>}
                    {!!form.reduce_stock && <TextField value={form.stock_alert_quantity} onChange={setValue('stock_alert_quantity')} placeholder="Enter stock alert" type="number">Alert on quantity</TextField>}
                </div>

                <div className="grid grid-cols-4 gap-3">
                    <Radio value={form.limit_quantity} onChange={setValue('limit_quantity')} options={YesNoArray} >Limit order quantity ?</Radio>
                    {!!form.limit_quantity && <>
                        <TextField value={form.min_order_quantity} onChange={setValue('min_order_quantity')} placeholder="Enter min quantity" type="number">Minimum order quantity</TextField>
                        <TextField value={form.max_order_quantity} onChange={setValue('max_order_quantity')} placeholder="Enter max quantity" type="number" subtitle="Set 0 for no limit">Maximum order quantity</TextField>
                    </>}
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <Radio value={form.show_in_listing} onChange={setValue('show_in_listing')} options={YesNoArray} >Show in website ?</Radio>
                {!!form.show_in_listing && <div className="grid grid-cols-5 gap-3 bg-green-50 border-green-300 border p-3 rounded-lg flex-1">
                    <Radio value={form.popular} onChange={setValue('popular')} options={YesNoArray} >Popular</Radio>
                    <Radio value={form.featured} onChange={setValue('featured')} options={YesNoArray} >Featured</Radio>
                    <Radio value={form.bestseller} onChange={setValue('bestseller')} options={YesNoArray} >Bestseller</Radio>
                    <Radio value={form.special} onChange={setValue('special')} options={YesNoArray} >Special</Radio>
                    <Radio value={form.new_arrival} onChange={setValue('new_arrival')} options={YesNoArray} >New Arrival</Radio>
                </div>}
            </div>
            <div className="  space-y-3 pb-3">
                <TextField value={form.description} onChange={setValue('description')} multiline placeholder="Enter short description max 160">Short Description</TextField>
                <Richtext value={form.content} onChange={setValue('content')}>Product Description</Richtext>
                <Richtext value={form.tnc} onChange={setValue('tnc')}>Terms & Conditions</Richtext>
                <Richtext value={form.nda} onChange={setValue('nda')}>NDA - (Non-Disclosure Agreement)</Richtext>
            </div>
            <div className="flex flex-row justify-end w-full sticky bottom-2 ">
                <div className="items-center gap-3 flex bg-white border rounded-lg p-1 shadow-lg">
                    <span className="text-xs text-gray-500">Save Product Information</span>
                    <Btn loading={saving} onClick={save}>Save Details</Btn>
                </div>
            </div>
        </>
    )
}
