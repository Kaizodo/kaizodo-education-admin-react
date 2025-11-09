import { Checkbox } from "@/components/ui/checkbox";
import { SalaryComponentType } from "@/data/Salary";
import { useSetValue } from "@/hooks/use-set-value";
import { cn, formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LuIndianRupee } from "react-icons/lu";

export function SalaryComponent({ component, components, onUpdate }: { component: SalaryComponentType, components: SalaryComponentType[], onUpdate: (component: SalaryComponentType) => void }) {
    const [form, setForm] = useState<SalaryComponentType>(component);
    const setValue = useSetValue(setForm);

    useEffect(() => {
        if (form.amount !== component.amount || form.percentage !== component.percentage || form.selected !== component.selected) {
            onUpdate(form);
        }
    }, [form]);


    return (<div className={cn(
        "flex flex-row w-full  items-center  gap-1",
    )}>

        <Checkbox checked={!!form?.selected} onCheckedChange={checked => setValue('selected')(checked)} />
        <div className="flex flex-col">
            <span className={'text-xs font-medium'}>{component.name}</span>
            <div className="flex flex-row items-start text-[10px] gap-2">
                <span className="text-gray-500 whitespace-nowrap">({component.taxable ? 'Taxable' : 'Non Taxable'})</span>
                {(form.percentage > 0 || !!form.updated_percentage) && <div className="flex flex-row items-center ">
                    <input
                        type="number"
                        value={component.percentage}
                        className="border w-[50px] rounded-full text-center"
                        placeholder="%.."
                        onChange={e => setValue('percentage', 'updated_percentage')(Number(e.target.value), 1)}
                    />
                    {component.percentage > 0 && <span className="text-[9px] text-blue-600">
                        % of {component.component_ids
                            .map((c: number) => components.find(r => r.id == c)?.name)
                            .filter(Boolean)
                            .join(' + ')} {!!component.calculated_amount && ' - (₹' + component.calculated_amount + ')'}
                    </span>}
                </div>}

            </div>

        </div>

        <div className="h-1 flex-1 border-dashed border-gray-300 border-b"></div>
        <div className={cn(
            "flex flex-row items-center w-[100px] border rounded-sm",
            !form.selected && "bg-gray-100"
        )}>
            <LuIndianRupee className="text-gray-600" />
            <input
                type="number"
                className="w-[80px] text-xs py-1 outline-none border-none "
                disabled={!form.selected}
                placeholder="Enter amount"
                value={component.amount}
                onChange={e => setValue('amount')(e.target.value)}
            />
        </div>
        <span className="text-[11px] text-nowrap w-[100px]">x 12 = {formatCurrency((component.amount ?? 0) * 12)}</span>

    </div>);
}
