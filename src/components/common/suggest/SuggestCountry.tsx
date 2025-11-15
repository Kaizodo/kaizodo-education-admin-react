import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal, ModalBody, ModalFooter } from '../Modal';
import TextField from '../TextField';
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { CountryService } from '@/services/CountryService';
import { SuggestProp } from './Suggest';



export default function SuggestCountry({ children = 'Country', exclude_ids, value, selected, onChange, placeholder = 'Select country', onSelect, includedValues }: SuggestProp & {
    exclude_ids?: number[]
}) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await CountryService.search({
                    page, keyword, exclude_ids
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Country',
                        content: () => {
                            const [form, setForm] = useState<any>({});
                            const setValue = useSetValue(setForm);
                            const [saving, setSaving] = useState(false);
                            const save = async () => {
                                setSaving(true);
                                var r = await CountryService.create(form);
                                if (r.success) {
                                    Modal.close(modal_id);
                                    updateOptions(r.data);
                                }
                                setSaving(false);
                            }
                            return <>
                                <ModalBody>
                                    <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                                    <TextField value={form.shortname} onChange={setValue('shortname')}>Short Name (In, US etc)</TextField>
                                    <TextField value={form.phonecode} onChange={setValue('phonecode')}>Phone Code (+91, +1)</TextField>
                                </ModalBody>
                                <ModalFooter>
                                    <Btn onClick={save} loading={saving}>Save</Btn>
                                </ModalFooter>
                            </>
                        }
                    })
                }}><FaPlus />Add New</Btn>);
            }}
        >
            {children}
        </Dropdown>
    )
}
