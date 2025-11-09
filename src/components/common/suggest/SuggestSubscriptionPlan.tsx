import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { SubscriptionPlanService } from '@/services/SubscriptionPlanService';


export default function SuggestSubscriptionPlan({
  children = 'Subscription Plan',
  value,
  selected,
  onChange,
  placeholder = 'Select subscription plan',
  onSelect,
  includedValues,
  disabled
}: SuggestProp) {
  return (
    <Dropdown
      disabled={disabled}
      searchable={true}
      selected={selected}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      includedValues={includedValues}
      onSelect={onSelect}
      getOptions={async ({ page, keyword }) => {
        const r = await SubscriptionPlanService.search({
          page,
          keyword,

        });
        if (r.success) {
          return r.data.records;
        }
        return [];
      }}
    >
      {children}
    </Dropdown>
  );
}
