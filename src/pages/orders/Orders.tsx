import { useEffect, useState } from 'react';
import CenterLoading from '@/components/common/CenterLoading';
import { useForm } from '@/hooks/use-form';
import { LuArrowRight, LuTrendingUp } from 'react-icons/lu';
import { cn, formatDate, formatDays } from '@/lib/utils';
import AppPage from '@/components/app/AppPage';
import { Search } from '@/components/ui/search';
import Dropdown from '@/components/common/Dropdown';
import Btn from '@/components/common/Btn';
import { TbRefresh } from "react-icons/tb";
import { Badge } from '@/components/ui/badge';
import { getTopupTypeName, UserQuotaCodeEnum } from '@/data/Subscription';
import DownloadInvoiceBtn from './components/DownloadInvoiceBtn';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { UserOrderService } from '@/services/UserOrderService';
import { getUserOrderStatusMeta, UserOrder, UserOrderStatus } from '@/data/order';
import { useNavigate } from 'react-router-dom';



export default function Orders() {
    const navigate = useNavigate();
    const [searching, setSeraching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<UserOrder>>(getDefaultPaginated());
    const [filters, setFilter] = useForm({
        page: 1,
        keyword: ''
    });

    const search = async () => {
        setSeraching(true);
        var r = await UserOrderService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSeraching(false);
    }

    useEffect(() => {
        search();
    }, [filters])




    return (
        <AppPage
            title='Orders'
            subtitle='Track your package orders and deployment progress'
        >
            <div className='border bg-white rounded-lg p-3 shadow flex flex-row items-end gap-3'>
                <div className='flex-1'>
                    <Search placeholder='Search order' value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
                </div>
                <div>
                    <Dropdown
                        value={filters.status}
                        onChange={setFilter('status', 'debounce')}
                        placeholder='Select a status'
                        getOptions={async () => [
                            { id: UserOrderStatus.Pending, name: 'Awaiting Payment' },
                            { id: UserOrderStatus.Active, name: 'Active Order' },

                        ]}>Order Status</Dropdown>
                </div>
            </div>

            <div className="space-y-6">
                {searching && <CenterLoading className="relative h-[400px]" />}
                {!searching && paginated.records.map((order) => {
                    const meta = getUserOrderStatusMeta(order.status)



                    return (
                        <div
                            key={order.id}
                            className="relative flex flex-col sm:flex-row gap-3 bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl border border-gray-100"
                        >
                            <div className="p-6 flex-1 sm:border-e">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-indigo-700">{order.internal_reference_number} {!!order.is_renewed && <Badge>Renwed</Badge>}</h3>
                                        {!order.is_renewed && <p className="text-sm text-gray-500 mt-1">Purchased On : {formatDate(order.created_at)}</p>}
                                        {!!order.is_renewed && <p className="text-sm text-gray-500 mt-1">Renewd On : {formatDate(order.created_at)}</p>}
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${meta.bg}`}
                                    >
                                        {meta.name}
                                    </span>
                                </div>
                                <div className="border-t flex flex-row flex-wrap  gap-4 p-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "border rounded-xl flex flex-col p-4 min-w-[140px] shadow-sm hover:shadow-md transition-shadow duration-200",
                                                item.user_order_item_type === UserQuotaCodeEnum.IR_SubscriptionPlan && "bg-linear-to-br from-orange-50 to-orange-100 border-orange-300",
                                                item.user_order_item_type === UserQuotaCodeEnum.IR_TopupPlan && "bg-linear-to-br from-sky-50 to-sky-100 border-sky-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    item.user_order_item_type === UserQuotaCodeEnum.IR_SubscriptionPlan && "bg-orange-400",
                                                    item.user_order_item_type === UserQuotaCodeEnum.IR_TopupPlan && "bg-sky-400"
                                                )} />
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                    {item.user_order_item_type === UserQuotaCodeEnum.IR_SubscriptionPlan ? "Subscription" : "Top-up"}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{item.name}</h3>
                                            <span className="text-xl font-black text-gray-800 mb-3">₹{item.total}</span>
                                            {item.user_order_item_type === UserQuotaCodeEnum.IR_SubscriptionPlan && (
                                                <div className="text-xs text-gray-600 space-y-1">
                                                    <span className="block">Validity: {formatDays(item.duration_days)}</span>
                                                    <span className="block">{formatDate(item.valid_from)} - {formatDate(item.valid_to)}</span>
                                                </div>
                                            )}
                                            {item.user_order_item_type === UserQuotaCodeEnum.IR_TopupPlan && (
                                                <span className="text-sm text-gray-700 font-medium">{item.quota} {getTopupTypeName(item.topup_type)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className='flex flex-row items-center border-t'>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4  pt-4 flex-1">
                                        <div className="flex items-center space-x-3">
                                            <LuTrendingUp className="w-6 h-6 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Total Paid</p>
                                                <p className="text-xl font-extrabold text-green-600">₹{order.amount}</p>

                                            </div>
                                        </div>
                                    </div>



                                    {<div className="flex flex-row items-center gap-3">
                                        {!!order.can_renew && <Btn variant={'destructive'} onClick={() => navigate('/orders/' + order.internal_reference_number + '/renew')}><TbRefresh /> Renew Plan</Btn>}
                                        <DownloadInvoiceBtn internal_reference_number={order.internal_reference_number} />
                                        <Btn variant={'outline'} onClick={() => navigate('/orders/' + order.internal_reference_number)}>View Details <LuArrowRight /></Btn>

                                    </div>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppPage>
    );
};

