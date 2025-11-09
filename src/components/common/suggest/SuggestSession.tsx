import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';

const LazyEditorDialog = lazy(() => import('@/pages/sessions/components/SessionEditorDialog'));


export default function SuggestSession({ children = 'Session', value, onChange, placeholder = 'Select academic session', selected, onSelect, includedValues }: SuggestProp) {
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
                return context.sessions.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Session',
                        maxWidth: 700,
                        content: () => <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDialog onSuccess={(data) => {
                            updateOptions(data);
                            Modal.close(modal_id);

                        }} onCancel={() => {
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
