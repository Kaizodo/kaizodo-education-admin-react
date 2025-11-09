import { InfirmaryService } from '@/services/InfirmaryService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';



export default function SuggestFirstAid({ children = 'Select Aid', value, selected, onChange, placeholder = 'Select Aid', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await InfirmaryService.fistAid({
                    page, keyword
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }
            }
        >
            {children}
        </Dropdown>
    )
}
