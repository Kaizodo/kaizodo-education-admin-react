import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "@/components/ui/search";
import { useDebounce } from "@/hooks/use-debounce";
import { useSetValue } from "@/hooks/use-set-value";
import { useEffect, useState } from "react";
import { TopupPlanService } from "@/services/TopupPlanService";

const TopupPlanThumbnail = ({ record, selected, onSelectedChange }: {
    record: any, index: number, selected: any[],
    onSelectedChange: (selected: any[]) => void
}) => {


    return (
        <label className="w-full flex flex-row items-center bg-white border rounded-lg p-2 hover:bg-gray-50 cursor-pointer gap-3" key={record.id}>
            <Checkbox checked={!!(selected ?? []).includes(record.id)} onCheckedChange={checked => {
                if (checked) {
                    onSelectedChange([...(selected ?? []), record.id])
                } else {
                    onSelectedChange((selected ?? []).filter(s => s !== record.id));
                }
            }} />
            <div className="flex flex-col w-full items-start">
                <h3 className="text-md font-bold">{record.name}</h3>
                <p className="text-muted-foreground text-xs italic">{record.description}</p>
            </div>
            <div className="flex flex-col items-baseline ">
                <span className="text-sm font-bold">{`₹${record.price}`}</span>
                <span className="text-xs text-muted-foreground text-nowrap">Qty - {record.quantity}</span>
            </div>
        </label>
    );
};

export default function TopupPlanPicker({ selected, onSelectedChange }: {
    selected: any[],
    onSelectedChange: (selected: any[]) => void
}) {
    const [searching, setSearching] = useState(true);
    const [records, setRecords] = useState<any[]>([]);
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });

    const setFilter = useSetValue(setFilters);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await TopupPlanService.all(filters);
        if (r.success) {
            setRecords(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);
    return (<div className=' p-2 bg-purple-50 border border-purple-400 rounded-lg flex flex-col gap-3'>
        <Search placeholder='Search topup plans' value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
        {searching && <CenterLoading className="relative h-[150px]" />}
        {!searching && records.map((record, record_index) => {
            return <TopupPlanThumbnail record={record} index={record_index} selected={selected} onSelectedChange={onSelectedChange} />


        })}
        {!searching && records.length == 0 && <NoRecords />}
    </div>);
}
