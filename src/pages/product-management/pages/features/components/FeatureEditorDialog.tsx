
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { FeatureService } from '@/services/FeatureService';
import SuggestFeatureGroup from '@/components/common/suggest/SuggestFeatureGroup';
import Dropdown from '@/components/common/Dropdown';

interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function FeatureEditorDialog({ id, onSuccess, onCancel }: Props) {
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
        var r = await FeatureService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await FeatureService.update(form);
        } else {
            r = await FeatureService.create(form);
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
                <SuggestFeatureGroup value={form.feature_group_id} onChange={setValue('feature_group_id')} selected={{ id: form.feature_group_id, name: form.feature_group_name }} />
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField value={form.description} onChange={setValue('description')} placeholder='Enter description' multiline>Description</TextField>
                <TextField value={form.code} onChange={setValue('code')} placeholder='Enter code'>Code</TextField>
                <Dropdown value={form.input_type} onChange={setValue('input_type')} getOptions={async () => [
                    { id: 'text', name: 'Text' },
                    { id: 'number', name: 'Number' },
                    { id: 'richtext', name: 'Richtext' },
                    { id: 'boolean', name: 'Yes/ No boolean' }
                ]}>Input Type</Dropdown>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

