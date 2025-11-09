import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal, ModalBody, ModalFooter } from '../Modal';
import TextField from '../TextField';
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { SuggestProp } from './Suggest';
import { DesignationService } from '@/services/DesignationService';



export default function SuggestDesignation({ children = 'Designation', value, selected, onChange, placeholder = 'Select designation', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await DesignationService.search({
                    page, keyword
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Designation',
                        content: () => {
                            const [form, setForm] = useState<any>({});
                            const setValue = useSetValue(setForm);
                            const [saving, setSaving] = useState(false);
                            const save = async () => {
                                setSaving(true);
                                var r = await DesignationService.create(form);
                                if (r.success) {
                                    Modal.close(modal_id);
                                    updateOptions(r.data);
                                }
                                setSaving(false);
                            }
                            return <>
                                <ModalBody>
                                    <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                                    <TextField value={form.description} multiline onChange={setValue('description')}>Description</TextField>
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
