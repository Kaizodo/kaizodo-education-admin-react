import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal, ModalBody, ModalFooter } from '../Modal';
import TextField from '../TextField';
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import SuggestCountry from './SuggestCountry';
import { StateService } from '@/services/StateService';
import { SuggestProp } from './Suggest';




export default function SuggestState({ children = 'State', exclude_ids, disabled, country_id, value, onChange, selected, placeholder = 'Select state', onSelect, includedValues }: SuggestProp & {
    exclude_ids?: number[],
    country_id?: number
}) {
    return (
        <Dropdown
            disabled={disabled}
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await StateService.search({
                    page, keyword, country_id, exclude_ids
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add State',
                        content: () => {
                            const [form, setForm] = useState<any>({});
                            const setValue = useSetValue(setForm);
                            const [saving, setSaving] = useState(false);
                            const save = async () => {
                                setSaving(true);
                                var r = await StateService.create(form);
                                if (r.success) {
                                    Modal.close(modal_id);
                                    updateOptions(r.data);
                                }
                                setSaving(false);
                            }
                            return <>
                                <ModalBody>
                                    <SuggestCountry value={form.country_id} onChange={setValue('country_id')} />
                                    <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                                    <TextField value={form.shortname} onChange={setValue('shortname')}>Short Name</TextField>
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
