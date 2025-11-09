import { SubscriptionPlanEditorState } from "../SubscriptionPlanEditor"
import { useEffect, useState } from "react";
import CenterLoading from "@/components/common/CenterLoading";
import { ComparisonPointService } from "@/services/ComparisonPointService";
import { Checkbox } from "@/components/ui/checkbox";


export default function FeatureComparePoints({ state: $state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) {
    const [state, setState] = useState<{
        id: number,
        name: string,
        sort_order: string
    }[]>([]);
    const [loading, setLoading] = useState(true);


    const load = async () => {
        setLoading(true);
        var r = await ComparisonPointService.load();
        if (r.success) {
            setState(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [])


    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <div className="p-4 flex flex-col gap-2 max-w-xl">
            {state.map(s => {
                var checked = ($state.comparison_point_ids ?? []).includes(s.id);
                return <label key={s.id} className="flex flex-row gap-2 border p-2 rounded-lg items-center">
                    <Checkbox checked={checked} onCheckedChange={chk => setValue('comparison_point_ids')(chk ? [...($state.comparison_point_ids ?? []), s.id] : ($state.comparison_point_ids ?? []).filter(x => x !== s.id))} />
                    <span>{s.name}</span>
                </label>
            })}
        </div>
    )
}
