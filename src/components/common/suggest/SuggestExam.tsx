import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { ExamService } from '@/services/ExamService';



export default function SuggestExam({
    children = 'Exam / Assessment',
    value,
    onChange,
    selected,
    placeholder = 'Select assessment',
    onSelect,
    includedValues,
}: SuggestProp) {
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
                const r = await ExamService.search({
                    page,
                    keyword,
                });
                return r.data.records;
            }}
        >
            {children}
        </Dropdown>
    );
}
