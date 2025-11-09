import { cn } from '@/lib/utils'
import React from 'react'
import { FaCaretDown } from 'react-icons/fa6'
import { Label } from '../ui/label'

type Props = {
    onClick: () => void, label?: string, children?: React.ReactNode, placeholder?: string, dropdown?: boolean
}

export default function TouchableField({ onClick, children, placeholder, label, dropdown = false, ...props }: Props) {
    return (
        <div className='space-y-2'  {...props}>
            {label && <Label className="mb-3">{label}</Label>}
            <div
                onClick={onClick}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                )}
            >
                <div className="flex-1">
                    {!children && placeholder && (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    {children}
                </div>
                {dropdown && (
                    <div className="ml-2 text-muted-foreground">
                        <FaCaretDown />
                    </div>
                )}
            </div>
        </div>
    )
}
