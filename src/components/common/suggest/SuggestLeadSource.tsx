import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { LeadSourceService } from '@/services/LeadSourceService';

const LazyLeadSourceEditor = lazy(() => import('@/pages/lead-management/lead-sources/components/LeadSourceEditorDialog'));

export default function SuggestLeadSource({ children = 'Lead Source', value, selected, onChange, placeholder = 'Select a lead source', onSelect, includedValues }: SuggestProp) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await LeadSourceService.search({
                    page, keyword
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (
                    <Btn
                        size={'xs'}
                        onClick={() => {
                            const modal_id = Modal.show({
                                title: 'Add Lead Source',
                                maxWidth: 700,
                                content: () => (
                                    <Suspense fallback={<CenterLoading className="h-[200px] relative" />}>
                                        <LazyLeadSourceEditor
                                            onSuccess={(data) => {
                                                updateOptions(data);
                                                Modal.close(modal_id);
                                            }}
                                            onCancel={() => {
                                                Modal.close(modal_id);
                                            }}
                                        />
                                    </Suspense>
                                ),
                            });
                        }}
                    >
                        <FaPlus />
                        Add New
                    </Btn>
                );
            }}
        >
            {children}
        </Dropdown>
    )
}
