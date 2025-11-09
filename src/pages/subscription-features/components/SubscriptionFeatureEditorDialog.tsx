
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { SubscriptionFeatureService } from '@/services/SubscriptionFeatureService';
import SuggestSubscriptionModule from '@/components/common/suggest/SuggestSubscriptionModule';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';
import { getImageObjectUrl } from '@/lib/utils';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function SubscriptionFeatureEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const { openCropperFile } = useCropper();
    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await SubscriptionFeatureService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await SubscriptionFeatureService.update(form);
        } else {
            r = await SubscriptionFeatureService.create(form);
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
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <div className='max-w-[100px] h-[100px] bg-white  p-2 border rounded-sm'>
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
                        }}>Featured Image</FileField>
                    </div>

                    <div>
                        <div className='max-w-[150px] h-[100px] bg-white  p-2 border rounded-sm'>
                            {!!form.banner_image && <img src={form.banner_image} onError={() => setValue('image')(null)} className='w-full' />}
                        </div>
                        <FileField onChange={async (files) => {
                            if (files.length > 0) {
                                const file = await openCropperFile(files[0], {
                                    aspectRatio: 16 / 9,
                                    format: 'file'
                                });
                                if (file instanceof File) {
                                    const image = await getImageObjectUrl(file);
                                    setValue('banner_image_file', 'banner_image')(file, image);
                                }
                            }
                        }}>Banner Image</FileField>
                    </div>
                </div>
                <TextField value={form.embed_video_url} onChange={setValue('embed_video_url')}>Youtube video url</TextField>
                <SuggestSubscriptionModule selected={{ id: form.subscription_module_id, name: form.subscription_module_name }} value={form.subscription_module_id} onChange={setValue('subscription_module_id')} />
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <div className='grid grid-cols-2 gap-3'>
                    <TextField value={form.price} onChange={setValue('price')} type='number' placeholder='Enter price'>Price</TextField>
                    <TextField type="number" value={form.code} onChange={setValue('code')} placeholder='Enter code'>Code</TextField>
                </div>

                <TextField
                    value={form.description}
                    multiline rows={5}
                    onChange={setValue('description')}
                    placeholder='Enter Description'
                >Description</TextField>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

