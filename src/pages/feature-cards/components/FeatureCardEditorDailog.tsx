
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { getImageObjectUrl } from '@/lib/utils';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';
import { FeatureCardService } from '@/services/FeatureCardService';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';


interface Props {
    id?: number,
    onSuccess: () => void;
    onCancel: () => void;
}

export default function FeatureCardEditorDailog({ id, onSuccess, onCancel }: Props) {
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
        var r = await FeatureCardService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await FeatureCardService.update(form);
        } else {
            r = await FeatureCardService.create(form);
        }

        if (r.success) {
            msg.success(id ? 'Custom Page updated' : 'Custom Page created');
            onSuccess();
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
                }}>Featured Image</FileField>

                <div className='max-w-[150px] bg-white  p-2 border rounded-sm'>
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
                }}>Banner Image (Shown on detail page)</FileField>

                <TextField value={form.name} onChange={setValue('name')}>Title</TextField>
                <TextField value={form.description} onChange={setValue('description')} multiline>Description</TextField>
                <TextField value={form.embed_video_url} onChange={setValue('embed_video_url')}>Youtube video url</TextField>
                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

