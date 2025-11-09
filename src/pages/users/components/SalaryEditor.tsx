import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import Note from "@/components/common/Note";
import TextField from "@/components/common/TextField";
import { SalaryComponentType } from "@/data/Salary";
import { getDefaultUser, User } from "@/data/user";
import { msg } from "@/lib/msg";
import { SalaryComponent } from "@/pages/users/components/SalaryComponent";
import { UserService } from "@/services/UserService";
import { useEffect, useState } from "react";

export default function SalaryEditor({ user_id, registerCallback }: { user_id: number, registerCallback?: (callback: () => Promise<boolean>) => void }) {
    const [state, setState] = useState<{
        user: User,
        daily_work_hour: number,
        daily_spread_hour: number,
        components: SalaryComponentType[],
    }>({
        user: getDefaultUser(),
        daily_work_hour: 9,
        daily_spread_hour: 12,
        components: []
    })
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        var r = await UserService.loadSalaryConfiguration(user_id);
        if (r.success) {
            setState(r.data);
        }
        setLoading(false);
    }


    const calculate = (updatedComponent?: SalaryComponentType) => {
        setState(prev => {
            const components = prev.components.map(cx => cx.id == updatedComponent?.id ? updatedComponent : cx).map(c => ({
                ...c,
                component_ids: Array.isArray(c.component_ids)
                    ? c.component_ids.map(id => Number(id))
                    : [],
                amount: Number(c.amount ?? 0),
                percentage: Number(c.percentage ?? 0)
            }));

            const byId: Record<number, SalaryComponentType> = {};
            components.forEach(c => (byId[c.id] = c));

            const compute = (comp: SalaryComponentType): number => {
                if (!comp.selected) return 0;

                if (Number(comp.percentage) > 0 && comp.component_ids.length > 0) {
                    let sum = 0;
                    for (const cid of comp.component_ids) {
                        const dep = byId[cid];
                        if (dep && !!dep.selected) {
                            sum += Number(dep.amount ?? 0); // allow 0
                        }
                    }
                    return (sum * comp.percentage) / 100;
                }

                // manual input (even 0 is valid)
                return Number(comp.amount ?? 0);
            };

            // Calculate earnings first
            components
                .filter(c => !!c.selected && c.is_deduction_type === 0)
                .forEach(c => {
                    const val = compute(c);
                    c.amount = Math.round(val * 100) / 100;
                    c.calculated_amount = Math.round(val * 100) / 100;
                });

            // Calculate deductions next
            components
                .filter(c => !!c.selected && c.is_deduction_type === 1)
                .forEach(c => {
                    const val = compute(c);
                    c.amount = Math.round(val * 100) / 100;
                    c.calculated_amount = Math.round(val * 100) / 100;
                });

            // Set unselected components to 0
            components
                .filter(c => !c.selected)
                .forEach(c => {
                    c.amount = 0;
                    c.calculated_amount = 0;
                });

            return { ...prev, components };
        });
    };









    const save = async () => {
        setSaving(true);
        var r = await UserService.saveSalaryConfiguration({
            user_id: state.user.id,
            daily_work_hour: state.daily_work_hour,
            daily_spread_hour: state.daily_spread_hour,
            components: state.components.filter(c => !!c.selected && !!c.amount).map(c => ({
                id: c.id,
                amount: c.amount ?? 0,
                percentage: c.percentage,
            }))
        });
        if (r.success) {
            msg.success('Salary breakout saved successfuly');
        }
        setSaving(false);
        return r.success;
    }



    useEffect(() => {
        load();
    }, [])


    useEffect(() => {
        registerCallback?.(async () => {
            setSaving(true);
            var r = await UserService.saveSalaryConfiguration({
                user_id: state.user.id,
                daily_work_hour: state.daily_work_hour,
                daily_spread_hour: state.daily_spread_hour,
                components: state.components.filter(c => !!c.selected && !!c.amount).map(c => ({
                    id: c.id,
                    amount: c.amount ?? 0,
                    percentage: c.percentage,
                }))
            });
            if (r.success) {
                msg.success('Salary breakout saved successfuly');
            }
            setSaving(false);
            return r.success;
        });
    });





    return (
        <>

            {loading && <CenterLoading className='relative h-[400px]' />}
            {!loading && <>
                <div className="grid grid-cols-2 gap-3 px-3">
                    <TextField
                        value={state.daily_work_hour}
                        onChange={v => setState(s => ({ ...s, daily_work_hour: v }))}
                        placeholder="Enter hours"
                        type="number"
                    >Work Hours / Day</TextField>
                    <TextField
                        value={state.daily_spread_hour}
                        onChange={v => setState(s => ({ ...s, daily_spread_hour: v }))}
                        placeholder="Enter hours"
                        type="number"
                    >Spread Over Hours / Day</TextField>
                </div>
                <div className="px-3 my-3">
                    <Note
                        title="Overtime(OT) Calculation"
                        subtitle="If an employee's total work time exceeds the spread over hours,
                                     the extra hours worked beyond the work hours will be paid as OT. For example:
                                      Spread hours = 12h; Work hours = 9hrs;  Work = 13h → 4h OT. Work = 11h → not eligible for OT."
                    />
                </div>

                {state.components.length == 0 && <NoRecords title="No Salary Components" subtitle="Try creating some salary components" />}
                {state.components.length > 0 && <div className="p-3 flex flex-col gap-3 items-start w-full">
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <div className="flex flex-col gap-2">
                            <strong className="bg-blue-50 text-blue-600 rounded-lg p-2">Earnings</strong>
                            {state.components.filter(c => !c.is_deduction_type).map(component => {
                                return <SalaryComponent component={component} components={state.components} onUpdate={calculate} />
                            })}
                        </div>
                        <div className="flex flex-col gap-2">
                            <strong className="bg-red-50 text-red-600 rounded-lg p-2">Deductions</strong>
                            {state.components.filter(c => c.is_deduction_type).map(component => {
                                return <SalaryComponent component={component} components={state.components} onUpdate={calculate} />
                            })}
                        </div>
                    </div>
                    <div className="w-full p-3 border-t border-gray-200 flex flex-col gap-2 text-sm">
                        {(() => {
                            const gross = state.components
                                .filter(c => !!c.selected && !c.is_deduction_type)
                                .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

                            const deductions = state.components
                                .filter(c => !!c.selected && c.is_deduction_type)
                                .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

                            const net = gross - deductions;
                            const total = gross + deductions; // total monthly (Gross + Deductions)
                            const ctc = total * 12; // annual CTC

                            const daysInMonth = 30;
                            const perDay = total / daysInMonth;
                            const perHour = perDay / Number(state.daily_work_hour ?? 0);

                            return (
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Gross Salary</span>
                                        <span className="font-semibold text-green-700">₹ {gross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Total Deductions</span>
                                        <span className="font-semibold text-red-600">₹ {deductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-300 pt-2">
                                        <span className="text-gray-800 font-bold">Net / In-hand Salary</span>
                                        <span className="font-bold text-blue-700 text-lg">₹ {net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="flex justify-between border-t border-gray-300 pt-2">
                                        <span className="text-gray-800 font-bold">Total Monthly (Gross + Deductions)</span>
                                        <span className="font-bold text-purple-700">₹ {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-800 font-bold">Annual CTC</span>
                                        <span className="font-bold text-indigo-700">₹ {ctc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="flex justify-between border-t border-gray-300 pt-2">
                                        <span className="text-gray-800 font-bold text-xs">Per Day ({daysInMonth} days {state.daily_work_hour}Hr Shift)</span>
                                        <span className="font-bold text-blue-700 text-sm">₹ {perDay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-300 pt-2">
                                        <span className="text-gray-800 font-bold text-xs">Per Hour ({state.daily_work_hour}hr shift)</span>
                                        <span className="font-bold text-blue-700 text-sm">₹ {perHour.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>

                                    {net < 0 && <Note title="Error" subtitle="Negative salary detected, Please check the amounts"></Note>}
                                </div>
                            );
                        })()}


                    </div>

                    {!registerCallback && <div className="p-3 border-t w-full">
                        <Btn onClick={save} loading={saving}>Save Salary</Btn>
                    </div>}
                </div>}
            </>}
        </>
    )
}
