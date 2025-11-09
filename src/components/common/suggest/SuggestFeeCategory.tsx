
import Dropdown from '../Dropdown';

import { SuggestProp } from './Suggest';
import { FeeCategoryService } from '@/services/FeeCategoryService';




export default function SuggestFeeCategory({ children = 'Fee Category', value, selected, onChange, placeholder = 'Select fee category', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await FeeCategoryService.search({
                    page, keyword
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}

        >
            {children}
        </Dropdown>
    )
}
