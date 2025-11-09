import { StoreService } from '@/services/StoreService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';

interface SuggestStoreProps extends SuggestProp {
    onSelect?: (item: any) => void;
    selectedItems?: any[];
}

export default function SuggestStore({
    children = 'Store',
    value,
    onChange,
    placeholder = 'Select Store',
    selected,
    onSelect,
}: SuggestStoreProps) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            selected={selected}
            onSelect={(item) => {
                if (onSelect) onSelect(item);
            }}
            getOptions={async ({ keyword, page }) => {
                const response = await StoreService.search({
                    keyword,
                    page,
                });
                return response.success ? response.data.records : [];
            }}
        >
            {children}
        </Dropdown>
    );
}
