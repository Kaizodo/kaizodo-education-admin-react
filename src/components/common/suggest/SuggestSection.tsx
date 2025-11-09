import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
const LazySectionEditorDialog = lazy(() => import('@/pages/sections/components/SectionEditorDialog'));


export default function SuggestSection({ children = 'Section', class_id, value, selected, onChange, placeholder = 'Select section', onSelect, includedValues }: SuggestProp & {
    class_id?: number
}) {
    const { context } = useGlobalContext();
    return (
        <Dropdown
            searchable={false}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ keyword }) => {
                var section_ids = context.sections.map(c => c.id);
                if (class_id) {
                    section_ids = context.class_sections.filter(cs => cs.class_id == class_id).map(cs => cs.section_id);
                }
                return context.sections.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()) && section_ids.includes(c.id));
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
