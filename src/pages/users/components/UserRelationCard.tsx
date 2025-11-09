import AppCard from "@/components/app/AppCard"
import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import Dropdown from "@/components/common/Dropdown";
import { Modal, ModalBody, ModalFooter } from "@/components/common/Modal";
import NoRecords from "@/components/common/NoRecords";
import SuggestUser from "@/components/common/suggest/SuggestUser";
import TextField from "@/components/common/TextField";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PaginationType, getDefaultPaginated } from "@/data/pagination";
import { getRelationName, RelationArray, UserType } from "@/data/user"
import { useSetValue } from "@/hooks/use-set-value";
import { ApiResponseType } from "@/lib/api";
import { msg } from "@/lib/msg";
import { nameLetter } from "@/lib/utils";
import { UserRelationService } from "@/services/UserRelationService";
import { UserService } from "@/services/UserService";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaEnvelope, FaPhone, FaPlus } from "react-icons/fa6";

type Props = {
    id: number,
    user_type: UserType
}

export default function UserRelationCard({ id, user_type }: Props) {
    var title = 'Relation';
    switch (user_type) {
        case UserType.Student:
            title = 'Parents';
            break;
        case UserType.Parent:
            title = 'Children';
            break;
        case UserType.Employee:
            title = 'Subborinates'
            break;
        default:
            title = 'User Relation'
            break;
    }

    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());

    const search = async () => {
        setSearching(true);
        var r = await UserRelationService.search({
            user_id: id,
            page: 1,
            keyword: ''
        });
        if (r.success) {
            setPaginated(r.data);
            setSearching(false);
        }
    }

    const addExisting = () => {
        const modal_id = Modal.show({
            title: 'Add Existing ' + title,
            content: () => {
                const [saving, setSaving] = useState(false);
                const [form, setForm] = useState<any>({});
                const setValue = useSetValue(setForm);
                const save = async () => {
                    setSaving(true);
                    let r: ApiResponseType;
                    r = await UserRelationService.create({ ...form, user_id: id });
                    if (r.success) {
                        search();
                        msg.success('relation created');
                        Modal.close(modal_id);
                    }
                    setSaving(false);
                }

                return <>
                    <ModalBody>
                        <SuggestUser value={form.relative_user_id} user_type={UserType.Parent} onChange={setValue('relative_user_id')} placeholder="Select a parent">Select Existing Parent</SuggestUser>
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

    const openEditor = (record?: any) => {
        const modal_id = Modal.show({
            title: 'Add New Relation',
            content: () => {
                const [saving, setSaving] = useState(false);
                const [form, setForm] = useState<any>(record ?? {});
                const setValue = useSetValue(setForm);
                const save = async () => {
                    setSaving(true);
                    let r: ApiResponseType;
                    if (record) {
                        r = await UserService.update({ ...form, user_type: UserType.Parent, id: record?.id, user_id: id });
                    } else {
                        r = await UserService.create({ ...form, user_type: UserType.Parent, create_relation: true, user_id: id });
                    }
                    if (r.success) {
                        search();
                        msg.success(record ? 'relation updated' : 'relation created');
                        Modal.close(modal_id);
                    }
                    setSaving(false);
                }

                return <>
                    <ModalBody>
                        <Dropdown value={form.relation} onChange={setValue('relation')} placeholder='Select relation' getOptions={async () => {
                            return RelationArray;
                        }} >Relation</Dropdown>
                        <div className="grid grid-cols-2 gap-3">
                            <TextField value={form.first_name} onChange={setValue('first_name')}>First Name</TextField>
                            <TextField value={form.last_name} onChange={setValue('last_name')}>Last Name</TextField>
                        </div>
                        <TextField value={form.mobile} onChange={setValue('mobile')}>Mobile</TextField>
                        <TextField value={form.email} onChange={setValue('email')}>Email</TextField>


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
        <AppCard title={title}>
            {searching && <CenterLoading className='h-[200px] relative' />}
            {!searching && paginated.records.length == 0 && <NoRecords title='No Relation found' subtitle='Try adding some relations' action={<div className="flex flex-row gap-3">
                <Btn size={'sm'} onClick={() => addExisting()}><FaSearch />Search Existing</Btn>
                <Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn>

            </div>} />}
            {!searching && paginated.records.map((record, i) => (
                <div key={i} className="flex flex-row items-center gap-3 p-3 border-b">
                    <Avatar>
                        <AvatarImage src={record.image} />
                        <AvatarFallback>
                            {nameLetter(record.first_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col flex-1'>
                        <div className='flex flex-row items-center gap-3'>
                            <strong>{record.first_name} {record.last_name}</strong>
                            <Badge>{getRelationName(record.relation)}</Badge>
                        </div>
                        {!!record.mobile && <div className='gap-3 flex flex-row items-center text-sm'><FaPhone /> {record.mobile}</div>}
                        {!!record.email && <div className='gap-3 flex flex-row items-center text-sm'><FaEnvelope /> {record.email}</div>}
                    </div>

                    <div className="flex gap-1">
                        <Btn size="sm" onClick={() => openEditor(record)}>Edit</Btn>
                        <Btn size="sm" variant="destructive" onClick={() => {
                            msg.confirm('Delete ' + record.name + ' ?', 'This action will delete ' + record.name + '', {
                                onConfirm: async () => {
                                    var r = await UserRelationService.delete(record.id);
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
                <div className='p-3 flex flex-row gap-3'>
                    <Btn size={'sm'} onClick={() => addExisting()}><FaSearch />Search Existing</Btn>
                    <Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn>
                </div>
            </>}
        </AppCard>
    )
}
