import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal, ModalBody, ModalFooter } from '../Modal';
import TextField from '../TextField';
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import SuggestCountry from './SuggestCountry';
import SuggestState from './SuggestState';
import { LocalityService } from '@/services/LocalityService';
import SuggestCity from './SuggestCity';
import { SuggestProp } from './Suggest';


export default function SuggestLocality({ children = 'Locality', disabled, value, selected, onChange, country_id, state_id, city_id, placeholder = 'Select locality', onSelect, includedValues }: SuggestProp & {
    state_id?: number,
    country_id?: number,
    city_id?: number
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
                var r = await LocalityService.search({
                    page, keyword, country_id, state_id, city_id
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Locality',
                        content: () => {
                            const [form, setForm] = useState<any>({});
                            const setValue = useSetValue(setForm);
                            const [saving, setSaving] = useState(false);
                            const save = async () => {
                                setSaving(true);
                                var r = await LocalityService.create(form);
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
                                    <SuggestCity value={form.city_id} onChange={setValue('city_id')} />
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
