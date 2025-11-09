import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { VendorService } from '@/services/VendorService';


export default function SuggestVendor({ children = 'Select Vendor', value, onChange, selected, placeholder = 'Select Vendor', onSelect, includedValues, status }: SuggestProp & {
    status?: Boolean
}) {
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
                var r = await VendorService.search({
                    page, keyword, status
                });
                if (r.success) {
                    return r.data.records.map((record: any) => ({
                        id: record.id,
                        name: `${record.name}`
                    }));
                }

                return [];
            }} >
            {children}
        </Dropdown>
    )
}
