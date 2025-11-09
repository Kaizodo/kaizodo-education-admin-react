import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';

import { PermissionGroupService } from '@/services/PermissionGroupService';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
const LazyEditorDalog = lazy(() => import('@/pages/permission-groups/components/PermissionGroupEditorDialog'));



export default function SuggestPermissionGroup({ children = 'Permission Group', value, selected, onChange, placeholder = 'Select permission group', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await PermissionGroupService.search({
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
                        title: 'Add Permission Group',
                        content: <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDalog onCancel={() => {
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
