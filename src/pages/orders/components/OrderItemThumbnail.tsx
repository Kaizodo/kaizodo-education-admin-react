import Btn from '@/components/common/Btn';
import SafeImage from '@/components/common/SafeImage'
import { Badge } from '@/components/ui/badge';
import { getUserOrderStatusMeta } from '@/data/order';
import { OrderDetailState, UserOrderItem } from '@/data/UserOrder'
import { formatDateTime } from '@/lib/utils';
import { Package } from 'lucide-react'
import { LuArrowRight, LuChevronRight } from 'react-icons/lu';
import { Link } from 'react-router-dom'

export default function OrderItemThumbnail({ state, item, onShipmentClick }: { state: OrderDetailState, item: UserOrderItem, onShipmentClick: () => void }) {
    var project = state.projects.find(p => p.id == item.project_id);
    var shipments = state.shipments.filter(s => !!s.items.find(i => i.user_order_item_id == item.id));

    return (<div className='flex flex-col   rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
        <div
            className="flex flex-col sm:flex-row items-start gap-4 p-4 "
        >
            <SafeImage src={item.image} className="w-16 h-16 p-1 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-gray-400" />
            </SafeImage>

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-2">SKU: {item.sku}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-600">
                        Qty: <span className="font-medium text-gray-900">{item.quantity}</span>

                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                        Unit: <span className="font-medium text-gray-900">{item.unit_name}</span>

                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                        Unit Price: <span className="font-medium text-gray-900">{state.order.currency_symbol} {item.sp}</span>
                    </span>
                </div>

            </div>

            <div className="text-right sm:ml-auto flex flex-col gap-2">
                <p className="text-lg font-semibold text-gray-900">
                    {state.order.currency_symbol} {item.total_amount}
                </p>
                {!!project && <Link to={'/projects/' + project?.internal_reference_number}><Btn variant={'outline'} size={'xs'}>View Project <LuArrowRight /></Btn></Link>}

                {item.quantity_unlocked > 0 && <Btn size={'sm'} variant={'destructive'} onClick={onShipmentClick}>Process Single <Badge>{item.quantity_unlocked}</Badge></Btn>}

            </div>
        </div>
        {shipments.length > 0 && <div className='border-t p-3'>
            <span className='font-medium text-sm uppercase mb-3 flex'>Order Updates</span>
            <div className='flex flex-row gap-3 items-center justify-start flex-wrap'>
                {shipments.map(shipment => {
                    const meta = getUserOrderStatusMeta(shipment.status);
                    return <Link
                        key={shipment.id}
                        to={`/shipments/${shipment.internal_reference_number}`}
                        className="flex items-center justify-between p-3 mb-2 border rounded-xl hover:shadow-md transition bg-white gap-3"
                    >
                        <div className="flex flex-col gap-1">



                            <div className='flex flex-row items-center justify-between w-full gap-3'>
                                <span className="font-semibold text-sm">
                                    {shipment.internal_reference_number}
                                </span>
                                <span className={`${meta.bg} ${meta.fg} rounded-full px-2 font-medium text-xs py-1`}>{meta.name}</span>
                            </div>

                            <span className="text-xs text-gray-500">
                                Last Update: {formatDateTime(shipment.updated_at ?? shipment.created_at)}
                            </span>
                        </div>

                        <LuChevronRight className="text-gray-400" />
                    </Link>
                })}
            </div>
        </div>}
    </div>)
}
