import { SubscriptionPlanEditorState } from "../SubscriptionPlanEditor"
import { useEffect, useState } from "react";
import CenterLoading from "@/components/common/CenterLoading";
import { Checkbox } from "@/components/ui/checkbox";
import { FeatureCardService } from "@/services/FeatureCardService";
import { cn } from "@/lib/utils";


export default function ContentCards({ state: $state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) {
    const [state, setState] = useState<{
        id: number,
        name: string,
        image: string,
        description: string,
        sort_order: string
    }[]>([]);
    const [loading, setLoading] = useState(true);


    const load = async () => {
        setLoading(true);
        var r = await FeatureCardService.all();
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
        <div className="p-4 flex flex-row gap-2   flex-wrap">
            {state.map(s => {
                var checked = ($state.feature_card_ids ?? []).includes(s.id);
                return <label key={s.id} className={cn(
                    "flex flex-row gap-2 border p-2 rounded-lg items-center relative cursor-pointer hover:bg-sky-50",
                    checked && "bg-sky-50 border border-sky-300"
                )}>

                    <img src={s.image} className="h-20 rounded-sm" />
                    <div className="flex flex-col">
                        <div className="font-medium flex flex-row items-center gap-2 ">
                            <Checkbox checked={checked} onCheckedChange={chk => setValue('feature_card_ids')(chk ? [...($state.feature_card_ids ?? []), s.id] : ($state.feature_card_ids ?? []).filter(x => x !== s.id))} />
                            <span>{s.name}</span>
                        </div>

                        <span className="text-xs">{s.description}</span>

                    </div>
                </label>
            })}
        </div>
    )
}
