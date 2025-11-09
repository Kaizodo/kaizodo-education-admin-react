import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
const LazyClassEditorDialog = lazy(() => import('@/pages/classes/components/ClassEditorDialog'));



export default function SuggestClass({ children = 'Class', value, selected, onChange, placeholder = 'Select Class', onSelect, includedValues }: SuggestProp) {
    const { context } = useGlobalContext();
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ keyword }) => {
                return context.classes.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Class',
                        maxWidth: '500px',
                        content: <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyClassEditorDialog onCancel={() => {
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
