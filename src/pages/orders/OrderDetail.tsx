import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime, formatDays } from '@/lib/utils';
import { UserOrderService } from '@/services/UserOrderService';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { LuArrowRight, LuCrown, LuLayers } from 'react-icons/lu';
import DownloadInvoiceBtn from './components/DownloadInvoiceBtn';
import { getTopupTypeName, UserQuotaCodeEnum } from '@/data/Subscription';
import { getUserOrderStatusMeta, UserOrder, UserOrderItem } from '@/data/order';
import { useNavigate, useParams } from 'react-router-dom';
import OrderStatusEditor from './components/OrderStatusEditor';
import { User } from '@/data/user';



const ValidityProgressBar = ({ valid_from, valid_to }: { valid_from: string, valid_to: string }) => {

    const start = moment(valid_from);
    const end = moment(valid_to);
    const now = moment();

    const percentageExhausted = Math.min(100, Math.max(0, (now.diff(start) / end.diff(start)) * 100));
    const daysRemaining = Math.max(0, end.diff(now, "days"));

    const statusColor = percentageExhausted > 80 ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Validity Progress</span>
                <span className="font-bold text-gray-800">{daysRemaining} days remaining</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${statusColor}`}
                    style={{ width: `${percentageExhausted}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{start.format("DD MMM YYYY")}</span>
                <span>{end.format("DD MMM YYYY")}</span>
            </div>
        </div>
    );
};


// Helper for Consumable Add-on Progress
const ConsumableProgressBar = ({ item }: { item: UserOrderItem }) => {
    const percentageConsumed = (item.quota / item.quota) * 100;
    const remaining = item.quota;
    const consumed = 0;
    const statusColor = percentageConsumed > 80 ? 'bg-orange-500' : 'bg-indigo-500';

    return (
        <div className="p-3 border-l-4 border-indigo-300 bg-indigo-50 rounded-lg">
            <div className="flex justify-between text-sm font-semibold text-gray-800">
                <span>{item.name}</span>
                <span>{remaining} / {item.quota} {item.topup_type !== UserQuotaCodeEnum.TP_Other ? getTopupTypeName(item.topup_type) + ' Remaining' : ''}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                    className={`h-2 rounded-full transition-all duration-700 ${statusColor}`}
                    style={{ width: `${percentageConsumed}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">Consumed: {consumed}  {getTopupTypeName(item.topup_type)} ({percentageConsumed.toFixed(0)}%)</p>
        </div>
    );
};



// 2. Package Details Card Component (Now includes Features and Validity)
const PackageDetailsCard = ({ item }: { item: UserOrderItem }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <LuCrown className='text-indigo-600' />
            Subscription Details: {item.name}
        </h2>

        <div className="border-b pb-4 mb-4">
            <p className="text-3xl font-bold text-indigo-600 mt-1">₹{item.total} <span className="text-sm font-normal text-gray-500">for {formatDays(item.duration_days)}</span></p>

            {/* --- Validity Progress Bar --- */}
            <ValidityProgressBar
                valid_from={item.valid_from}
                valid_to={item.valid_to}
            />
        </div>

        {/* --- Feature List --- */}
        <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-4">Included Features</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {item.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature.text}
                </div>
            ))}
        </div>
    </div>
);

// 3. Add-ons / Consumable Top-Ups Display
const AddonsDisplay = ({ items }: { items: UserOrderItem[] }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <LuLayers className={"text-orange-500"} />
            Addons   & Top-Ups
        </h2>
        <div className="space-y-4">
            {items.map((item) => (
                <ConsumableProgressBar key={item.id} item={item} />
            ))}
        </div>
    </div>
);




const PaymentsAndRenewals = ({ orders }: { orders: UserOrder[] }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0l-1 1h4l1-1h4l1 1h4l1-1m-1-1h-1"></path></svg>
                Payments & Renewals
            </h2>
            <ul className="space-y-4">
                {orders.map((order, index) => {
                    var meta = getUserOrderStatusMeta(order.status);
                    return (
                        <li key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition duration-150">
                            <div>
                                <p className="text-md font-semibold text-gray-800">{formatCurrency(Number(order.amount))}</p>
                                <p className="text-xs text-gray-500">
                                    Order ID: <span className="font-medium">{order.internal_reference_number}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                {meta && <span className={`text-xs font-medium px-2 py-1 rounded-full  ${meta?.bg} ${meta?.fg} `}> {meta?.name} </span>}
                                <p className="text-xs text-gray-500 mt-1">{formatDateTime(order.created_at)}</p>
                                <Btn size={'xs'} onClick={() => navigate('/app/orders/' + order.internal_reference_number)}>View Order <LuArrowRight /></Btn>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const DetailSkeleton = () => {
    return <>
        <Skeleton className='h-[70px] bg-white border w-full mb-3' />
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className='lg:col-span-2 space-y-8'>
                <Skeleton className='h-[200px] bg-white border w-full' />
                <Skeleton className='h-[200px] bg-white border w-full' />
            </div>
            <div className='lg:col-span-1 mt-8 lg:mt-0 space-y-8'>
                <Skeleton className='h-[200px] bg-white border w-full' />
            </div>
        </div>
    </>
}

export type Phase = {
    id: number,
    name: string,
    description: string,
    color: string,
    is_active: number,
    steps: PhaseStep[]
};

export type PhaseStep = {
    id: number,
    phase_id: number,
    name: string,
    description: string,
}

export type Project = {
    id: number,
    internal_reference_number: string,
    deployment_manager_user_id: number | null;
    relationship_manager_user_id: number | null;
    is_deployment_manager_assigned: number;
    is_relationship_manager_assigned: number;
    project_user_ids: number[],
    is_team_assigned: number;
    is_ready_deployment: number;
    is_deployment_phase: number;
    is_deployment_completed: number;
    deployment_manager_assigned_datetime: string;
    relationship_manager_assigned_datetime: string;
    team_assigned_datetime: string;
    deployment_ready_datetime: string;
    deployment_phase_datetime: string;
    deployment_complete_datetime: string;
    users: User[]
}



export enum ProjectPhaseStatus {
    Pending = 0,
    Progress = 1,
    Completed = 2
}

export const ProjectPhaseStatusArray = [
    { id: ProjectPhaseStatus.Pending, name: "Pending" },
    { id: ProjectPhaseStatus.Progress, name: "Progress" },
    { id: ProjectPhaseStatus.Completed, name: "Completed" },
];

export function getPhaseStatusName(id: ProjectPhaseStatus) {
    return ProjectPhaseStatusArray.find(x => x.id === id)?.name ?? "";
}

export type OrderState = {
    project: Project,
    phases: Phase[],
    users: User[],
    order: UserOrder,
    orders: UserOrder[]
}

export default function OrderDetail() {
    const navigate = useNavigate();
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<OrderState>();

    const load = async () => {
        setLoading(true);
        var r = await UserOrderService.detail(internal_reference_number ?? '');
        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            navigate(-1);
        }
    }

    useEffect(() => {
        load();
    }, [internal_reference_number])

    if (loading || !state) {
        return <DetailSkeleton />
    }

    return (
        <AppPage
            enableBack={true}
            backRoute={'/orders'}
            title='Order Details'
            subtitle={'Order :- ' + state.order.internal_reference_number}
            actions={<DownloadInvoiceBtn internal_reference_number={state.order.internal_reference_number} />}
        >

            <div className='grid grid-cols-3 gap-6'>
                <div className='col-span-2'>

                    {state.order.items.filter(i => i.user_order_item_type == UserQuotaCodeEnum.IR_SubscriptionPlan).map(i => {
                        return <PackageDetailsCard key={i.id} item={i} />;
                    })}


                </div>
                <div className='col-span-1'>
                    <AddonsDisplay items={state.order.items.filter(i => i.user_order_item_type == UserQuotaCodeEnum.IR_TopupPlan)} />
                </div>
            </div>


            <OrderStatusEditor state={state} setState={setState} />
            <PaymentsAndRenewals orders={state.orders} />

        </AppPage>
    );
};

