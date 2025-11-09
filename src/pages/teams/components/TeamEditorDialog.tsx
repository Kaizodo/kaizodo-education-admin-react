
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { TeamService } from '@/services/TeamService';
import BlankField from '@/components/common/BlankField';
import { LuUserPlus, LuX } from 'react-icons/lu';
import { pickMultipleUsers } from '@/components/common/MultiUserPicker';
import { User } from '@/data/user';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { nameLetter } from '@/lib/utils';

interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function UserEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [managers, setManagers] = useState<User[]>([]);
    const [subordinates, setSubordinates] = useState<User[]>([]);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await TeamService.detail(id);
        if (r.success) {
            var { managers: data_managers, subordinates: data_subordinates, ...rest_data } = r.data;
            setForm(rest_data);
            setManagers(data_managers);
            setSubordinates(data_subordinates);

            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        var f = {
            id: form.id,
            name: form.name,
            manager_user_ids: managers.map(m => m.id),
            subordinate_user_ids: subordinates.map(s => s.id)
        };
        if (id) {
            r = await TeamService.update(f);
        } else {
            r = await TeamService.create(f);
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
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter team name'>Team Name</TextField>
                <BlankField onClick={async () => {
                    var users = await pickMultipleUsers({
                        title: 'Select managers',
                        subtitle: 'Managers will be able to view and manage data from assigned subordinates',
                        exclude_ids: [...managers.map(m => m.id), ...subordinates.map(s => s.id)]
                    });
                    setManagers([...managers, ...users]);
                }} title='Managers' className='flex flex-row items-center gap-1 justify-center'>
                    <span>Pick Managers</span> <LuUserPlus />
                </BlankField>
                {managers.map(record => {
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
                        <Btn size={'xs'} variant={'destructive'} onClick={() => setManagers(m => m.filter(mx => mx.id !== record.id))}><LuX /></Btn>
                    </div>;
                })}

                <BlankField onClick={async () => {
                    var users = await pickMultipleUsers({
                        title: 'Select Subordinates',
                        subtitle: 'Subordinates will report to managers and  work on assigned tasks',
                        exclude_ids: [...managers.map(m => m.id), ...subordinates.map(s => s.id)]
                    });
                    setSubordinates([...subordinates, ...users]);
                }} title='Subordinates' className='flex flex-row items-center gap-1 justify-center'>
                    <span>Subordinates</span> <LuUserPlus />
                </BlankField>

                {subordinates.map(record => {
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
                        <Btn size={'xs'} variant={'destructive'} onClick={() => setSubordinates(s => s.filter(sx => sx.id !== record.id))}><LuX /></Btn>
                    </div>;
                })}



            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

