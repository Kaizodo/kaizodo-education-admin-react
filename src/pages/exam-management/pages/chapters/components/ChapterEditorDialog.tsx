
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { ChapterService } from '@/services/ChapterService';
import { useOrganizationId } from '@/hooks/use-organization-id';
import SuggestSubject from '@/components/common/suggest/SuggestSubject';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function ChapterEditorDialog({ id, onSuccess, onCancel }: Props) {
    const organization_id = useOrganizationId();
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
        var r = await ChapterService.detail({ id, organization_id });
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        } else {
            msg.error('Not found or either not allowed');
            onCancel();
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await ChapterService.update({ ...form, organization_id });
        } else {
            r = await ChapterService.create({ ...form, organization_id });
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
                <SuggestSubject value={form.subject_id} onChange={setValue('subject_id')} selected={{ id: form.subject_id, name: form.subject_name }} />
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField value={form.description} onChange={setValue('description')} placeholder='Enter description' multiline>Description</TextField>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

