import { DropdownItemType } from "../Dropdown";

export type SuggestProp = {
    disabled?: boolean,
    value?: any,
    onChange: (value?: any) => void,
    selected?: DropdownItemType,
    placeholder?: string,
    children?: string,
    includedValues?: (undefined | number | string)[],
    searchable?: boolean,
    onSelect?: (output: any) => void,
};

