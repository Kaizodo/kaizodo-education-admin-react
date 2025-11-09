
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import { msg } from '@/lib/msg';
import Radio from '@/components/common/Radio';
import { EarningWithdrawalStatus, EarningWithdrawalStatusArray } from '@/data/user';
import { ReferralEarningWithdrawalService } from '@/services/ReferralEarningWithdrawalService';


interface Props {
    record: any,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function ReferralEarningWithdrawalProcessDialog({ record, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<any>({
        id: record.id,
        status: record.status,
        status_remarks: record.status_remarks,
        reference_number: record.reference_number
    });
    const setValue = useSetValue(setForm);



    const save = async () => {
        setSaving(true);
        let r = await ReferralEarningWithdrawalService.update(form);

        if (r.success) {
            msg.success('Status updated sucessfuly');
            onSuccess(r.data);
        }
        setSaving(false);
    }


    var options = EarningWithdrawalStatusArray.filter(e => [
        EarningWithdrawalStatus.Completed,
        EarningWithdrawalStatus.Processing,
        EarningWithdrawalStatus.Rejected
    ].includes(e.id));

    if (record.status == EarningWithdrawalStatus.Processing) {
        options = EarningWithdrawalStatusArray.filter(e => [
            EarningWithdrawalStatus.Completed,
            EarningWithdrawalStatus.Rejected
        ].includes(e.id));
    }


    return (
        <>
            <ModalBody className='relative'>
                {form.status == EarningWithdrawalStatus.Pending} <Radio
                    value={form.status} onChange={setValue('status')}
                    options={options}
                >Status</Radio>
                <TextField value={form.reference_number} onChange={setValue('reference_number')} placeholder='Enter reference number / txn number'>Reference Number</TextField>
                <TextField
                    value={form.status_remarks}
                    multiline rows={5}
                    onChange={setValue('status_remarks')}
                    placeholder='Enter remarks'
                >Remarks</TextField>

            </ModalBody>
            <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>

        </>
    );
};

