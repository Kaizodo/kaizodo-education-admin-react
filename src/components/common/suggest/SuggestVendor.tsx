import { OrganizationVendorService } from '@/services/OrganizationVendorService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';


export default function SuggestVendor({ children = 'Select Vendor', value, onChange, selected, placeholder = 'Select Vendor', onSelect, includedValues, organization_id }: SuggestProp & {
    organization_id: number
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
                var r = await OrganizationVendorService.search({
                    page, keyword, organization_id
                });
                if (r.success) {
                    return r.data.records.map((record: any) => {
                        var description = ``;
                        if (record.organization) {
                            description += ` GST :- ${record.organization.gst_number ?? '--'} | Address :- ${record.organization.billing_address ?? '--'}`;
                        } else {
                            description += ` Mobile :-  ${record.mobile} | Email :-  ${record.email}`;
                        }
                        return ({
                            id: record.id,
                            name: record.organization?.name ?? record.name,
                            description: description
                        });
                    });
                }

                return [];
            }} >
            {children}
        </Dropdown>
    )
}
