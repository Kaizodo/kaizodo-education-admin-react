import { UserType, UserTypeArray } from '@/data/user';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';



export default function SuggestUserType({ children = 'User Type', value, onChange, selected, searchable = true, placeholder = 'Select user type', onSelect, includedValues, excludeValues = [] }: SuggestProp & {
    excludeValues?: UserType[]
}) {
    return (
        <Dropdown searchable={searchable} value={value} onChange={onChange} selected={selected} placeholder={placeholder} includedValues={includedValues} onSelect={onSelect} getOptions={async () => UserTypeArray.filter(ut => !excludeValues.includes(ut.id))}>
            {children}
        </Dropdown>
    )
}
