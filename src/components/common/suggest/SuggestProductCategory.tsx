import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { ProductCategoryService } from '@/services/ProductCategoryService';


const LazyEditorDialog = lazy(() => import('@/pages/product-management/pages/product-categories/components/ProductCategoryEditorDialog'));


export default function SuggestProductCategory({ exclude_ids, product_category_id, is_service, children = 'Product Category', value, onChange, selected, placeholder = 'Select product category', onSelect, includedValues }: SuggestProp & {
    product_category_id?: number,
    is_service?: number,
    exclude_ids?: number[]
}) {


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
                        content: () => <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDialog onSuccess={(data) => {
                            updateOptions(data);
                            Modal.close(modal_id);

                        }} onCancel={() => {
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
            getOptions={async ({ page, keyword }) => {
                var r = await ProductCategoryService.search({
                    exclude_ids,
                    product_category_id,
                    is_service,
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
