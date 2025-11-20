import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { CurrencyService } from '@/services/CurrencyService';

const LazyEditorDialog = lazy(() => import('@/pages/data-management/pages/currency/components/CurrencyEditorDailog'));


export default function SuggestCurrency({
    children = 'Currency',
    exclude_ids,
    value,
    selected,
    onChange,
    placeholder = 'Select currency',
    onSelect,
    includedValues
}: SuggestProp & {
    exclude_ids?: number[]
}) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await CurrencyService.search({
                    page, keyword, exclude_ids
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Currency',
                        content: <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDialog onCancel={() => {
                            Modal.close(modal_id);
                        }} onSuccess={(options) => {
                            updateOptions(options);
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
        >
            {children}
        </Dropdown>
    )
}
