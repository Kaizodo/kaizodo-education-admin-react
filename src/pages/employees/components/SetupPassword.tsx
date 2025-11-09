
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import { msg } from '@/lib/msg';
import { EmployeeService } from '@/services/EmployeeService';


interface Props {
    id: number,
    onSuccess: (data?: any) => void;
}

export default function SetupPassword({ id, onSuccess }: Props) {
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);


    function generateSafePassword() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars[Math.floor(Math.random() * chars.length)];
        }
        setValue('password', 'confirm_password', 'auto_password')(pass, pass, pass);
    }



    const save = async () => {
        setSaving(true);
        let r = await EmployeeService.setPassword({ ...form, id });

        if (r.success) {
            msg.success('Password updated successfuly');
            onSuccess(r.data);
        }
        setSaving(false);
    }



    return (
        <>
            <ModalBody className='relative'>
                <TextField value={form.password} onChange={setValue('password')} placeholder='Enter password'>Password</TextField>
                <TextField value={form.confirm_password} onChange={setValue('confirm_password')} placeholder='Enter confirm password' type='password'>Confirm Password</TextField>
                <div>
                    <Btn onClick={generateSafePassword} variant={'outline'} size={'xs'}>Auto Generate</Btn>
                </div>

            </ModalBody>
            <ModalFooter className='gap-4'>
                <Btn disabled={!form.password || form.password !== form.confirm_password} onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>

        </>
    );
};

