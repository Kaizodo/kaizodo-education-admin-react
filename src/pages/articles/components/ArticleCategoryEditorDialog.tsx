
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { ArticleCategoryService } from '@/services/ArticleCategoryService';
import TextField from '@/components/common/TextField';
import { ArticleType } from '@/data/article';

interface Props {
    id?: number,
    article_type: ArticleType,
    onCancel: () => void,
    onSuccess: (data: any) => void
}

export default function ArticleCategoryEditorDialog({ id, article_type, onCancel, onSuccess }: Props) {
    var title = `Blogs`;
    var subtitle = `Manage blogs from this section`;
    var name = `Blog`;

    if (article_type == ArticleType.News) {
        title = 'News';
        subtitle = 'Manage news from this section';
        name = 'News';
    }



    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadDetail = async () => {
        setLoading(true);
        var r = await ArticleCategoryService.detail(id as number);
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
            r = await ArticleCategoryService.update({ ...form, article_type });
        } else {
            r = await ArticleCategoryService.create({ ...form, article_type });
        }

        if (r.success) {
            msg.success(id ? name + ' Category updated successfuly' : name + ' Category created successfuly');
            onSuccess(r.data);
        }
        setSaving(false);
    };

    return (
        <div className='relative'>
            {loading && <CenterLoading className='absolute' />}
            <ModalBody>
                <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
            </ModalBody>
            <ModalFooter>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>
        </div>
    );
};

