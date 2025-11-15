import { ReactNode } from 'react'
import { LuPlus } from 'react-icons/lu'

export default function LeadSection({ action, title, btn_title, onBtnClick, children }: {
    title: string,
    btn_title?: string,
    action?: ReactNode,
    onBtnClick?: () => void,
    children?: ReactNode
}) {
    return (
        <div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {!!action && action}
                {!action && !!btn_title && <button
                    onClick={onBtnClick}
                    className="text-sm text-green-600 hover:underline flex items-center">
                    <LuPlus className="w-4 h-4 mr-1" />{btn_title}
                </button>}
            </div>
            {children}
        </div>
    )
}
