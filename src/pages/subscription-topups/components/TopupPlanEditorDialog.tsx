
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { TopupPlanService } from '@/services/TopupPlanService';
import Dropdown from '@/components/common/Dropdown';
import { TopupTypeArray } from '@/data/Subscription';
import { YesNoArray } from '@/data/Common';
import Radio from '@/components/common/Radio';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function TopupPlanEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({
        cgst: 9,
        sgst: 9,
        igst: 18,
        sac: '998314',
        hsn: '',
    });
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await TopupPlanService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await TopupPlanService.update(form);
        } else {
            r = await TopupPlanService.create(form);
        }
        if (r.success) {
            msg.success(id ? 'Record updated successfully' : 'Record created successfully');
            onSuccess(r.data);
        }
        setSaving(false);
    }

    useEffect(() => {
        if (id) {
            getDetail();
        } else {
            setLoading(false);
        }
    }, [id])


    return (
        <>
            <ModalBody className='relative'>
                {!!loading && <CenterLoading className='absolute z-[50]' />}
                <Dropdown value={form.topup_type} onChange={setValue('topup_type')} placeholder='Select topup type' getOptions={async () => TopupTypeArray}>Topup Type</Dropdown>
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField
                    value={form.description}
                    multiline rows={5}
                    onChange={setValue('description')}
                    placeholder='Enter Description'
                >Description</TextField>
                <div className='grid grid-cols-2 gap-3'>
                    <TextField type='number' value={form.price} onChange={setValue('price')} placeholder='Enter price'>Price</TextField>
                    <TextField type='number' value={form.quantity} onChange={setValue('quantity')} placeholder='Enter Quantity'>Quantity</TextField>
                </div>
                <div className='bg-green-50 border-green-400 border p-2 rounded-lg flex flex-col gap-3'>
                    <span className='text-xs italic text-green-600'>Tax Information - Included in price</span>
                    <div className='grid grid-cols-2 gap-3'>
                        <TextField value={form.cgst} onChange={setValue('cgst')} placeholder="Enter CGST">CGST %</TextField>
                        <TextField value={form.sgst} onChange={setValue('sgst')} placeholder="Enter SGST">SGST %</TextField>
                        <TextField value={form.igst} onChange={setValue('igst')} placeholder="Enter IGST">IGST %</TextField>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <TextField value={form.sac} onChange={setValue('sac')} placeholder="Enter SAC">SAC - For Services</TextField>
                        <TextField value={form.hsn} onChange={setValue('hsn')} placeholder="Enter HSN">HSN - For Goods</TextField>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <Radio value={form.popular} onChange={setValue('popular')} options={YesNoArray}>Popular ?</Radio>
                    <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish ?</Radio>
                </div>

            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

