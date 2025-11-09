import { SubscriptionModuleService } from '@/services/SubscriptionModuleService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';





export default function SuggestSubscriptionModule({ children = 'Subscription Module', value, onChange, placeholder = 'Select subscription module', selected, onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown selected={selected} searchable={true} value={value} onChange={onChange} placeholder={placeholder} includedValues={includedValues} onSelect={onSelect} getOptions={async ({ keyword, page }) => {
            var r = await SubscriptionModuleService.search({ keyword, page });
            if (r.success) {
                return r.data.records;
            }
            return [];
        }} >
            {children}
        </Dropdown>
    )
}
