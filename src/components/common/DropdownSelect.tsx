import { useState, ReactNode } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export default function DropdownSelect({
    options,
    children,
    onSelect
}: {
    options: { id: any; name: string }[]
    children: ReactNode
    onSelect: (option: { id: any; name: string }) => void
}) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild onClick={() => setOpen(true)}>
                <div>{children}</div>
            </PopoverTrigger>

            <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0 pointer-events-auto z-[999]">
                {options.map(o => (
                    <div
                        key={o.id}
                        className="px-3 py-2 hover:bg-accent cursor-pointer"
                        onClick={() => {
                            onSelect(o)
                            setOpen(false)
                        }}
                    >
                        {o.name}
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    )
}
