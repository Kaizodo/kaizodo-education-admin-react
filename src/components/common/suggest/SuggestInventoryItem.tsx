import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { InventoryService } from '@/services/InventoryService';



export default function SuggestInventoryItem({ children = 'Item', value, onChange, selected, placeholder = 'Select item', onSelect, includedValues, is_book }: SuggestProp & {
    is_book?: boolean
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
                var r = await InventoryService.search({
                    page, keyword, is_book
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }} >
            {children}
        </Dropdown>
    )
}
