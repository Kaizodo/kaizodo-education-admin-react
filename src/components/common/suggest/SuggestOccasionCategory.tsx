import { UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { OccasionCategoryService } from '@/services/OccasionCategoryService';


const LazyOccasionCategoryEditorDialog = lazy(() => import('@/pages/occasions/components/OccasionCategoryEditorDialog'));


export default function SuggestOccasionCategory({ children = 'Occasion Category', value, onChange, selected, placeholder = 'Select occasion category', onSelect, includedValues }: SuggestProp & {
    user_type?: UserType
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
                        title: 'Add Occasion Category',
                        content: () => <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyOccasionCategoryEditorDialog onSuccess={(data) => {
                            updateOptions(data);
                            Modal.close(modal_id);

                        }} onCancel={() => {
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
            getOptions={async ({ page, keyword }) => {
                var r = await OccasionCategoryService.search({
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
