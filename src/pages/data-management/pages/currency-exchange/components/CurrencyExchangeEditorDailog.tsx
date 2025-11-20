import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { CurrencyExchangeService } from '@/services/CurrencyExchangeService';
import SuggestCurrency from '@/components/common/suggest/SuggestCurrency';



interface Props {
    id?: number,
    onSuccess: (data: any) => void;
    onCancel: () => void;
}

export default function CurrencyExchangeEditorDailog({ id, onSuccess, onCancel }: Props) {
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
        var r = await CurrencyExchangeService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await CurrencyExchangeService.update(form);
        } else {
            r = await CurrencyExchangeService.create(form);
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
                <SuggestCurrency exclude_ids={[form.target_currency_id]} value={form.base_currency_id} onChange={setValue('base_currency_id')} selected={{ id: form.base_currency_id, name: form.base_currency_name }}>Base Currency</SuggestCurrency>
                <SuggestCurrency disabled={!form.base_currency_id} exclude_ids={[form.base_currency_id]} value={form.target_currency_id} onChange={setValue('target_currency_id')} selected={{ id: form.target_currency_id, name: form.target_currency_name }}>Target Currency</SuggestCurrency>
                <TextField type='number' value={form.rate} onChange={setValue('rate')}>Rate</TextField>

            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

