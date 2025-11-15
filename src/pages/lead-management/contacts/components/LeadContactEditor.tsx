import Btn from '@/components/common/Btn';
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import { useEffect, useState } from 'react'
import TextField from '@/components/common/TextField';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';


import { useForm } from '@/hooks/use-form';
import { ApiResponseType } from '@/lib/api';
import { LeadService } from '@/services/LeadService';
import CenterLoading from '@/components/common/CenterLoading';
import { msg } from '@/lib/msg';
import SuggestGender from '@/components/common/suggest/SuggestGender';
import SuggestDesignation from '@/components/common/suggest/SuggestDesignation';

export default function LeadContactEditor({
    user_id,
    lead_id,
    onSuccess,
    onCancel
}: {
    lead_id: number,
    user_id?: number,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const [form, setValue, setForm] = useForm({
        is_whatsapp_same: 1,
        is_main_contact: 1
    })
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!!user_id);

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType = await LeadService.saveContact({ ...form, lead_id });
        if (r.success) {
            msg.success(user_id ? 'Contact created successfuly' : 'Contact updated successfuly');
            onSuccess();
        }
        setSaving(false);
    }

    const load = async () => {
        if (!user_id) {
            return;
        }
        setLoading(true);
        var r = await LeadService.loadContact({ id: user_id, lead_id });
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        } else {
            onCancel();
        }
    }

    useEffect(() => {
        if (user_id) {
            load();
        }
    }, [user_id])

    if (loading) {
        return <CenterLoading className="h-[400px] relative" />
    }

    return (<>
        <ModalBody className='grid grid-cols-2 gap-3'>
            <TextField value={form.first_name} onChange={setValue('first_name')} placeholder="Enter first name">First Name</TextField>
            <TextField value={form.last_name} onChange={setValue('last_name')} placeholder="Enter last name">Last Name</TextField>
            <SuggestGender value={form.gender} onChange={setValue('gender')} />
            <SuggestDesignation value={form.designation_id} onChange={setValue('designation_id')} />
            <TextField value={form.mobile} onChange={setValue('mobile')} placeholder="Enter mobile number">Mobile</TextField>
            <Radio value={form.is_whatsapp_same} onChange={setValue('is_whatsapp_same')} options={YesNoArray}>WhatsApp same?</Radio>
            {form.is_whatsapp_same === 0 && <TextField value={form.whatsapp_number} onChange={setValue('whatsapp_number')} placeholder="Enter mobile number">Whatsapp Number</TextField>}
            <TextField value={form.email} onChange={setValue('email')} placeholder="Enter email address">Email</TextField>
            <Radio value={form.is_main_contact} onChange={setValue('is_main_contact')} options={YesNoArray}>Set as main contact</Radio>
        </ModalBody>
        <ModalFooter>
            <Btn onClick={save} loading={saving}>Save Details</Btn>
        </ModalFooter>
    </>)
}
