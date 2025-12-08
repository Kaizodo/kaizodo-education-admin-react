import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { ExamSectionService } from '@/services/ExamSectionService';
import { useOrganizationId } from '@/hooks/use-organization-id';
const LazySectionEditorDialog = lazy(() => import('@/pages/exam-management/pages/exam-sections/components/ExamSectionEditorDialog'));


export default function SuggestSection({ children = 'Section', exclude_ids, value, selected, onChange, placeholder = 'Select section', onSelect, includedValues }: SuggestProp & {
    exclude_ids?: number[]
}) {
    const organization_id = useOrganizationId();
    return (
        <Dropdown
            searchable={false}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ keyword, page }) => {
                const r = await ExamSectionService.search({
                    keyword,
                    page,
                    organization_id,
                    exclude_ids
                });
                return r.data.records;
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Section',
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
