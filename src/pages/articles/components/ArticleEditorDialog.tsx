import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import TextField from '@/components/common/TextField';
import DateTimeField from '@/components/common/DateTimeField';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { ArticleService } from '@/services/ArticleService';
import Richtext from '@/components/common/Richtext';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import SuggestArticleCategory from '@/components/common/suggest/SuggestArticleCategory';
import FileField from '@/components/common/FileField';
import { useCropper } from '@/hooks/use-cropper';
import { getImageObjectUrl, strToSlug } from '@/lib/utils';
import { SeoBtn } from '@/components/common/seo-manager/SeoManager';
import { Seo } from '@/data/Seo';
import { ArticleType } from '@/data/article';


interface Props {
    id?: number,
    article_type: ArticleType,
    onCancel: () => void,
    onSuccess: (data: any) => void
}

export default function ArticleEditorDialog({ id, article_type, onCancel, onSuccess }: Props) {
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
    const { openCropperFile } = useCropper();

    const loadDetail = async () => {
        setLoading(true);
        var r = await ArticleService.detail(id as number);
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
            r = await ArticleService.update({ ...form, article_type });
        } else {
            r = await ArticleService.create({ ...form, article_type });
        }

        if (r.success) {
            msg.success(id ? name + ' updated successfuly' : name + ' created successfuly');
            onSuccess(r.data);
        }
        setSaving(false);
    };

    return (
        <div className='relative'>
            {loading && <CenterLoading className='absolute' />}
            <ModalBody>
                <div className='max-w-[500px]'>
                    {!!form.image && <img src={form.image} onError={() => setValue('image')(null)} className='w-full border rounded-sm' />}
                </div>

                <div className='grid grid-cols-2 gap-3'>
                    <TextField value={form.name} onChange={(v) => setValue('name', 'slug')(v, strToSlug(v))} placeholder="Title">Title</TextField>
                    <SuggestArticleCategory article_type={article_type} value={form.article_category_id} onChange={setValue('article_category_id')} selected={{ id: form.article_category_id, name: form.article_category_name }} />
                    <DateTimeField
                        inputFormat='Y-MM-DD HH:mm:ss'
                        outputFormat='Y-MM-DD HH:mm:ss'
                        previewFormat='DD MMM, Y LT'
                        value={form.article_datetime}
                        onChange={setValue('article_datetime')}
                        mode='datetime' placeholder="Select start time"
                    >{name} Date & Time</DateTimeField>
                    <FileField onChange={async (files) => {
                        if (files.length > 0) {
                            const file = await openCropperFile(files[0], {
                                aspectRatio: 16 / 9,
                                format: 'file'
                            });
                            if (file instanceof File) {
                                const image = await getImageObjectUrl(file);
                                setValue('image_file', 'image')(file, image);
                            }
                        }
                    }}>Featured Image</FileField>
                </div>
                <div className='grid grid-cols-2 gap-3'>

                </div>
                <TextField value={form.description} onChange={setValue('description')} multiline placeholder="Short descriptions">Description</TextField>
                <Richtext value={form.content} onChange={setValue('content')} >Content</Richtext>
                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish</Radio>
            </ModalBody>
            <ModalFooter className='justify-between'>
                <SeoBtn id={id} type={Seo.ArticleDetail} title={form.name} description={form.description} />
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>
        </div>
    );
};

