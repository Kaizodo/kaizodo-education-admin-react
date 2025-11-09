
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import TextField from '@/components/common/TextField';
import { BannerCategoryService } from '@/services/BannerCategoryService';

interface Props {
    id?: number,
    onCancel: () => void,
    onSuccess: (data: any) => void
}

export default function BannerCategoryEditorDialog({ id, onCancel, onSuccess }: Props) {
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadDetail = async () => {
        setLoading(true);
        var r = await BannerCategoryService.detail(id as number);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        } else {
            onCancel();
        }
    }
    useEffect(() => {
        if (id) {
            loadDetail();
        } else {
            setLoading(false);
        }
    }, [id])

    const save = async () => {
        setSaving(true);
        var r: ApiResponseType;
        if (id) {
            r = await BannerCategoryService.update(form);
        } else {
            r = await BannerCategoryService.create(form);
        }

        if (r.success) {
            msg.success(id ? 'Banner category updated successfuly' : 'Banner category created successfuly');
            onSuccess(r.data);
        }
        setSaving(false);
    };

    return (
        <div className='relative'>
            {loading && <CenterLoading className='absolute' />}
            <ModalBody>
                <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                <TextField value={form.slug} onChange={setValue('slug')}>Slug / Url</TextField>
            </ModalBody>
            <ModalFooter>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>
        </div>
    );
};

