import AppCard from "@/components/app/AppCard"
import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import FileField from "@/components/common/FileField";
import { Modal, ModalBody, ModalFooter } from "@/components/common/Modal";
import NoRecords from "@/components/common/NoRecords";
import SuggestDocumentType from "@/components/common/suggest/SuggestDocumentType";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PaginationType, getDefaultPaginated } from "@/data/pagination";
import { useSetValue } from "@/hooks/use-set-value";
import { msg } from "@/lib/msg";
import { UserDocumentService } from "@/services/UserDocumentService";
import { useState, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";

type Props = {
    id: number
}

export default function UserDocumentCard({ id }: Props) {

    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [progress, setProgress] = useState(0);

    const search = async () => {
        setSearching(true);
        var r = await UserDocumentService.search({
            user_id: id,
            page: 1,
            keyword: ''
        });
        if (r.success) {
            setPaginated(r.data);
            setSearching(false);
        }
    }





    const openEditor = () => {
        const modal_id = Modal.show({
            title: 'Upload Document',
            content: () => {
                const [saving, setSaving] = useState(false);
                const [form, setForm] = useState<any>({});
                const setValue = useSetValue(setForm);
                const save = async () => {
                    setSaving(true);
                    let r = await UserDocumentService.create({ ...form, user_id: id }, setProgress);
                    if (r.success) {
                        search();
                        msg.success('Document uploaded');
                        Modal.close(modal_id);
                    }
                    setSaving(false);
                }

                return <>
                    <ModalBody>
                        <FileField onChange={(files) => setValue('document')(files[0])}>Pick Document</FileField>
                        <SuggestDocumentType value={form.document_type_id} onChange={setValue('document_type_id')} />
                    </ModalBody>
                    <ModalFooter className="flex flex-row items-center gap-3">
                        {saving && <div className="flex-1">
                            <Progress value={progress} />
                        </div>}
                        <Btn onClick={save} loading={saving}>Save</Btn>
                    </ModalFooter>
                </>
            }
        });
    }

    useEffect(() => {
        search();
    }, [id])

    return (
        <AppCard title='Documents'>
            {searching && <CenterLoading className='h-[200px] relative' />}
            {!searching && paginated.records.length == 0 && <NoRecords title='No Documents found' subtitle='Try uploading some documents' action={<Btn size={'sm'} onClick={() => openEditor()}><FaFileUpload />Upload New</Btn>} />}
            {!searching && paginated.records.map((record, i) => (
                <div key={i} className="flex flex-row items-center gap-3 p-3 border-b">

                    <div className="flex-1 flex flex-col items-start justify-center gap-1">
                        <span className="text-sm" >{record.name}</span>
                        <Badge>{record.document_type_name}</Badge>
                    </div>


                    <div className="flex gap-1">
                        <Btn size="sm" variant="destructive" onClick={() => {
                            msg.confirm('Delete ' + record.name + ' ?', 'This action will delete ' + record.name + '', {
                                onConfirm: async () => {
                                    var r = await UserDocumentService.delete(record.id);
                                    if (r.success) {
                                        search();
                                    }
                                    return r.success;
                                }
                            })
                        }}>Delete</Btn>
                    </div>
                </div>
            ))}
            {!searching && paginated.records.length > 0 && <>
                <div className='p-3'>
                    <Btn size={'sm'} onClick={() => openEditor()}><FaFileUpload />Upload New</Btn>
                </div>
            </>}
        </AppCard>
    )
}
