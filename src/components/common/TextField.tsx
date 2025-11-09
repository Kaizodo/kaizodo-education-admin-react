import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { ReactNode } from 'react'

type Props = {
    value?: any,
    type?: string,
    subtitle?: string,
    onChange: (value?: any) => void,
    onEnter?: (value?: any) => void,
    placeholder?: string,
    children?: ReactNode,
    autofocus?: boolean,
    disabled?: boolean,
    multiline?: boolean,
    rows?: number,
    max?: number,
    min?: number
}

export default function TextField({ children, subtitle, rows, value, onChange, onEnter, disabled, placeholder, multiline, autofocus, type, max, min }: Props) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onEnter?.(value)
        }
    }

    return (
        <div className='space-y-2'>
            {!!children && <Label className='mb-2'>{children}</Label>}
            <div className='flex flex-col'>
                {multiline && (
                    <Textarea
                        disabled={disabled}
                        autoFocus={autofocus}
                        rows={rows}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />
                )}
                {!multiline && (
                    <Input
                        max={max}
                        min={min}
                        disabled={disabled}
                        type={type}
                        autoFocus={autofocus}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />
                )}
                {!!subtitle && <span className='text-[10px] text-blue-500'>{subtitle}</span>}
            </div>
        </div>
    )
}
