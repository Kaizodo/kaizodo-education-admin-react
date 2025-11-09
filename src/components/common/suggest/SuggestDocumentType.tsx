import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal} from '../Modal';
import { lazy, Suspense } from 'react';
import { DocumentTypeService } from '@/services/DocumentTypeService';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';

const LazyEditorDialog = lazy(() => import('@/pages/document-type/components/DocumentTypeEditorModel'));


export default function SuggestDocumentType({ children = 'Document Type', selected, value, onChange, placeholder = 'Select document type', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await DocumentTypeService.search({
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
                        title: 'Add Document Type',
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
