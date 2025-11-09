import { SuggestProp } from './Suggest';
import Dropdown from '../Dropdown';
import { BlockService } from '@/services/BlockService';

type SuggestBlockProps = SuggestProp & {
    hostel_id?: number;
};

export default function SuggestBlock({
    children = 'Select Block',
    value,
    onChange,
    selected,
    placeholder = 'Select Block',
    onSelect,
    includedValues,
    hostel_id,
}: SuggestBlockProps) {
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
                const r = await BlockService.search({
                    page,
                    keyword,
                    hostel_id,
                });

                if (r.success) {
                    return r.data.records.map((block: any) => ({
                        id: block.id,
                        name: block.name,
                    }));
                }

                return [];
            }}
        >
            {children}
        </Dropdown>
    );
}
