import { ReactNode } from 'react'

export default function ProductEditorSection({ title, subtitle, children, actions }: { children?: ReactNode, title: string, subtitle?: string, actions?: ReactNode }) {
    return (
        <div className='bg-white rounded-lg border'>
            <div className='flex flex-row justify-between p-3 gap-3 items-center'>
                <div className='flex flex-col'>
                    <span className='font-bold text-xl text-gray-800'>{title}</span>
                    {!!subtitle && <span className='text-gray-600 text-sm'>{subtitle}</span>}
                </div>
                {actions}
            </div>
            {children}
        </div>
    )
}
