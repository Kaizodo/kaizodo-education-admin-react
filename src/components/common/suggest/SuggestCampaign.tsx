import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { CampaignType } from '@/data/campaign';
import { CampaignService } from '@/services/CampaignService';




export default function SuggestCampaign({ children = 'Campaign', value, onChange, selected, campaign_type, exclude_ids, placeholder = 'Select campaign', onSelect, includedValues }: SuggestProp & {
    campaign_type: CampaignType,
    exclude_ids?: number[]
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
                var r = await CampaignService.search({
                    page,
                    keyword,
                    campaign_type,
                    exclude_ids
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
