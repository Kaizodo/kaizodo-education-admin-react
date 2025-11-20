import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import { StateService } from '@/services/StateService';


interface Props {
    id?: number,
    onSuccess: (data: any) => void;
    onCancel: () => void;
}

export default function StateEditorDailog({ id, onSuccess, onCancel }: Props) {
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
        var r = await StateService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await StateService.update(form);
        } else {
            r = await StateService.create(form);
        }

        if (r.success) {
            msg.success(id ? 'Record updated successfuly' : 'Record added successfuly');
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
                <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                <div className='grid grid-cols-2 gap-3'>
                    <SuggestCountry value={form.country_id} onChange={setValue('country_id')}>Select Country</SuggestCountry>
                    <TextField value={form.shortname} onChange={setValue('shortname')}>Short Name</TextField>
                </div>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

