import { lazy, Suspense } from 'react';
import Dropdown from '../Dropdown';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { ExamCategoryService } from '@/services/ExamCategoryService';

const LazyEditorDialog = lazy(() =>
    import('@/pages/exam-category/components/ExamCategoryEditorDailog')
);

export default function SuggestExamCategory({
    children = 'Exam Category',
    value,
    onChange,
    selected,
    placeholder = 'Select Exam Category',
    onSelect,
    includedValues,
    is_external,
}: SuggestProp & { is_external?: 0 | 1 }) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            onChange={onChange}
            selected={selected}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect}
            getOptions={async ({ page, keyword }) => {
                try {
                    const res = await ExamCategoryService.search?.({
                        page,
                        keyword,
                        is_external, 
                    });
                    if (res?.success && Array.isArray(res.data.records)) {
                        return res.data.records;
                    }
                } catch (e) {
                    console.error('Failed to fetch exam categories:', e);
                }
                return [];
            }}
            footer={(updateOptions) => (
                <Btn
                    size="xs"
                    onClick={() => {
                        const modal_id = Modal.show({
                            title: 'Add Exam Category',
                            maxWidth: 700,
                            content: () => (
                                <Suspense fallback={<CenterLoading className="h-[200px] relative" />}>
                                    <LazyEditorDialog
                                        onSuccess={(data) => {
                                            updateOptions(data);
                                            Modal.close(modal_id);
                                        }}
                                        onCancel={() => Modal.close(modal_id)}
                                    />
                                </Suspense>
                            )
                        });
                    }}
                >
                    <FaPlus /> Add New
                </Btn>
            )}
        >
            {children}
        </Dropdown>
    );
}
