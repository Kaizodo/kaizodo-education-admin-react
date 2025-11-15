import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { OrganizationTypeArray } from '@/data/Organization';



export default function SuggestOrganizationType({ children = 'Organization Type', value, selected, onChange, placeholder = 'Select an organization type', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={false}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async () => OrganizationTypeArray}

        >
            {children}
        </Dropdown>
    )
}
