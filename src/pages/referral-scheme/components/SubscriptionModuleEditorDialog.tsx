
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { ReferralSchemeService } from '@/services/ReferralSchemeService';
import SuggestSubscriptionPlan from '@/components/common/suggest/SuggestSubscriptionPlan';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import Richtext from '@/components/common/Richtext';
import DateTimeField from '@/components/common/DateTimeField';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function SubscriptionModuleEditorDialog({ id, onSuccess, onCancel }: Props) {
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
        var r = await ReferralSchemeService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await ReferralSchemeService.update(form);
        } else {
            r = await ReferralSchemeService.create(form);
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
                <SuggestSubscriptionPlan value={form.subscription_plan_id} onChange={setValue('subscription_plan_id')} />
                <TextField type="number" value={form.commission_percentage} onChange={setValue('commission_percentage')} placeholder='Enter commission percentage %'>Commission Percentage</TextField>
                <Radio value={form.has_commission_on_renewal} onChange={setValue('has_commission_on_renewal')} options={YesNoArray}>Has Commission on renewal ?</Radio>
                {!!form.has_commission_on_renewal && <>
                    <TextField type="number" value={form.renewal_commission_percentage} onChange={setValue('renewal_commission_percentage')} placeholder='Enter renewal commission percentage %'>Renwal Commission Percentage</TextField>
                </>}
                <div className='grid grid-cols-2 gap-3'>
                    <DateTimeField value={form.valid_from} onChange={setValue('valid_from')} outputFormat='Y-MM-DD HH:mm:ss' previewFormat='DD MMM, Y LT' mode='datetime' placeholder='Select a date'>Valid From</DateTimeField>
                    <DateTimeField value={form.valid_to} onChange={setValue('valid_to')} outputFormat='Y-MM-DD HH:mm:ss' previewFormat='DD MMM, Y LT' mode='datetime' placeholder='Select a date'>Valid To</DateTimeField>
                </div>
                <Richtext value={form.referral_content} onChange={setValue('referral_content')}>Instructions</Richtext>
                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

