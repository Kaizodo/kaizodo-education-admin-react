import { SuggestProp } from './Suggest';
import Dropdown from '../Dropdown';
import { AdmissionWindowService } from '@/services/AdmissionWindowService';


export default function SuggestAdmissionWindow({
    children = 'Admission Window',
    value,
    onChange,
    selected,
    placeholder = 'Select admission window',
    onSelect,
    includedValues,
}: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            selected={selected}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect}
            getOptions={async ({ page, keyword }) => {
                const r = await AdmissionWindowService.search({
                    page,
                    keyword,
                });

                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
        >
            {children}
        </Dropdown>
    );
}
