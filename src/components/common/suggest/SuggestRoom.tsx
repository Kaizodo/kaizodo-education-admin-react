import { SuggestProp } from './Suggest';
import Dropdown from '../Dropdown';
import { RoomService } from '@/services/RoomService';

type SuggestRoomProps = SuggestProp & {
    hostel_floor_id?: number;
    room_type?: number;
    available?: boolean;
};

export default function SuggestRoom({
    children = 'Select Room',
    value,
    onChange,
    selected,
    placeholder = 'Select Room',
    onSelect,
    includedValues,
    hostel_floor_id,
    room_type,
    available,
}: SuggestRoomProps) {
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
                const r = await RoomService.search({
                    page,
                    keyword,
                    hostel_floor_id,
                    room_type,
                    available
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
