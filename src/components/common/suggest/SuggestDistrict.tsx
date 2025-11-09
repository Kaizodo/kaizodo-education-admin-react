import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal, ModalBody, ModalFooter } from '../Modal';
import TextField from '../TextField';
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import SuggestCountry from './SuggestCountry';
import SuggestState from './SuggestState';
import { DistrictService } from '@/services/DistrictService';
import { SuggestProp } from './Suggest';




export default function SuggestDistrict({ disabled, children = 'District', value, onChange, selected, placeholder = 'Select district', onSelect, includedValues, state_id }: SuggestProp & {
    state_id?: number,
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
                var r = await DistrictService.search({
                    page, keyword, state_id
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add District',
                        content: () => {
                            const [form, setForm] = useState<any>({});
                            const setValue = useSetValue(setForm);
                            const [saving, setSaving] = useState(false);
                            const save = async () => {
                                setSaving(true);
                                var r = await DistrictService.create(form);
                                if (r.success) {
                                    Modal.close(modal_id);
                                    updateOptions(r.data);
                                }
                                setSaving(false);
                            }
                            return <>
                                <ModalBody>
                                    <SuggestCountry value={form.country_id} onChange={setValue('country_id')} />
                                    <SuggestState value={form.state_id} onChange={setValue('state_id')} />
                                    <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
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
