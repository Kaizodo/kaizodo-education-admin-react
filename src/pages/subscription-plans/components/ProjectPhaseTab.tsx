import { SubscriptionPlanEditorState } from "../SubscriptionPlanEditor"
import { useEffect, useState } from "react";
import CenterLoading from "@/components/common/CenterLoading";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { PhaseService } from "@/services/PhaseService";


export default function ProjectPhaseTab({ state: $state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) {
    const [state, setState] = useState<{
        id: number,
        name: string,
        description: string,
        sort_order: string
    }[]>([]);
    const [loading, setLoading] = useState(true);


    const load = async () => {
        setLoading(true);
        var r = await PhaseService.all();
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
                var checked = ($state.phase_ids ?? []).includes(s.id);
                return <label key={s.id} className={cn(
                    "flex flex-row gap-2 border p-2 rounded-lg items-center relative cursor-pointer hover:bg-sky-50",
                    checked && "bg-sky-50 border border-sky-300"
                )}>

                    <div className="flex flex-col">
                        <div className="font-medium flex flex-row items-center gap-2 ">
                            <Checkbox checked={checked} onCheckedChange={chk => setValue('phase_ids')(chk ? [...($state.phase_ids ?? []), s.id] : ($state.phase_ids ?? []).filter(x => x !== s.id))} />
                            <span>{s.name}</span>
                        </div>

                        <span className="text-xs">{s.description}</span>

                    </div>
                </label>
            })}
        </div>
    )
}
