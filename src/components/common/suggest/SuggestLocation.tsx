import { LocationService } from '@/services/LocationService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';



export default function SuggestLocation({ children = 'Location', value, selected, onChange, placeholder = 'Select location', onSelect, includedValues, exclude_ids }: SuggestProp & {
    exclude_ids?: number[]
}) {
    return (
        <Dropdown searchable={true} value={value} onChange={onChange} selected={selected} placeholder={placeholder} includedValues={includedValues} onSelect={onSelect} getOptions={async ({ page, keyword }) => {
            var r = await LocationService.search({
                page, keyword, exclude_ids
            });
            if (r.success) {
                return r.data.records.map((loc: any) => {
                    return {
                        id: loc.id,
                        name: loc.name,
                        description: `${loc.capacity} seats`,
                    }
                });
            }
            return [];
        }} >
            {children}
        </Dropdown>
    )
}
