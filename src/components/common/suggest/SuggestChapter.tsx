import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { ChapterService } from '@/services/ChapterService';





export default function SuggestChapter({ children = 'Chapter', exclude_ids, value, onChange, placeholder = 'Select chapter', selected, onSelect, includedValues }: SuggestProp & {
    exclude_ids?: number[],
    subject_id: number
}) {
    return (
        <Dropdown selected={selected} searchable={true} value={value} onChange={onChange} placeholder={placeholder} includedValues={includedValues} onSelect={onSelect} getOptions={async ({ keyword, page }) => {
            var r = await ChapterService.search({ keyword, page, exclude_ids });
            if (r.success) {
                return r.data.records;
            }
            return [];
        }} >
            {children}
        </Dropdown>
    )
}
