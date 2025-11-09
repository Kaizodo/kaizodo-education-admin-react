
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import Richtext from '@/components/common/Richtext';
import { getImageObjectUrl, strToSlug } from '@/lib/utils';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';
import { CustomPageService } from '@/services/CustomPageService';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';


interface Props {
    id?: number,
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CustomPageEditorDailog({ id, onSuccess, onCancel }: Props) {
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
        var r = await CustomPageService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await CustomPageService.update(form);
        } else {
            r = await CustomPageService.create(form);
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
                <div className='max-w-[500px]'>
                    {!!form.image && <img src={form.image} onError={() => setValue('image')(null)} className='w-full border rounded-sm' />}
                </div>
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
                <TextField value={form.name} onChange={setValue('name')}>Title</TextField>
                <TextField value={strToSlug(!form.slug ? form.name : form.slug)} onChange={setValue('slug')} placeholder="Slug / url">Slug / Url</TextField>
                <TextField value={form.description} onChange={setValue('description')} multiline>Description</TextField>
                <Richtext value={form.content} onChange={setValue('content')}>Content</Richtext>

                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

