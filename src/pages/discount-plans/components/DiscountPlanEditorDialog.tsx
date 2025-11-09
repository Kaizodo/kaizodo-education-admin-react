
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { DiscountPlanService } from '@/services/DiscountPlanService';
import { DiscountBy, DiscountByArray, DiscountType, DiscountTypeArray, YesNoArray } from '@/data/Common';
import Radio from '@/components/common/Radio';
import DateTimeField from '@/components/common/DateTimeField';
import SubscriptionPlanPicker from './SubscriptionPlanPicker';
import TopupPlanPicker from './TopupPlanPicker';
import SuggestMarketer from '@/components/common/suggest/SuggestMarketer';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}



export default function DiscountPlanEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await DiscountPlanService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await DiscountPlanService.update(form);
        } else {
            r = await DiscountPlanService.create(form);
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
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField
                    value={form.description}
                    multiline rows={5}
                    onChange={setValue('description')}
                    placeholder='Enter Description'
                >Description</TextField>
                <TextField type='text' value={form.code} onChange={setValue('code')} placeholder='Enter code'>Coupon Code</TextField>
                <Radio value={form.renewal_only} onChange={setValue('renewal_only')} options={YesNoArray}>Renewal Only ?</Radio>
                <Radio value={form.marketer_only} onChange={setValue('marketer_only')} options={YesNoArray}>Marketer Only ?</Radio>
                {!!form.marketer_only && <SuggestMarketer value={form.user_id} onChange={setValue('user_id')} />}


                <Radio value={form.discount_by} onChange={setValue('discount_by')} options={DiscountByArray}>Discount By</Radio>
                {form.discount_by == DiscountBy.Percentage && <TextField type='number' value={form.discount_percentage} onChange={setValue('discount_percentage')} placeholder='Enter percentage'>Percentage %</TextField>}
                {form.discount_by == DiscountBy.Amount && <TextField type='number' value={form.discount_amount} onChange={setValue('discount_amount')} placeholder='Enter amount'>Amount</TextField>}
                <Radio value={form.discount_type} onChange={setValue('discount_type')} options={DiscountTypeArray}>Discount Application</Radio>

                {form.discount_type == DiscountType.OrderValue && <div className='grid grid-cols-2 gap-3 p-2 bg-green-50 border border-green-400 rounded-lg'>
                    <TextField type='number' value={form.min_amount} onChange={setValue('min_amount')} placeholder='Enter amount'>Min Order Value</TextField>
                    <TextField type='number' value={form.max_amount} onChange={setValue('max_amount')} placeholder='Enter amount'>Max Order Value</TextField>
                </div>}
                {form.discount_type == DiscountType.SubscriptionPlan && <SubscriptionPlanPicker selected={form.subscription_plan_price_ids ?? []} onSelectedChange={setValue('subscription_plan_price_ids')} />}
                {form.discount_type == DiscountType.TopupPlan && <TopupPlanPicker selected={form.topup_plan_ids ?? []} onSelectedChange={setValue('topup_plan_ids')} />}

                <div className='grid grid-cols-2 gap-3'>
                    <DateTimeField value={form.valid_from} onChange={setValue('valid_from')} placeholder='Select a date ' mode='date'>Valid From</DateTimeField>
                    <DateTimeField value={form.valid_to} onChange={setValue('valid_to')} placeholder='Select a date ' mode='date'>Valid To</DateTimeField>
                    <TextField type='number' value={form.quantity} onChange={setValue('quantity')} placeholder='Enter quantity'>Quantity</TextField>
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

