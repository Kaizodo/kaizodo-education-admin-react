
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
import { TicketCategoryActionArray } from '@/data/Ticket';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import { ProductTypeArray } from '@/data/Product';
import SuggestTicketCategory from '@/components/common/suggest/SuggestTicketCategory';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function TicketCategoryEditorDialog({ id, onSuccess, onCancel }: Props) {
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
                <SuggestTicketCategory
                    value={form.ticket_category_id}
                    onChange={setValue('ticket_category_id')}
                    selected={{ id: form.ticket_category_id, name: form.ticket_category_name }}
                    is_main={1}
                >Parent Ticket Category</SuggestTicketCategory>
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField
                    value={form.description}
                    multiline rows={5}
                    onChange={setValue('description')}
                    placeholder='Enter Description'
                >Description</TextField>
                <Dropdown
                    searchable={false}
                    placeholder='Select an action'
                    value={form.ticket_category_action}
                    onChange={setValue('ticket_category_action')}
                    getOptions={async () => TicketCategoryActionArray}
                >Category Action</Dropdown>
                <Radio value={form.is_main} onChange={setValue('is_main')} options={YesNoArray}>Main Category ?</Radio>
                <Radio value={form.product_type} onChange={setValue('product_type')} options={ProductTypeArray}>Product Type</Radio>
                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish ?</Radio>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

