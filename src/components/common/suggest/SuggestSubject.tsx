import { SubjectService } from '@/services/SubjectService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';





export default function SuggestSubject({ children = 'Subject', value, onChange, placeholder = 'Select subject', selected, onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown selected={selected} searchable={true} value={value} onChange={onChange} placeholder={placeholder} includedValues={includedValues} onSelect={onSelect} getOptions={async ({ keyword, page }) => {
            var r = await SubjectService.search({ keyword, page });
            if (r.success) {
                return r.data.records;
            }
            return [];
        }} >
            {children}
        </Dropdown>
    )
}
