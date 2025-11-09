
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { PhaseService } from '@/services/PhaseService';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function PhaseEditorDialog({ id, onSuccess, onCancel }: Props) {
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
        var r = await PhaseService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await PhaseService.update(form);
        } else {
            r = await PhaseService.create(form);
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
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField
                    value={form.description}
                    multiline rows={5}
                    onChange={setValue('description')}
                    placeholder='Enter Description'
                >Description</TextField>
                <TextField value={form.color} onChange={setValue('color')} placeholder='Enter color code in Hex'>Color Code (Hex 6)</TextField>
                <TextField type='number' value={form.sort_order} onChange={setValue('sort_order')} placeholder='Enter sort order'>Sort Order</TextField>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

