import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { ArticleCategoryService } from '@/services/ArticleCategoryService';
import { ArticleType } from '@/data/article';


const LazyEditorDialog = lazy(() => import('@/pages/articles/components/ArticleCategoryEditorDialog'));


export default function SuggestArticleCategory({ article_type, children = 'Article Category', value, onChange, selected, placeholder = 'Select article category', onSelect, includedValues }: SuggestProp & {
    article_type: ArticleType,
}) {
    var title = `Blogs`;
    var subtitle = `Manage blogs from this section`;
    var name = `Blog`;

    if (article_type == ArticleType.News) {
        title = 'News';
        subtitle = 'Manage news from this section';
        name = 'News';
    }

    if (typeof children === 'string') {
        children = `${name} Category`;
    }


    if (typeof placeholder === 'string') {
        placeholder = `Select ${name} Category`;
    }

    return (
        <Dropdown
            searchable={true}
            selected={selected}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add ' + name + ' Category',
                        maxWidth: 700,
                        content: () => <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDialog article_type={article_type} onSuccess={(data) => {
                            updateOptions(data);
                            Modal.close(modal_id);

                        }} onCancel={() => {
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
            getOptions={async ({ page, keyword }) => {
                var r = await ArticleCategoryService.search({
                    article_type,
                    page, keyword
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }} >
            {children}
        </Dropdown>
    )
}
