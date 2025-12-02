
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { ClientService } from '@/services/ClientService';


interface Props {
    mobile?: string
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function CustomerForm({ mobile, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<any>({ mobile });
    const setValue = useSetValue(setForm);



    const save = async () => {
        setSaving(true);
        let r: ApiResponseType = await ClientService.createQuick(form)
        if (r.success) {
            msg.success('Customer added successfuly!');
            onSuccess(r.data);
        }
        setSaving(false);
    }




    return (
        <>
            <ModalBody className='relative'>
                <TextField value={form.mobile} onChange={setValue('mobile')} placeholder='Enter mobile' type='number'>Mobile*</TextField>

                <div className='grid grid-cols-2 gap-3'>
                    <TextField value={form.first_name} onChange={setValue('first_name')} placeholder='Enter first name'>First Name</TextField>
                    <TextField value={form.last_name} onChange={setValue('last_name')} placeholder='Enter last name'>Last Name</TextField>
                </div>
                <TextField value={form.email} onChange={setValue('email')} placeholder='Enter email'>Email</TextField>

            </ModalBody>
            <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>

        </>
    );
};

