import AppCard from '@/components/app/AppCard'
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import TextField from '@/components/common/TextField';
import { useSetValue } from '@/hooks/use-set-value';
import { msg } from '@/lib/msg';
import { UserService } from '@/services/UserService';
import { useEffect, useState } from 'react'

export default function UserMedicalCard({ id }: { id: number }) {
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        var r = await UserService.saveMedicalConfiguration(form);
        if (r.success) {
            msg.success('Medical details saved');
        }
        setSaving(false);
    }

    const load = async () => {
        setLoading(true);
        var r = await UserService.loadMedicalConfiguration(id);
        if (r.success) {
            setForm(r.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [id])
    return (
        <AppCard title='Medical Information' actions={<div className='me-6'><Btn size={'sm'} onClick={save} loading={saving}>Save Details</Btn></div>}>
            {loading && <CenterLoading className="relative h-[400px]" />}

            {!loading && <div className='p-3 flex flex-col gap-4'>
                <TextField value={form.medical_conditions} onChange={setValue('medical_conditions')} multiline>Medical Conditions</TextField>
                <TextField value={form.allergies} onChange={setValue('allergies')} multiline>Allergies</TextField>
                <TextField value={form.medications} onChange={setValue('medications')} multiline>Current Medications</TextField>
            </div>}
        </AppCard>
    )
}
