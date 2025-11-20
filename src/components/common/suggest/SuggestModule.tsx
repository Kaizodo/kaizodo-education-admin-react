import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { ModuleService } from '@/services/ModuleService';





export default function SuggestModule({ children = 'Module', value, onChange, placeholder = 'Select module', selected, onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown selected={selected} searchable={true} value={value} onChange={onChange} placeholder={placeholder} includedValues={includedValues} onSelect={onSelect} getOptions={async ({ keyword, page }) => {
            var r = await ModuleService.search({ keyword, page });
            if (r.success) {
                return r.data.records;
            }
            return [];
        }} >
            {children}
        </Dropdown>
    )
}
