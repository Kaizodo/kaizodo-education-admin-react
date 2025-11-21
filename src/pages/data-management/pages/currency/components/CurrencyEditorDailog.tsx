import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { CurrencyService } from '@/services/CurrencyService';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';



interface Props {
    id?: number,
    onSuccess: (data: any) => void;
    onCancel: () => void;
}

export default function CurrencyEditorDailog({ id, onSuccess, onCancel }: Props) {
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
        var r = await CurrencyService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await CurrencyService.update(form);
        } else {
            r = await CurrencyService.create(form);
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
                    <TextField value={form.symbol} onChange={setValue('symbol')}>Currency Symbol</TextField>
                    <TextField value={form.code} onChange={setValue('code')}>Currency Code</TextField>
                    <TextField value={form.smallest_currency_unit} onChange={setValue('smallest_currency_unit')} subtitle='Required for payment gateway be carefull when entering the numbers'>Smallest Currency Unit</TextField>
                    <div className='text-xs flex items-end'>
                        <span>1 {form.currency_code} = {form.smallest_currency_unit} Cents / Paisa etc</span>
                    </div>
                    <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish</Radio>
                </div>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

