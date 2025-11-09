import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
const LazySectionEditorDialog = lazy(() => import('@/pages/batches/components/BatchEditorDialog'));


export default function SuggestBatch({ children = 'Batch', value, selected, onChange, placeholder = 'Select batch', onSelect, includedValues }: SuggestProp & {
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

                return context.batches.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Batch',
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
