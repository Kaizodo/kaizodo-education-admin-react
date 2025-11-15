import { RiImageAddLine, RiImageAiLine } from 'react-icons/ri'
import { CommonProductStateProps } from './ProductEditorForm'
import FileDrop from '@/components/common/FileDrop'
import NoRecords from '@/components/common/NoRecords'
import { ProductService } from '@/services/ProductService';
import { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import SafeImage from '@/components/common/SafeImage';
import Btn from '@/components/common/Btn';
import { LuHeart, LuTrash2 } from 'react-icons/lu';
import { FaHeartCircleCheck } from 'react-icons/fa6';

export default function ProductMediaInformation({ state, setStateValue }: CommonProductStateProps) {
    const uploadingRef = useRef(false);
    const [uploads, setUploads] = useState<{
        id: number,
        file: File,
        progress: number,
        uploading: boolean,
        uploaded: boolean
    }[]>([]);


    const beginUpload = async (upload_index: number) => {
        if (uploadingRef.current) return;

        const upload = uploads[upload_index];
        if (!upload || upload.uploaded || upload.uploading) return;

        uploadingRef.current = true;

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = { ...updated[upload_index], uploading: true, progress: 0 };
            return updated;
        });

        const r = await ProductService.uploadMedia({
            media: upload.file,
            product_id: state.product.id,
        }, (progress: number) => {
            setUploads(prev => {
                const updated = [...prev];
                updated[upload_index] = { ...updated[upload_index], progress };
                return updated;
            });
        });

        if (r.success) {
            setStateValue('media[]')(r.data);
        }

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = {
                ...updated[upload_index],
                uploading: false,
                uploaded: !!r.success,
                progress: r.success ? 100 : updated[upload_index].progress
            };
            return updated;
        });

        uploadingRef.current = false;

        // check if any remaining uploads
        const latestUploads = [...uploads]; // read stale-free snapshot
        const nextIndex = latestUploads.findIndex((u, idx) => idx > upload_index && !u.uploaded && !u.uploading);

        if (nextIndex !== -1) {
            beginUpload(nextIndex);
        } else {
            setUploads([]);
        }
    };

    useEffect(() => {
        if (!uploadingRef.current) {
            const nextIndex = uploads.findIndex(u => !u.uploaded && !u.uploading);
            if (nextIndex !== -1) beginUpload(nextIndex);
        }
    }, [uploads]);

    var featured = state.media.find(m => !!m.featured);


    return (
        <div className="flex flex-row gap-3 items-start">
            <div className="w-[300px] flex flex-col border rounded-lg p-3 ">
                <div className="aspect-square ">
                    {!featured && (
                        <div className="rounded-lg bg-gray-200 h-full flex items-center justify-center text-5xl text-gray-400">
                            <RiImageAiLine />
                        </div>
                    )}

                    {!!featured && (
                        <SafeImage
                            src={featured.media_path}
                            className="rounded-lg h-full w-full object-cover"
                        >
                            <div className="rounded-lg bg-gray-200 h-full flex items-center justify-center text-5xl text-gray-400">
                                <RiImageAiLine />
                            </div>
                        </SafeImage>
                    )}

                </div>
                <div className='grid grid-cols-4 gap-3 mt-3'>
                    {state.media.slice(0, 4).map(m => {
                        return <div className='' key={m.id}>
                            <SafeImage
                                src={m.media_path}
                                className="rounded-lg h-full w-full object-cover"
                            >
                                <div className="rounded-lg bg-gray-200 h-full flex items-center justify-center text-5xl text-gray-400">
                                    <RiImageAiLine />
                                </div>
                            </SafeImage>
                        </div>
                    })}
                </div>
            </div>

            <div className="flex-1">
                <FileDrop onChange={(files) => setUploads(ups => ([...ups, ...files.map((f, fi) => ({
                    id: new Date().getTime() + fi,
                    file: f,
                    progress: 0,
                    uploading: false,
                    uploaded: false
                }))]))} />
                {uploads.map((upload, upload_index) => <div key={'upload_' + upload_index} className="border rounded-lg p-1">
                    <div>{upload.file.name}</div>
                    <div className="flex flex-row items-center">
                        <Progress value={upload.progress} className="h-2 flex-1" />
                        <div className="w-6 text-xs text-center">{upload.progress}%</div>
                    </div>
                </div>)}
                <div className='grid grid-cols-4 gap-3 py-6'>
                    {state.media.map(m => {
                        return <div className='relative group overflow-hidden rounded-lg transition-all' key={m.id}>
                            <div className='absolute w-full h-full left-0 right-0 bg-black transition-all bg-opacity-60 opacity-0 group-hover:opacity-100 flex flex-row items-center justify-center'>
                                <div className='flex flex-row gap-3'>
                                    <Btn size={'xs'} variant={m.featured ? 'default' : 'outline'} loading={m.featuring} onClick={async () => {
                                        if (m.featured) {
                                            return;
                                        }
                                        setStateValue(`media[id:${m.id}].featuring`)(true);
                                        var r = await ProductService.featureMedia({ product_id: state.product.id, product_media_id: m.id });
                                        if (r.success) {
                                            setStateValue('media')(r.data);
                                        } else {
                                            setStateValue(`media[id:${m.id}].featuring`)(false);
                                        }
                                    }}>
                                        {m.featured == 0 ? <LuHeart /> : <FaHeartCircleCheck />}
                                    </Btn>
                                    <Btn size={'xs'} variant={'outline'} loading={m.deleting} onClick={async () => {
                                        setStateValue(`media[id:${m.id}].deleting`)(true);
                                        var r = await ProductService.deleteMedia({ product_id: state.product.id, product_media_id: m.id });
                                        if (r.success) {
                                            setStateValue('media')(r.data);
                                        } else {
                                            setStateValue(`media[id:${m.id}].deleting`)(false);
                                        }
                                    }}><LuTrash2 /></Btn>
                                </div>
                            </div>
                            <SafeImage
                                src={m.media_path}
                                className="rounded-lg h-full w-full object-cover"
                            >
                                <div className="rounded-lg bg-gray-200 h-full flex items-center justify-center text-5xl text-gray-400">
                                    <RiImageAiLine />
                                </div>
                            </SafeImage>
                        </div>
                    })}
                </div>
                <NoRecords icon={RiImageAddLine} title="Add Images" subtitle="Try uploading some images" />
            </div>
        </div>
    )
}
