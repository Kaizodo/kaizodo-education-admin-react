
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { TestimonialService } from '@/services/TestimonialService';
import Radio from '@/components/common/Radio';
import { LuUpload } from 'react-icons/lu';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';
import { getImageObjectUrl } from '@/lib/utils';
import { YesNoArray } from '@/data/Common';


interface Props {
    id?: number,
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TestimonialEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const { openCropperFile } = useCropper();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({
        rating: 5
    });
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await TestimonialService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await TestimonialService.update(form);
        } else {
            r = await TestimonialService.create(form);
        }

        if (r.success) {
            msg.success(id ? 'Record updated successfuly' : 'Record added successfuly');
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
                <div className="flex items-center space-x-4 p-3">
                    <div className="w-32 aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {!!form.image && <img src={form.image} onError={() => setValue('image')(undefined)} className='max-w-full max-h-full' />}
                        {!form.image && <LuUpload className="h-8 w-8 text-gray-400" />}
                    </div>
                    <div>
                        <FileField onChange={async (files) => {
                            if (files.length > 0) {
                                var file = files[0];
                                var image = await openCropperFile(file, {
                                    format: 'file',
                                    aspectRatio: 1
                                });

                                if (image instanceof File) {
                                    const url = await getImageObjectUrl(image);
                                    setValue('image_file', 'image')(image, url);
                                }

                            }
                        }}>Upload Photo</FileField>

                    </div>
                </div>
                <TextField value={form.name} onChange={setValue('name')} placeholder='Person name'>Name</TextField>
                <Radio value={form.rating} onChange={setValue('rating')} options={[
                    { id: 1, name: '1 Star' },
                    { id: 2, name: '2 Stars' },
                    { id: 3, name: '3 Stars' },
                    { id: 4, name: '4 Stars' },
                    { id: 5, name: '5 Stars' }
                ]}>Rating</Radio>
                <TextField value={form.designation} onChange={setValue('designation')}>Designation</TextField>
                <TextField value={form.description} onChange={setValue('description')} multiline>Message / Description</TextField>
                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

