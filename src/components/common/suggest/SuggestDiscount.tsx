import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { DiscountPlanService } from '@/services/DiscountPlanService';


const LazyEditorDialog = lazy(() => import('@/pages/product-management/pages/discount-plans/components/DiscountPlanEditorDialog'));


export default function SuggestDiscount({ children = 'Discount Plan', value, onChange, valid_only, load_applications, selected, placeholder = 'Select discount plan', onSelect, includedValues }: SuggestProp & {
    load_applications?: boolean,
    valid_only?: boolean
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
                        title: 'Add Discount type',
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
                var r = await DiscountPlanService.search({
                    page, keyword, load_applications, valid_only
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
