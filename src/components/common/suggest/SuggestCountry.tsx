import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { CountryService } from '@/services/CountryService';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';

const LazyEditorDialog = lazy(() => import('@/pages/data-management/pages/country/components/CountryEditorDailog'));


export default function SuggestCountry({ children = 'Country', exclude_ids, value, selected, onChange, placeholder = 'Select country', onSelect, includedValues }: SuggestProp & {
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
                var r = await CountryService.search({
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
                        title: 'Add Country',
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
