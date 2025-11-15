import BlankField from "@/components/common/BlankField";
import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import DateTimeField from "@/components/common/DateTimeField";
import { ModalBody, ModalFooter } from "@/components/common/Modal"
import { pickMultipleLeadUsers } from "@/components/common/MultiLeadUserPicker";
import Radio from "@/components/common/Radio";
import Richtext from "@/components/common/Richtext";
import TextField from "@/components/common/TextField";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/data/user";
import { useForm } from "@/hooks/use-form";
import { ApiResponseType } from "@/lib/api";
import { msg } from "@/lib/msg";
import { nameLetter } from "@/lib/utils";
import { AppointmentService } from "@/services/AppointmentService";
import { useEffect, useState } from "react";
import { LuUserPlus, LuX } from "react-icons/lu";

export default function AppointmentEditorDialog({ lead_id, id, onSuccess, onCancel }: {
    lead_id?: number,
    id?: number,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setValue, setForm] = useForm<any>({});
    const [contacts, setContacts] = useState<User[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);

    const load = async () => {
        if (!id) {
            return;
        }
        setLoading(true);
        var r = await AppointmentService.detail(id);
        if (r.success) {
            setForm(r.data.record);
            setContacts(r.data.contacts);
            setEmployees(r.data.employees);
            setLoading(false);
        } else {
            onCancel();
        }
    }

    const save = async () => {
        setSaving(true);
        var f = {
            ...form,
            lead_id,
            contact_user_ids: contacts.map(m => m.id),
            employee_user_ids: employees.map(s => s.id)
        };
        let r: ApiResponseType;
        if (id) {
            r = await AppointmentService.update(f);
        } else {
            r = await AppointmentService.create(f);
        }
        if (r.success) {
            msg.success(id ? 'Appointment details updated' : 'New Appointment created');
            onSuccess();
        }
        setSaving(false);
    }

    useEffect(() => {
        if (id) {
            load();
        }
    }, [id]);

    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <>
            <ModalBody>
                <TextField value={form.name} onChange={setValue('name')} placeholder="Enter agenda / purpose ">Meeting Title</TextField>
                <Richtext value={form.content} onChange={setValue('content')}>Description / Agenda</Richtext>


                <Radio value={form.is_online} onChange={setValue('is_online')} options={[
                    { id: 0, name: 'On-site Meeting' },
                    { id: 1, name: 'Online Meeting' }
                ]}>Meeting Mode</Radio>


                {form.is_online == 0 && <>
                    <Radio value={form.is_inbound} onChange={setValue('is_inbound')} options={[
                        { id: 1, name: 'Client will visit' },
                        { id: 0, name: 'Team will visit' }
                    ]}>Meeting type</Radio>
                    <TextField value={form.location} onChange={setValue('location')} multiline placeholder="Enter Location / Venue">Location / Venue</TextField>

                </>}

                {form.is_online == 1 && <TextField value={form.meeting_url} onChange={setValue('meeting_url')} multiline placeholder="Enter online meeting url">Meeting Link / Url</TextField>}
                <DateTimeField previewFormat="DD MMM, Y LT" value={form.datetime} onChange={setValue('datetime')} mode="datetime" placeholder="Select date and time">Meeting Date & Time</DateTimeField>
                <BlankField onClick={async () => {
                    var users = await pickMultipleLeadUsers({
                        title: 'Select Contacts',
                        subtitle: 'Select contacts for which this appointment is beeing created.',
                        exclude_ids: [...contacts.map(m => m.id), ...contacts.map(s => s.id)],
                        lead_id: lead_id ?? 0,
                        is_contact: 1
                    });
                    setContacts([...contacts, ...users]);
                }} title='Contacts' className='flex flex-row items-center gap-1 justify-center'>
                    <span>Pick Contacts</span> <LuUserPlus />
                </BlankField>
                {contacts.map(record => {
                    return <div className="flex items-center bg-white border rounded-lg p-2">
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={record.image} />
                            <AvatarFallback>
                                {nameLetter(record.first_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                            <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>
                            <span className="text-xs text-gray-500">Email :- {record.email}</span>
                            <span className="text-xs text-gray-500">Mobile : {record.mobile}</span>
                        </div>
                        <Btn size={'xs'} variant={'destructive'} onClick={() => setContacts(m => m.filter(mx => mx.id !== record.id))}><LuX /></Btn>
                    </div>;
                })}

                <BlankField onClick={async () => {
                    var users = await pickMultipleLeadUsers({
                        title: 'Select Team Members',
                        subtitle: 'Select team members who will be attending the meeting',
                        exclude_ids: [...employees.map(m => m.id), ...contacts.map(s => s.id)],
                        lead_id: lead_id ?? 0,
                        is_contact: 0
                    });
                    setEmployees([...employees, ...users]);
                }} title='Team Members' className='flex flex-row items-center gap-1 justify-center'>
                    <span>Team Members</span> <LuUserPlus />
                </BlankField>

                {employees.map(record => {
                    return <div className="flex items-center bg-white border rounded-lg p-2">
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={record.image} />
                            <AvatarFallback>
                                {nameLetter(record.first_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                            <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>
                            <span className="text-xs text-gray-500">Email :- {record.email}</span>
                            <span className="text-xs text-gray-500">Mobile : {record.mobile}</span>
                        </div>
                        <Btn size={'xs'} variant={'destructive'} onClick={() => setEmployees(s => s.filter(sx => sx.id !== record.id))}><LuX /></Btn>
                    </div>;
                })}
            </ModalBody>
            <ModalFooter>
                <Btn onClick={save} loading={saving} disabled={employees.length == 0 || contacts.length == 0}>Save Details</Btn>
            </ModalFooter>
        </>
    )
}
