import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { ProductCategoryService } from '@/services/ProductCategoryService';
import { CategoryTree } from '@/data/Product';
import { LuArrowRight } from 'react-icons/lu';


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
                        title: 'Add  Product Category',
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
                    return r.data.records.map((record: any) => {
                        return {
                            ...record,
                            widget: () => {
                                return <div className="flex flex-col">
                                    <div className='flex flex-col w-full items-start justify-start'>
                                        <span className='text-sm font-medium text-start flex flex-start'>{record.name}</span>
                                        <span className='text-xs text-gray-500 text-start flex flex-start'>{record.description}</span>
                                        <div className='flex flex-row gap-1 text-xs flex-wrap items-center'>
                                            {record.tree.map((item: CategoryTree, index: number) => {
                                                return <>
                                                    <span key={item.id} className='flex px-1'>{item.name}</span>
                                                    {index !== record.tree.length - 1 && <LuArrowRight />}
                                                </>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            }
                        };
                    });
                }

                return [];
            }} >
            {children}
        </Dropdown>
    )
}
