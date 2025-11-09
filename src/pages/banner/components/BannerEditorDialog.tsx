import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import TextField from '@/components/common/TextField';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';
import { getImageObjectUrl } from '@/lib/utils';
import { BannerService } from '@/services/BannerService';
import SuggestBannerCategory from '@/components/common/suggest/SuggestBannerCategory';

interface Props {
    id?: number,
    onCancel: () => void,
    onSuccess: (data: any) => void
}

export default function BannerEditorDialog({ id, onCancel, onSuccess }: Props) {
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { openCropperFile } = useCropper();

    const loadDetail = async () => {
        setLoading(true);
        var r = await BannerService.detail(id as number);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        } else {

            onCancel();
        }
    }
    useEffect(() => {
        if (id) {
            loadDetail();
        } else {
            setLoading(false);
        }
    }, [id])

    const save = async () => {
        setSaving(true);
        var r: ApiResponseType;
        if (id) {
            r = await BannerService.update(form);
        } else {
            r = await BannerService.create(form);
        }

        if (r.success) {
            msg.success(id ? 'Banner updated successfuly' : 'Banner created successfuly');
            onSuccess(r.data);
        }
        setSaving(false);
    };

    return (
        <div className='relative'>
            {loading && <CenterLoading className='absolute' />}
            <ModalBody>
                <div className='max-w-[500px]'>
                    {!!form.image && <img src={form.image} onError={() => setValue('image')(null)} className='w-full border rounded-sm' />}
                </div>

                    <TextField value={form.name} onChange={setValue('name')} placeholder="Title">Title</TextField>
                    <SuggestBannerCategory value={form.banner_category_id} onChange={setValue('banner_category_id')} selected={{ id: form.banner_category_id, name: form.bannner_category_name }}></SuggestBannerCategory>
                    <TextField value={form.description} onChange={setValue('description')} multiline placeholder="Short description">Description</TextField>
                    <TextField value={form.on_click_url} onChange={setValue('on_click_url')} placeholder="Enter Btn Url">Btn Click</TextField>
                    <FileField onChange={async (files) => {
                        if (files.length > 0) {
                            const file = await openCropperFile(files[0], {
                                aspectRatio: 3 / 2,
                                format: 'file'
                            });
                            if (file instanceof File) {
                                const image = await getImageObjectUrl(file);
                                setValue('image_file', 'image')(file, image);
                            }
                        }
                    }}>Featured Image</FileField>
            </ModalBody>
            <ModalFooter>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>
        </div>
    );
};

