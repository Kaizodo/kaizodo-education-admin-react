
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { TicketCategoryService } from '@/services/TicketCategoryService';
import Dropdown from '@/components/common/Dropdown';
import { TicketCategoryTypeArray } from '@/data/Ticket';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function TicketCategoryModuleEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await TicketCategoryService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await TicketCategoryService.update(form);
        } else {
            r = await TicketCategoryService.create(form);
        }
        if (r.success) {
            msg.success(id ? 'Record updated successfully' : 'Record created successfully');
            onSuccess(r.data);
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
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField
                    value={form.description}
                    multiline rows={5}
                    onChange={setValue('description')}
                    placeholder='Enter Description'
                >Description</TextField>
                <Dropdown searchable={false} value={form.ticket_category_type} onChange={setValue('ticket_category_type')} getOptions={async () => TicketCategoryTypeArray}>Category Type</Dropdown>
                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish ?</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

