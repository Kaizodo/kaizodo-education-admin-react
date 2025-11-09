import { GenderArray } from '@/data/user';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';



export default function SuggestGender({ children = 'Gender', value, onChange, selected, placeholder = 'Select Gender', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown searchable={false} selected={selected} value={value} onChange={onChange} placeholder={placeholder} includedValues={includedValues} onSelect={onSelect} getOptions={async () => {
            return GenderArray;
        }} >
            {children}
        </Dropdown>
    )
}
