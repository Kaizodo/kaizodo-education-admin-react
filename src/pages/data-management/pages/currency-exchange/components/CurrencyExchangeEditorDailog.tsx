import { useEffect, useRef, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { CurrencyExchangeService } from '@/services/CurrencyExchangeService';
import SuggestCurrency from '@/components/common/suggest/SuggestCurrency';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import { useForm } from '@/hooks/use-form';



interface Props {
    id?: number,
    onSuccess: (data: any) => void;
    onCancel: () => void;
}

export default function CurrencyExchangeEditorDailog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const [currencyForm, setCurrencyValue] = useForm({
        base: {
            name: 'Base',
            symbol: ''
        },
        target: {
            name: 'Target',
            symbol: ''
        }
    });
    const tempForm = useRef({
        base: {
            id: form.base_currency_id,
            name: form.base_currency_name
        },
        target: {
            id: form.target_currency_id,
            name: form.target_currency_name
        }
    })
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await CurrencyExchangeService.detail(id);
        if (r.success) {
            tempForm.current = {
                base: {
                    id: r.data.base_currency_id,
                    name: r.data.base_currency_name
                },
                target: {
                    id: r.data.target_currency_id,
                    name: r.data.target_currency_name
                }
            };
            setCurrencyValue('base', 'target')({
                id: r.data.base_currency_id,
                name: r.data.base_currency_name,
                symbol: r.data.base_currency_symbol,
            }, {
                id: r.data.target_currency_id,
                name: r.data.target_currency_name,
                symbol: r.data.target_currency_symbol,
            })
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
                <div className='text-sm'>
                    <span className='font-bold'>1</span>
                    <span> Base Currency = </span>
                    <span className='font-bold'>N</span>
                    <span> Target Currency</span>
                </div>
                {!id && <>
                    <SuggestCurrency
                        exclude_ids={[form.target_currency_id]}
                        value={form.base_currency_id}
                        onChange={setValue('base_currency_id')}
                        selected={tempForm.current.base}
                        onSelect={setCurrencyValue('base')}
                    >Base Currency</SuggestCurrency>
                    <SuggestCurrency
                        disabled={!form.base_currency_id}
                        exclude_ids={[form.base_currency_id]}
                        value={form.target_currency_id}
                        onChange={setValue('target_currency_id')}
                        onSelect={setCurrencyValue('target')}
                        selected={tempForm.current.target}
                    >Target Currency</SuggestCurrency>
                </>}
                <TextField type='number' value={form.rate} onChange={setValue('rate')} placeholder='Enter rate'>Rate</TextField>
                <TextField type='number' value={form.reverse_rate} onChange={setValue('reverse_rate')} placeholder='Enter reverse rate'>Reverse Rate</TextField>
                <span className="text-xs">
                    1 {currencyForm.base.name}
                    {currencyForm.base.symbol && ` (${currencyForm.base.symbol})`}{" "}
                    = {form.rate ?? 0}{" "}
                    {currencyForm.target.name}
                    {currencyForm.target.symbol && ` (${currencyForm.target.symbol})`}
                </span>

                <span className="text-xs">
                    1 {currencyForm.target.name}
                    {currencyForm.target.symbol && ` (${currencyForm.target.symbol})`}{" "}
                    = {form.reverse_rate ?? 0}{" "}
                    {currencyForm.base.name}
                    {currencyForm.base.symbol && ` (${currencyForm.base.symbol})`}
                </span>


                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish</Radio>
                {form.publish === 0 && <span className='text-red-500 text-sm'>Clients will cease earning from referrals if their preferred currency becomes unpublished.</span>}
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

