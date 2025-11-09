
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { EmployeeService } from '@/services/EmployeeService';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function EmployeeEditorDialog({ id, onSuccess, onCancel }: Props) {
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
        var r = await EmployeeService.detail(id);
        if (r.success) {
            setForm(r.data);

            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await EmployeeService.update(form);
        } else {
            r = await EmployeeService.create(form);
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
                <div className='grid grid-cols-2 gap-3'>
                    <TextField value={form.first_name} onChange={setValue('first_name')} placeholder='Enter first name'>First Name</TextField>
                    <TextField value={form.last_name} onChange={setValue('last_name')} placeholder='Enter last name'>Last Name</TextField>
                </div>
                <TextField value={form.email} onChange={setValue('email')} placeholder='Enter email'>Email</TextField>
                <TextField value={form.mobile} onChange={setValue('mobile')} placeholder='Enter mobile' type='number'>Mobile</TextField>
                <Radio value={form.is_manager} onChange={setValue('is_manager')} options={YesNoArray}>Is Manager ?</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

