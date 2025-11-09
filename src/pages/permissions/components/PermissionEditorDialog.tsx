
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { PermissionService } from '@/services/PermissionService';
import SuggestPermissionGroup from '@/components/common/suggest/SuggestPermissionGroup';
import Checkable from '@/components/common/Checkable';
import { Panel } from '@/data/global';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function PermissionEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({
        panels: [
            Panel.Admin,
            Panel.Employee
        ]
    });
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await PermissionService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await PermissionService.update(form);
        } else {
            r = await PermissionService.create(form);
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
                <Checkable value={form.panels} onChange={setValue('panels')} options={[
                    { id: Panel.Admin, name: 'Admin Panel' },
                    { id: Panel.Employee, name: 'Employee Panel' }
                ]}>Panels</Checkable>
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField value={form.description} onChange={setValue('description')} placeholder='Enter description' multiline>Description</TextField>
                <SuggestPermissionGroup value={form.permission_group_id} onChange={setValue('permission_group_id')} selected={{ id: form.permission_group_id, name: form.permission_group_name }} />
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

