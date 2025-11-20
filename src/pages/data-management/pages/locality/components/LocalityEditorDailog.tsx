import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestState from '@/components/common/suggest/SuggestState'
import { LocalityService } from '@/services/LocalityService';
import SuggestCity from '@/components/common/suggest/SuggestCity';


interface Props {
    id?: number,
    onSuccess: (data: any) => void;
    onCancel: () => void;
}

export default function LocalityEditorDailog({ id, onSuccess, onCancel }: Props) {
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
        var r = await LocalityService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await LocalityService.update(form);
        } else {
            r = await LocalityService.create(form);
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
                <TextField value={form.name} onChange={setValue('name')}>Locality Name</TextField>
                <div className='grid grid-cols-2 gap-3'>
                    <SuggestCountry value={form.country_id} onChange={setValue('country_id')}>Select Country</SuggestCountry>
                    <SuggestState value={form.state_id} country_id={form.country_id} onChange={setValue('state_id')}>Select State</SuggestState>
                    <SuggestCity value={form.city_id} state_id={form.state_id} onChange={setValue('city_id')}>Select City</SuggestCity>
                </div>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

