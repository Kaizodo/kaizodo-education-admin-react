import { SuggestProp } from './Suggest';
import Dropdown from '../Dropdown';
import { FloorService } from '@/services/FloorService';

type SuggestFloorProps = SuggestProp & {
    hostel_block_id?: number;
};

export default function SuggestFloor({
    children = 'Select Floor',
    value,
    onChange,
    selected,
    placeholder = 'Select Floor',
    onSelect,
    includedValues,
    hostel_block_id,
}: SuggestFloorProps) {
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
                const r = await FloorService.search({
                    page,
                    keyword,
                    hostel_block_id,
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
