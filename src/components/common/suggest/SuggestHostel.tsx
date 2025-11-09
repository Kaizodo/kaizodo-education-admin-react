import { UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { HostelService } from '@/services/HostelService';

type SuggestHostelProps = SuggestProp & {
    user_type?: UserType;
    status?: number;
};

export default function SuggestHostel({
    children = 'Select Hostel',
    value,
    onChange,
    selected,
    placeholder = 'Select Hostel',
    onSelect,
    includedValues,
}: SuggestHostelProps) {
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
                const r = await HostelService.search({
                    page,
                    keyword,
                });

                if (r.success) {
                    return r.data.records.map((hostel: any) => ({
                        id: hostel.id,
                        name: hostel.name,
                    }));
                }

                return [];
            }}
        >
            {children}
        </Dropdown>
    );
}
