import { useOrganizationId } from '@/hooks/use-organization-id';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { ExamService } from '@/services/ExamService';



export default function SuggestExam({
    children = 'Exam',
    value,
    onChange,
    selected,
    placeholder = 'Select exam',
    onSelect,
    includedValues,
}: SuggestProp) {
    const organization_id = useOrganizationId();
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
                    organization_id
                });
                return r.data.records;
            }}
        >
            {children}
        </Dropdown>
    );
}
