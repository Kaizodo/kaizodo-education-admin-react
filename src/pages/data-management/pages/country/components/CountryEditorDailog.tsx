import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { CountryService } from '@/services/CountryService';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';
import { getImageObjectUrl } from '@/lib/utils';
import SuggestCurrency from '@/components/common/suggest/SuggestCurrency';


interface Props {
    id?: number,
    onSuccess: (data: any) => void;
    onCancel: () => void;
}

export default function CountryEditorDailog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const { openCropperFile } = useCropper();
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await CountryService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await CountryService.update(form);
        } else {
            r = await CountryService.create(form);
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
                <div className='max-w-[100px] bg-white  p-2 border rounded-sm'>
                    {!!form.image && <img src={form.image} onError={() => setValue('image')(null)} className='w-full' />}
                </div>
                <FileField onChange={async (files) => {
                    if (files.length > 0) {
                        const file = await openCropperFile(files[0], {
                            aspectRatio: 1,
                            format: 'file'
                        });
                        if (file instanceof File) {
                            const image = await getImageObjectUrl(file);
                            setValue('image_file', 'image')(file, image);
                        }
                    }
                }}>Icon / Flag Icon</FileField>
                <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                <SuggestCurrency value={form.currency_id} onChange={setValue('currency_id')} selected={{ id: form.currency_id, name: form.currency_name }}>Currency</SuggestCurrency>
                <div className='grid grid-cols-2 gap-3'>

                    <TextField value={form.shortname} onChange={setValue('shortname')} placeholder='short name'>Enter Short Name</TextField>
                    <TextField value={form.phonecode} onChange={setValue('phonecode')}>Enter Phonecode</TextField>
                    <TextField value={form.currency_symbol} onChange={setValue('currency_symbol')}>Currency Symbol</TextField>
                    <TextField value={form.currency_code} onChange={setValue('currency_code')}>Currency Code</TextField>
                    <TextField value={form.smallest_currency_unit} onChange={setValue('smallest_currency_unit')} subtitle='Required for payment gateway be carefull when entering the numbers'>Smallest Currency Unit</TextField>
                    <div className='text-xs flex items-end'>
                        <span>1 {form.currency_code} = {form.smallest_currency_unit} Cents / Paisa etc</span>
                    </div>
                    <TextField value={form.geoname_id} onChange={setValue('geoname_id')}>GeoName Id</TextField>
                </div>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

