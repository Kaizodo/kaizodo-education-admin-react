
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { OrganizationVendorService } from '@/services/OrganizationVendorService';


import GstSearch from '@/pages/organizations/components/GstSearch';
import { useGlobalContext } from '@/hooks/use-global-context';
import NoRecords from '@/components/common/NoRecords';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function OrganizationVendorEditor({ id, onSuccess, onCancel }: Props) {
    const { context } = useGlobalContext();
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
        var r = await OrganizationVendorService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await OrganizationVendorService.update({ ...form, organization_id: context.organization.id });
        } else {
            r = await OrganizationVendorService.create({ ...form, organization_id: context.organization.id });
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

    if (!context?.organization?.id) {
        return <NoRecords title='Please select a store' subtitle='To create a vendor please a store to begin with.' />
    }

    return (
        <>
            <ModalBody className='relative'>
                {!!loading && <CenterLoading className='absolute z-[50]' />}

                <TextField value={form.name} onChange={setValue('name')} placeholder="Enter name">Contact Person Name</TextField>

                <TextField value={form.mobile} onChange={setValue('mobile')} placeholder="Enter mobile">Mobile</TextField>
                <TextField value={form.email} onChange={setValue('email')} placeholder="Enter email">Email</TextField>
                <GstSearch
                    organization={form.organization}
                    askGstin={false}
                    organization_id={context.organization.id}
                    onChange={setValue('vendor_organization_id', 'organization')}
                />





            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

