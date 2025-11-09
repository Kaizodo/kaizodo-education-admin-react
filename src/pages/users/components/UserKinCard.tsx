import AppCard from '@/components/app/AppCard'
import Btn from '@/components/common/Btn'
import CenterLoading from '@/components/common/CenterLoading'
import Dropdown from '@/components/common/Dropdown'
import { Modal, ModalBody, ModalFooter } from '@/components/common/Modal'
import NoRecords from '@/components/common/NoRecords'
import TextField from '@/components/common/TextField'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getDefaultPaginated, PaginationType } from '@/data/pagination'
import { getRelationName, RelationArray } from '@/data/user'
import { useSetValue } from '@/hooks/use-set-value'
import { ApiResponseType } from '@/lib/api'
import { msg } from '@/lib/msg'
import { nameLetter } from '@/lib/utils'
import { UserKinService } from '@/services/UserKinService'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FaEnvelope, FaPhone } from 'react-icons/fa6'

type Props = {
    id: number
}

export default function UserKinCard({ id }: Props) {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());

    const search = async () => {
        setSearching(true);
        var r = await UserKinService.search({
            user_id: id,
            page: 1,
            keyword: ''
        });
        if (r.success) {
            setPaginated(r.data);
            setSearching(false);
        }
    }





    const openEditor = (record?: any) => {
        const modal_id = Modal.show({
            title: 'Add New Kin',
            content: () => {
                const [saving, setSaving] = useState(false);
                const [form, setForm] = useState<any>(record ?? {});
                const setValue = useSetValue(setForm);
                const save = async () => {
                    setSaving(true);
                    let r: ApiResponseType;
                    if (record) {
                        r = await UserKinService.update({ ...form, id: record?.id, user_id: id });
                    } else {
                        r = await UserKinService.create({ ...form, user_id: id });
                    }
                    if (r.success) {
                        search();
                        msg.success(record ? 'Kin updated' : 'Kin created');
                        Modal.close(modal_id);
                    }
                    setSaving(false);
                }

                return <>
                    <ModalBody>
                        <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                        <TextField value={form.email} onChange={setValue('email')}>Email</TextField>
                        <TextField value={form.mobile} onChange={setValue('mobile')}>Phone / Mobile</TextField>
                        <Dropdown value={form.relation} onChange={setValue('relation')} placeholder='Select relation' getOptions={async () => {
                            return RelationArray;
                        }} >Relation</Dropdown>
                    </ModalBody>
                    <ModalFooter>
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
        <AppCard title='Emergency Contacts'>
            {searching && <CenterLoading className='h-[200px] relative' />}
            {!searching && paginated.records.length == 0 && <NoRecords title='No Contacts found' subtitle='Try adding some contacts' action={<Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn>} />}
            {!searching && paginated.records.map((record, i) => (
                <div key={i} className="flex flex-row items-center gap-3 p-3 border-b">
                    <Avatar>
                        <AvatarFallback>
                            {nameLetter(record.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col flex-1'>
                        <div className='flex flex-row items-center gap-3'>
                            <strong>{record.name}</strong>
                            <Badge>{getRelationName(record.relation)}</Badge>
                        </div>
                        <div className='gap-3 flex flex-row items-center text-sm'><FaPhone /> {record.mobile}</div>
                        <div className='gap-3 flex flex-row items-center text-sm'><FaEnvelope /> {record.email}</div>
                    </div>

                    <div className="flex gap-1">
                        <Btn size="sm" onClick={() => openEditor(record)}>Edit</Btn>
                        <Btn size="sm" variant="destructive" onClick={() => {
                            msg.confirm('Delete ' + record.name + ' ?', 'This action will delete ' + record.name + '', {
                                onConfirm: async () => {
                                    var r = await UserKinService.delete(record.id);
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
                    <Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn>
                </div>
            </>}
        </AppCard>
    )
}
