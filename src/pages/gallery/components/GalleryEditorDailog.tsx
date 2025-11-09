
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import Richtext from '@/components/common/Richtext';
import FileDrop from '@/components/common/FileDrop';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import { MediaType } from '@/data/Media';
import { Download, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { downloadFile, formatBytes, getImageObjectUrl, strToSlug } from '@/lib/utils';
import { GalleryService } from '@/services/GalleryService';
import DateTimeField from '@/components/common/DateTimeField';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';


interface Props {
    id?: number,
    onSuccess: () => void;
    onCancel: () => void;
}

type Uploads = {
    file?: File,
    url?: string,
    media_path: string,
    media_name: string,
    media_size: number,
    media_type: MediaType,
    id: number,
    uploading?: boolean,
    uploaded?: boolean,
    deleting?: boolean,
    progress?: number
};

export default function GalleryEditorDailog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [files, setFiles] = useState<Uploads[]>([]);
    const { openCropperFile } = useCropper();

    const beginUpload = async (gallery_id: number, uploads: Uploads[]) => {
        var upload = uploads.find(f => !f.uploaded);
        if (!upload) {
            return;
        }
        var file = upload.file;
        if (!file) {
            return;
        }
        setFiles(fs => fs.map(f => (f.id == upload?.id ? { ...f, uploading: true, uploaded: false, progress: 0 } : f)));
        var r = await GalleryService.uploadMedia({
            file,
            gallery_id
        }, (p) => {
            setFiles(fs => fs.map(f => (f.id == upload?.id ? { ...f, progress: p } : f)));
        });
        if (r.success) {
            upload.uploaded = true;
            await beginUpload(gallery_id, uploads);
        }
    }

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await GalleryService.detail(id);
        if (r.success) {
            setForm(r.data);
            setFiles(r.data.files);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);

        console.log(form);
        let r: ApiResponseType;
        if (id) {
            r = await GalleryService.update(form);
        } else {
            r = await GalleryService.create(form);
        }

        if (r.success) {
            msg.success(id ? 'Gallery has been updated' : 'Gallery has been created');
            if (files.filter(f => !f.uploaded).length > 0) {
                msg.success('Uploading files now....');
                await beginUpload(id ? id : r.data.id, files);
                msg.success('All files are uploaded');
            }
            onSuccess();
        }
        setSaving(false);
    }

    const deleteMedia = async (gallery_media_id: number) => {
        if (!id) {
            return;
        }
        setFiles(fs => fs.map(f => (f.id == gallery_media_id ? { ...f, deleting: true } : f)));
        var r = await GalleryService.deleteMedia({
            gallery_media_id,
            gallery_id: id
        });

        if (r.success) {
            setFiles(r.data);
        } else {
            setFiles(fs => fs.map(f => (f.id == gallery_media_id ? { ...f, deleting: false } : f)));
        }

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
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <TextField value={form.name} onChange={setValue('name')}>
                            Title
                        </TextField>
                    </div>
                    <div>
                        <TextField value={strToSlug(!form.slug ? form.name : form.slug)} onChange={setValue('slug')} placeholder="Slug / url">Slug / Url</TextField>
                    </div>
                </div>


                <DateTimeField inputFormat='Y-MM-DD' outputFormat='Y-MM-DD' previewFormat='DD MMM, Y' value={form.gallery_date} onChange={setValue('gallery_date')} mode='date' placeholder="Select gallery date">Gallery Date</DateTimeField>
                <FileField onChange={async (files) => {
                    if (files.length > 0) {
                        const file = await openCropperFile(files[0], {
                            aspectRatio: 16 / 9,
                            format: 'file'
                        });
                        if (file instanceof File) {
                            const image = await getImageObjectUrl(file);
                            setValue('image_file', 'image')(file, image);
                        }
                    }
                }}>Featured Image</FileField>
                <Richtext value={form.content} onChange={setValue('content')}>Description</Richtext>
                <div className='bg-white rounded-lg  shadow-sm border'>
                    {files.map((f, idx) => (
                        <div key={f.id} className="flex items-center gap-4 p-2 border-b">
                            <div className="flex-1">
                                <div className="font-medium">{f.media_name} <Badge>{formatBytes(f.media_size)}</Badge></div>
                                {f.uploading && (
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        Uploading...
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${f.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {f.uploaded && <div className="text-green-600 text-sm">Uploaded</div>}
                            </div>
                            {!saving && f.uploaded && <Btn

                                size={'xs'}
                                onClick={() => downloadFile(f.media_path, f.media_name)}
                            >
                                <Download />Download
                            </Btn>}
                            {!saving && <Btn
                                variant={'destructive'}
                                size={'xs'}
                                loading={f.deleting}
                                onClick={() => {
                                    if (!f.uploaded) {
                                        setFiles(prev => prev.filter((_, i) => i !== idx));
                                    } else {
                                        msg.confirm("Delete " + f.media_name, f.media_name + ' will be deleted permanently.', {
                                            onConfirm: async () => {
                                                await deleteMedia(f.id);
                                            }
                                        })
                                    }
                                }}
                            >
                                <Trash2 />
                            </Btn>}
                        </div>
                    ))}
                </div>

                <FileDrop onChange={(files) => setFiles(pf => [...pf, ...files.map((f, i) => ({
                    file: f,
                    media_name: f.name,
                    id: new Date().getTime() + i,
                    media_type: MediaType.Document,
                    media_size: f.size,
                    media_path: f.name
                }))])} accept={['image']} title='Drop gallery images here or click to browse' className="min-h-[200px]" />
                <Radio options={YesNoArray} value={form.publish} onChange={setValue('publish')}>Publish</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

