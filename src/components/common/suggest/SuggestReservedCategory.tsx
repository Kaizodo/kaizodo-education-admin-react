
import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal, ModalBody, ModalFooter } from '../Modal';
import TextField from '../TextField';
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ReservedCategoryService } from '@/services/ReservedCategoryService';
import { SuggestProp } from './Suggest';





export default function SuggestReservedCategory({ children = 'Reserved Category', value, selected, onChange, placeholder = 'Select reserved category', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            onChange={onChange}
            selected={selected}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await ReservedCategoryService.search({
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
                        title: 'Add Reserved Category',
                        content: () => {
                            const [form, setForm] = useState<any>({});
                            const setValue = useSetValue(setForm);
                            const [saving, setSaving] = useState(false);
                            const save = async () => {
                                setSaving(true);
                                var r = await ReservedCategoryService.create(form);
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
                                    <TextField value={form.code} onChange={setValue('code')}>Code</TextField>
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
