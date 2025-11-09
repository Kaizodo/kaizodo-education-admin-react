import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { DepartmentService } from '@/services/DepartmentService';
const LazySectionEditorDialog = lazy(() => import('@/pages/departments/components/DepartmentEditorDialog'));


export default function SuggestDepartment({ children = 'Department', value, selected, onChange, placeholder = 'Select department', onSelect, includedValues }: SuggestProp & {
    class_id?: number
}) {
    return (
        <Dropdown
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await DepartmentService.search({
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
                        title: 'Add Department',
                        content: <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazySectionEditorDialog onCancel={() => {
                            Modal.close(modal_id);
                        }} onSuccess={(options) => {
                            updateOptions(options);
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
        >
            {children}
        </Dropdown>
    )
}
