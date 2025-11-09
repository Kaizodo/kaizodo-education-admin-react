import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { InventoryService } from '@/services/InventoryService';
import { Check } from 'lucide-react'; // Optional: Icon for selected items

interface SuggestItemsProps extends SuggestProp {
    is_book?: number;
    onSelect?: (item: any) => void;
    selectedItems?: any[];
}

export default function SuggestItems({
    children = 'Books',
    value,
    onChange,
    placeholder = 'Select Books',
    selected,
    onSelect,
    includedValues,
    is_book,
    selectedItems = [],
}: SuggestItemsProps) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            selected={selected}
            includedValues={includedValues}
            onSelect={(item) => {
                if (onSelect) onSelect(item);
            }}
            getOptions={async ({ keyword, page }) => {
                const response = await InventoryService.search({
                    keyword,
                    page,
                    is_book,
                });
                return response.success ? response.data.records : [];
            }}
            footer={(option: any) => (
                <div className="flex justify-between items-center w-full">
                    <span>{option.name}</span>
                    {selectedItems.some((s) => s.id === option.id) && (
                        <Check className="text-green-500 h-4 w-4" />
                    )}
                </div>
            )}
        >
            {children}
        </Dropdown>
    );
}
