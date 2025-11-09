import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "@/components/ui/search";
import { calculateDiscount } from "@/data/Common";
import { useDebounce } from "@/hooks/use-debounce";
import { useSetValue } from "@/hooks/use-set-value";
import { formatDays } from "@/lib/utils";
import { SubscriptionPlanService } from "@/services/SubscriptionPlanService";
import { useEffect, useState } from "react";
import { LuCircle, LuCircleCheck } from "react-icons/lu";
import Btn from "@/components/common/Btn";

const SubscriptionPlanThumbnail = ({ record, selected, onSelectedChange }: {
    record: any, index: number, selected: any[],
    onSelectedChange: (selected: any[]) => void
}) => {
    const versions = [record, ...(record.versions || [])];
    const [plan, setPlan] = useState<any>(record.versions.find((v: any) => !!v.active) ?? record);
    const calculatedPricing = calculateDiscount(plan.pricing);


    return (
        <div
            key={plan.id}
            className="bg-white border p-2 flex flex-col items-center rounded-lg shadow-sm gap-3 "
        >
            <div className="flex flex-col w-full items-start">
                <h3 className="text-md font-bold">{plan.name}</h3>
                <p className="text-muted-foreground text-xs italic">{plan.description}</p>
            </div>
            <div className="bg-sky-50 border-sky-400 border p-1 rounded-lg flex flex-col w-full">
                <span className="text-xs mb-1 font-medium">Versions</span>
                <div className="flex flex-row flex-wrap items-center gap-1">
                    {versions.map((version: any) => (
                        <Btn
                            className="rounded-full"
                            size={'xs'}
                            key={version.id}
                            variant={version.id === plan.id ? 'default' : 'outline'}
                            onClick={() => setPlan(version)}
                        >
                            v{version.version}
                            {version.id === plan.id ? <LuCircleCheck className="ml-1 h-3 w-3" /> : null}
                            {version.id !== plan.id ? <LuCircle className="ml-1 h-3 w-3" /> : null}
                        </Btn>
                    ))}
                </div>
            </div>


            <div className='grid grid-cols-3 gap-3'>
                {calculatedPricing.map((p) => {
                    return (

                        <label className="w-full flex flex-row items-center hover:bg-gray-50 cursor-pointer gap-3" key={p.id}>
                            <Checkbox checked={!!(selected ?? []).includes(p.id)} onCheckedChange={checked => {
                                if (checked) {
                                    onSelectedChange([...(selected ?? []), p.id])
                                } else {
                                    onSelectedChange((selected ?? []).filter(s => s !== p.id));
                                }
                            }} />

                            <div className="flex items-baseline gap-2 ">
                                <span className="text-sm font-bold">{`₹${p.price}`}</span>
                                <span className="text-xs text-muted-foreground">/ {formatDays(Number(p.duration_days ?? 0))}</span>
                            </div>
                        </label>
                    );
                })}
            </div>





        </div>
    );
};

export default function SubscriptionPlanPicker({ selected, onSelectedChange }: {
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
        var r = await SubscriptionPlanService.all(filters);
        if (r.success) {
            setRecords(r.data.subscription_plans);
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
    return (<div className=' p-2 bg-orange-50 border border-orange-400 rounded-lg flex flex-col gap-3'>
        <Search placeholder='Search subscription plans' value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
        {searching && <CenterLoading className="relative h-[150px]" />}
        {!searching && records.map((record, record_index) => {
            return <SubscriptionPlanThumbnail record={record} index={record_index} selected={selected} onSelectedChange={onSelectedChange} />


        })}
        {!searching && records.length == 0 && <NoRecords />}
    </div>);
}
