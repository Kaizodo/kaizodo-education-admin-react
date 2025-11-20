import Btn from '@/components/common/Btn'
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import Radio from '@/components/common/Radio';
import SuggestProductCategory from '@/components/common/suggest/SuggestProductCategory'
import TextField from '@/components/common/TextField';
import { YesNoArray } from '@/data/Common';
import { useForm } from '@/hooks/use-form';
import { msg } from '@/lib/msg';
import { ProductService } from '@/services/ProductService';
import { useState } from 'react';

interface Props {
    product?: any,
    onSuccess: (data?: any) => void;
}

export default function CloneProductForm({ product, onSuccess }: Props) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm<any>({
        product_id: product.id,
        name: product.name,
        product_category_id: product.product_category_id
    });

    const save = async () => {
        setSaving(true);
        var r = await ProductService.clone(form);
        if (r.success) {
            msg.success('Copy of product is created');
            onSuccess(r.data);
        }
        setSaving(false);
    }

    return (
        <>
            <ModalBody>
                <Radio value={form.clone_tag} onChange={setValue('clone_tag')} options={YesNoArray}>Tag as clone ?</Radio>
                <TextField value={form.name} onChange={setValue('name')} placeholder='Name for cloned product'>Clone Product Name</TextField>
                <SuggestProductCategory value={form.product_category_id} onChange={setValue('product_category_id')} selected={{ id: product.product_category_id, name: product.product_category_name }}>To Product Category</SuggestProductCategory>
                <Radio value={form.show_in_listing} onChange={setValue('show_in_listing')} options={YesNoArray}>Hide listing of orignal product ({product.name})? </Radio>
            </ModalBody>
            <ModalFooter>
                <Btn loading={saving} onClick={save}>Create Copy</Btn>
            </ModalFooter>
        </>
    )
}
