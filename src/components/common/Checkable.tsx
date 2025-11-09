import { LucideCheckSquare } from "lucide-react";
import { Label } from "../ui/label";
import Btn from "./Btn";
import { LuSquare } from "react-icons/lu";
import { ReactNode } from "react";

type Props = {
    value?: any[],
    onChange: (value: any[]) => void,
    children?: ReactNode,
    size?: "default" | "xs" | "sm" | "lg" | "icon" | null | undefined,
    options: {
        id: any,
        name: string,
    }[]
};

export default function Checkable({ value = [], onChange, size = 'sm', children, options }: Props) {
    const toggle = (id: any) => {
        const exists = value.includes(id);
        const newValue = exists ? value.filter(v => v !== id) : [...value, id];
        onChange(newValue);
    };

    const allIds = options.map(opt => opt.id);
    const isAllChecked = allIds.every(id => value.includes(id));

    const toggleAll = () => {
        onChange(isAllChecked ? [] : allIds);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                {!!children && <Label className="mb-1">{children}</Label>}
                <Btn size="xs" variant="ghost" onClick={toggleAll}>
                    {isAllChecked ? "Uncheck All" : "Check All"}
                </Btn>
            </div>

            <div className="flex flex-row items-center gap-2 flex-wrap">
                {options.map(option => {
                    const checked = value.includes(option.id);
                    return (
                        <Btn
                            type="button"
                            size={size}
                            key={option.id}
                            variant={'outline'}
                            className={checked ? 'bg-sky-50 border-sky-400 text-sky-600' : ''}
                            onClick={() => toggle(option.id)}
                        >
                            {checked ? <LucideCheckSquare /> : <LuSquare />}
                            {option.name}
                        </Btn>
                    );
                })}
            </div>
        </div>
    );
}
