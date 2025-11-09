import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import TextField from "@/components/common/TextField";
import { Checkbox } from "@/components/ui/checkbox";
import { getDefaultUser, User } from "@/data/user";
import { msg } from "@/lib/msg";
import { cn } from "@/lib/utils";
import { UserService } from "@/services/UserService";
import { useEffect, useState } from "react";

type Props = {
    user_id: number,
    registerCallback?: (callback: () => Promise<boolean>) => void
};
export default function LeavesQuotaEditor({ user_id, registerCallback }: Props) {

    const [state, setState] = useState<{
        user: User,
        leave_types: {
            id: number,
            name: string,
            description: string,
            quota: number,
            code: string,
            selected: number,
        }[],
    }>({
        user: getDefaultUser(),
        leave_types: []
    })
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const load = async () => {
        setLoading(true);
        var r = await UserService.loadLeaveConfiguration(user_id);
        if (r.success) {
            setState(r.data);
        }
        setLoading(false);
    }


    const save = async () => {
        setSaving(true);
        var r = await UserService.saveLeaveConfiguration({
            user_id,
            leave_types: state.leave_types.filter(c => c.selected).map(c => ({
                id: c.id,
                quota: c.quota
            }))
        });
        if (r.success) {
            msg.success('Leave quota saved successfuly');
        }
        setSaving(false);
        return r.success;
    }

    useEffect(() => {
        load();
    }, [user_id])




    useEffect(() => {
        registerCallback?.(async () => {
            setSaving(true);
            var r = await UserService.saveLeaveConfiguration({
                user_id,
                leave_types: state.leave_types.filter(c => c.selected).map(c => ({
                    id: c.id,
                    quota: c.quota
                }))
            });
            if (r.success) {
                msg.success('Leave quota saved successfuly');
            }
            setSaving(false);
            return r.success;
        });
    });

    return (
        <>
            {loading && <CenterLoading className='relative h-[400px]' />}
            {!loading && <>

                {state.leave_types.length == 0 && <NoRecords title="No Paid Leaves Found" subtitle="Try creating some paid leave categories" />}
                {state.leave_types.length > 0 && <div className="p-3 flex flex-col gap-3 items-start">
                    {state.leave_types.map(leave_type => {
                        return (<div key={leave_type.id} className={cn(
                            "flex flex-row w-full items-center gap-3 bg-sky-50 p-2 rounded-lg border-sky-300 border",
                            !leave_type.selected && "bg-white border-gray-300 "
                        )}>
                            <Checkbox checked={!!leave_type.selected} onCheckedChange={selected => setState(s => ({ ...s, leave_types: s.leave_types.map(c => c.id == leave_type.id ? ({ ...c, selected: selected ? 1 : 0 }) : c) }))} />
                            <div className="max-w-[350px] flex flex-col">
                                <strong className={!leave_type.selected ? "text-gray-600" : ""}>{leave_type.name}</strong>
                                <span className="text-xs">{leave_type.description}</span>
                            </div>
                            <div className="h-1 flex-1 border-dashed border-gray-300 border-b"></div>
                            <div className="flex flex-row items-center w-[130px] gap-1">
                                <TextField disabled={!leave_type.selected} type="number" placeholder="Enter amount" value={leave_type.quota} onChange={(quota) => {
                                    setState(s => ({ ...s, leave_types: s.leave_types.map(c => c.id == leave_type.id ? ({ ...c, quota }) : c) }))
                                }} children="" />
                                <span className="text-xs">Days</span>
                            </div>
                        </div>)
                    })}


                    {!registerCallback && <Btn onClick={save} loading={saving}>Save Config</Btn>}
                </div>}
            </>}
        </>
    )
}
