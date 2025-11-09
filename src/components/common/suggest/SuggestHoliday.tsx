import { HolidayService } from '@/services/HolidayService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';



export default function SuggestHoliday({
    children = 'Select holiday',
    value,
    onChange,
    selected,
    placeholder = 'Select holiday',
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
                const r = await HolidayService.search({
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
