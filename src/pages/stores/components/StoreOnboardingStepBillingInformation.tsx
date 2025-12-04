import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useRef, useState } from 'react'
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';
import { useDefaultParams } from '@/hooks/use-default-params';
import FileDrop from '@/components/common/FileDrop';
import SafeHtml from '@/components/common/SafeHtml';
import { StoreService } from '@/services/StoreService';
import { Progress } from '@/components/ui/progress';
import Btn from '@/components/common/Btn';
import NoRecords from '@/components/common/NoRecords';
import { LuTrash2 } from 'react-icons/lu';
import { downloadFile } from '@/lib/utils';
import { msg } from '@/lib/msg';



export default function StoreOnboardingStepBillingInformation({ organization_id, $state, onLoading, registerCallback }: OrganizationOnboardingStepsProps & {
    organization_id?: number
}) {
    const { context } = useGlobalContext();
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const [form, setForm] = useState<any>({
        media: []
    });
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);

    const uploadingRef = useRef(false);
    const [uploads, setUploads] = useState<{
        id: number,
        file: File,
        progress: number,
        uploading: boolean,
        uploaded: boolean
    }[]>([]);


    const beginUpload = async (upload_index: number) => {
        if (uploadingRef.current || !id) return;

        const upload = uploads[upload_index];
        if (!upload || upload.uploaded || upload.uploading) return;

        uploadingRef.current = true;

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = { ...updated[upload_index], uploading: true, progress: 0 };
            return updated;
        });

        const r = await StoreService.uploadDocument({
            file: upload.file,
            id: Number(id),
        }, (progress: number) => {
            setUploads(prev => {
                const updated = [...prev];
                updated[upload_index] = { ...updated[upload_index], progress };
                return updated;
            });
        });

        if (r.success) {
            setValue('media[]')(r.data);
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

    const load = async () => {
        setLoading(true);
        var r = await StoreService.loadBillingDetails(Number(id));
        if (r.success) {
            setForm((f: any) => ({ ...f, ...r.data }));
            var r = await StoreService.loadDocuments(Number(id));
            if (r.success) {
                setForm((f: any) => ({ ...f, ...r.data }));
                setLoading(false);
            }
        }

    }

    useEffect(() => {
        registerCallback?.(async () => {
            var r = await StoreService.saveBillingDetails({ ...$state, ...form });
            return r.success;
        })
    });

    useEffect(() => {
        onLoading?.(loading);
    }, [loading])

    useEffect(() => {
        if (!!id) {
            load();
        } else {
            setLoading(false);
        }
    }, []);


    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
            <AppCard
                title='Billing Information'
                subtitle='Please provide billing information about store'
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <TextField value={form.gst_number} onChange={setValue('gst_number')} placeholder="Enter school name">GST Number</TextField>
                <TextField value={form.billing_address} onChange={setValue('billing_address')} placeholder="Enter billing address" multiline>Billing Address</TextField>

            </AppCard>
            <AppCard
                title='Required Documents'
                subtitle='Please provide documents mentioned in instructions'
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <div className='p-3 bg-accent rounded-lg border'>
                    <SafeHtml html={context.settings.store_document_instructions} />
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
                        {form.media.map((m: any) => {
                            return <div className='relative group overflow-hidden rounded-lg transition-all' key={m.id}>
                                <div className='absolute w-full h-full left-0 right-0 bg-black transition-all bg-opacity-60 opacity-0 group-hover:opacity-100 flex flex-row items-center justify-center'>
                                    <div className='flex flex-row gap-3'>

                                        <Btn size={'xs'} variant={'outline'} loading={m.deleting} onClick={async () => {
                                            setValue(`media[id:${m.id}].deleting`)(true);
                                            var r = await StoreService.deleteDocument({
                                                id: id,
                                                organization_document_id: m.id
                                            });
                                            if (r.success) {
                                                setValue('media')(r.data);
                                            } else {
                                                setValue(`media[id:${m.id}].deleting`)(false);
                                            }
                                        }}><LuTrash2 /></Btn>
                                    </div>
                                </div>

                            </div>
                        })}
                    </div>
                    {form.media.length == 0 && !loading && <NoRecords title="No Documents" subtitle="Try uploading required documents mentioned in instructions" />}
                    {form.media.map((m: any) => {
                        return <div id={m.id} className='flex flex-row items-center justify-between gap-3 border rounded-sm p-1'>
                            <span className='text-xs'>{m.media_name}</span>
                            <div className='flex flex-row items-center gap-2'>
                                <Btn variant={'outline'} size={'xs'} asyncClick={async () => {
                                    await downloadFile(m.media_path, m.media_name);
                                }}>Download</Btn>
                                <Btn variant={'destructive'} size={'xs'} asyncClick={async () => {
                                    await msg.confirm('Delete document ' + m.media_name, 'Document will be deleted, this action cannot be undone.', {
                                        onConfirm: async () => {
                                            var r = await StoreService.deleteDocument({
                                                id,
                                                organization_document_id: m.id
                                            });
                                            if (r.success) {
                                                setValue('media')(form.media.filter((mx: any) => mx.id !== m.id));
                                            }
                                            return r.success;
                                        }
                                    })
                                }}><LuTrash2 /></Btn>
                            </div>
                        </div>
                    })}
                </div>


            </AppCard>
        </div>
    )
}
