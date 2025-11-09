import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { UserRoleService } from '@/services/UserRoleService';
const LazyEditorDialog = lazy(() => import('@/pages/user-roles/components/UserRoleEditorDialog'));


export default function SuggestUserRole({ children = 'User Role', value, selected, onChange, placeholder = 'Select user role', onSelect, includedValues }: SuggestProp & {
    class_id?: number
}) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            onSelect={onSelect}
            includedValues={includedValues}
            getOptions={async ({ page, keyword }) => {
                var r = await UserRoleService.search({
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
                        title: 'Add Batch',
                        content: <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDialog onCancel={() => {
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
