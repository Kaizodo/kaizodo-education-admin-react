import { ReactNode } from "react";
import { Label } from "../ui/label";
import Btn from "./Btn";
import { LuCircle, LuCircleCheck } from "react-icons/lu";

type Props = {
    value?: any,
    size?: "default" | "xs" | "sm" | "lg" | "icon" | null | undefined,
    onChange: (value?: any) => void,
    disabled?: boolean,
    children?: ReactNode,
    options: {
        id: any,
        name: string,
        prefix?: ReactNode,
        suffix?: ReactNode
    }[]
};

export default function Radio({ value, onChange, children, options, size = 'sm', disabled }: Props) {
    return (
        <div className="space-y-2">
            <Label className="mb-1">{children}</Label>
            <div className="flex flex-row items-center gap-2 flex-wrap">
                {options.map(option => {
                    return <Btn
                        disabled={disabled}
                        type="button"
                        size={size}
                        key={option.id}
                        variant={value == option.id ? 'default' : 'outline'}
                        className="border-primary"
                        onClick={() => onChange(option.id)}
                    >
                        {value == option.id ? <LuCircleCheck /> : <LuCircle />}
                        {option.prefix}{option.name}{option.suffix}
                    </Btn>
                })}
            </div>

        </div>
    )
}
