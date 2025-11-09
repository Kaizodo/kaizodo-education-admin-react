import { UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { InternalExamService } from '@/services/InternalExamService';

type SuggestInternalExamProps = SuggestProp & {
    user_type?: UserType;
    status?: number;
};

export default function SuggestInternalExam({
    children = 'Select Internal Exam',
    value,
    onChange,
    selected,
    placeholder = 'Select Internal Exam',
    onSelect,
    includedValues,
    status,
}: SuggestInternalExamProps) {
    return (
        <Dropdown
            searchable={true}
            selected={selected}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect}
            getOptions={async ({ page, keyword }) => {
                const r = await InternalExamService.search({
                    page,
                    keyword,
                    status,
                });

                if (r.success) {
                    return r.data.records.map((exam: any) => ({
                        id: exam.id,
                        name: `${exam.exam_name} - ${exam.exam_type} - ${exam.class_name}`,
                    }));
                }

                return [];
            }}
        >
            {children}
        </Dropdown>
    );
}
