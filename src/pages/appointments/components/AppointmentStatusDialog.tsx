import Btn from "@/components/common/Btn";
import DateTimeField from "@/components/common/DateTimeField";
import { ModalBody, ModalFooter } from "@/components/common/Modal";
import Radio from "@/components/common/Radio";
import TextField from "@/components/common/TextField";
import { AppointmentStatus, AppointmentStatusArray } from "@/data/Appointment";
import { useForm } from "@/hooks/use-form";
import { msg } from "@/lib/msg";
import { AppointmentService } from "@/services/AppointmentService";
import { useState } from "react";

export default function AppointmentStatusDialog({ id, onSuccess, }: { id: number, onSuccess: () => void }) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm();
    const save = async () => {
        setSaving(true);
        var r = await AppointmentService.addLog({ ...form, appointment_id: id });
        if (r.success) {
            msg.success('Appointment status updated');
            onSuccess();
        }
        setSaving(false);
    }
    return (
        <>
            <ModalBody>
                <Radio options={AppointmentStatusArray.filter(a => a.id !== AppointmentStatus.Pending)} value={form.status} onChange={setValue('status')}>Status</Radio>
                {form.status == AppointmentStatus.Rescheduled && <DateTimeField previewFormat="DD MMM, Y LT" value={form.datetime} onChange={setValue('datetime')} mode="datetime" placeholder="Select date and time">Next Meeting Date & Time</DateTimeField>}
                <TextField value={form.remarks} onChange={setValue('remarks')} multiline placeholder="Enter remarks  / notes" rows={5}>Remarks / Notes</TextField>
            </ModalBody>
            <ModalFooter>
                <Btn size={'sm'} loading={saving} onClick={save} disabled={!form.status}>Update Status</Btn>
            </ModalFooter>
        </>
    )
}
