import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Globe,
    MapPin,
    CreditCard,
    Store,
    Mail,
    Phone,
    Receipt,
    StickyNote
} from "lucide-react";
import { UserOrderService } from '@/services/UserOrderService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DetailSkeleton from './components/OrderDetailSkeleton';
import { getPaymentMethodName } from '@/data/user';
import SafeImage from '@/components/common/SafeImage';
import AppPage from '@/components/app/AppPage';
import DownloadInvoiceBtn from './components/DownloadInvoiceBtn';
import { formatDateTime } from '@/lib/utils';
import { LuArrowRight, LuChevronRight, LuUser } from 'react-icons/lu';
import Btn from '@/components/common/Btn';
import NoRecords from '@/components/common/NoRecords';
import { FaShippingFast } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { Modal } from '@/components/common/Modal';
import CreateShipmentDialog from './components/CreateShipmentDialog';
import { OrderDetailState, Project, UserOrderItem } from '@/data/UserOrder';
import { Organization } from '@/data/Organization';
import OrderItemThumbnail from './components/OrderItemThumbnail';
import { getUserOrderStatusMeta } from '@/data/order';
import { PiSealWarningBold } from 'react-icons/pi';
import OrderIssueDialog from './components/OrderIssueDialog';
import DownloadListBtn from './components/DownloadListBtn';

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
    has_update: boolean,
    remarks: string,
    created_at: string,
    updated_at: string,
    user_id: number,
    status: ProjectPhaseStatus
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



export type OrderCommonProps = {
    state: OrderDetailState,
    setState: React.Dispatch<React.SetStateAction<OrderDetailState>>
}


export default function OrderDetail() {
    const navigate = useNavigate();
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<OrderDetailState>();

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



    const openNewShipmentForm = (organization: Organization, items: UserOrderItem[]) => {
        const modal_id = Modal.show({
            title: 'Add Shipment',
            subtitle: `#${state?.order.internal_reference_number}`,
            maxWidth: 600,
            content: () => <CreateShipmentDialog
                user_order_id={state?.order.id}
                organization={organization}
                items={items.filter(i => !!i.has_shipping && i.quantity_unlocked > 0)}
                currency_code={state?.order.currency_code}
                currency_symbol={state?.order.currency_symbol}
                onSuccess={() => {
                    Modal.close(modal_id);
                    load();
                }}

            />

        })
    }

    const openOrderIssueForm = (organization: Organization, items: UserOrderItem[]) => {
        const modal_id = Modal.show({
            title: 'New Order Issue',
            subtitle: `#${state?.order.internal_reference_number}`,
            maxWidth: 600,
            content: () => <OrderIssueDialog
                user_order_id={state?.order.id ?? 0}
                organization={organization}
                items={items.filter(i => !!i.has_shipping && i.quantity_unlocked > 0)}
                currency_code={state?.order.currency_code ?? ''}
                currency_symbol={state?.order.currency_symbol ?? ''}
                onSuccess={() => {
                    Modal.close(modal_id);
                    load();
                }}

            />

        })
    }

    useEffect(() => {
        if (!internal_reference_number) {
            return;
        }
        load();
    }, [internal_reference_number])

    if (loading || !state) {
        return <DetailSkeleton />
    }






    const has_shipments = state.order_items.filter(i => !!i.has_shipping).length > 0;

    return (
        <AppPage
            enableBack={true}
            backRoute={'/orders'}
            title={'Order #' + state.order.internal_reference_number}
            subtitle={`Placed on ${formatDateTime(state.order.created_at)}`}
            actions={<div className='flex flex-row items-center gap-3'>

                <DownloadInvoiceBtn internal_reference_number={state.order.internal_reference_number} />
            </div>}
        >

            <div className="flex flex-row gap-8 items-start">
                <div className='grid grid-cols-3 gap-8 flex-1'>
                    <div className="col-span-2 flex flex-col space-y-8">
                        {/* Order Items */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex-1">Order Items</CardTitle>
                                    <Badge variant="outline" className="gap-2">
                                        <Store className="w-3 h-3" />
                                        {state.organizations.length} {state.organizations.length === 1 ? 'Store' : 'Stores'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-8">
                                    {state.organizations.map((organization: any, organization_index) => {
                                        var items = state.order_items.filter(i => i.organization_id == organization.id);
                                        var can_process = !!items.find(i => i.quantity_unlocked > 0);
                                        return (<div key={organization.id} className={organization_index > 0 ? "pt-6 border-t border-gray-200" : ""}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <SafeImage src={organization.logo_short} className="w-8 h-8 p-1 object-contain rounded-lg bg-indigo-50 flex items-center justify-center">
                                                    <Store className="w-4 h-4 text-indigo-600" />
                                                </SafeImage>
                                                <h3 className="font-semibold text-gray-900 flex-1">{organization.name}</h3>
                                                {can_process && <DownloadListBtn internal_reference_number={state.order.internal_reference_number} organization_id={organization.id} />}
                                                {can_process && <Btn size={'sm'} onClick={() => openOrderIssueForm(organization, items)}>Order Issue<PiSealWarningBold /></Btn>}
                                                {can_process && <Btn size={'sm'} onClick={() => openNewShipmentForm(organization, items)}>Bulk Process <LuArrowRight /></Btn>}
                                            </div>

                                            <div className="space-y-3">
                                                {items.map((item) => <OrderItemThumbnail key={item.id} state={state} item={item} onShipmentClick={() => openNewShipmentForm(organization, [item])} />)}
                                            </div>
                                        </div>);
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Addresses */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-sm border-gray-200">
                                <CardHeader className="border-b border-gray-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">Shipping Address</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-1">
                                        <p className="text-gray-900 font-medium">{state.order.address}</p>
                                        <p className="text-gray-700">
                                            {state.order.state_name},  {state.order.pincode}
                                        </p>
                                        <p className="text-gray-700 font-medium">{state.order.country_name}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-gray-200">
                                <CardHeader className="border-b border-gray-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                            <Receipt className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">Billing Address</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-1">
                                        <p className="text-gray-900 font-medium">{state.order.address}</p>
                                        <p className="text-gray-700">
                                            {state.order.state_name},  {state.order.pincode}
                                        </p>
                                        <p className="text-gray-700 font-medium">{state.order.country_name}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Internal Notes */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <StickyNote className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Internal Notes</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-gray-700">NO Internal Notes</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='space-y-8'>
                        {state.projects.length > 0 && <Card className="shadow-sm border-gray-200">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900">Projects</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                {state.projects.length == 0 && <NoRecords />}
                                {state.projects.map((project: Project) => {
                                    const items = state.order_items.filter(i => i.project_id === project.id);

                                    return (
                                        <Link
                                            key={project.id}
                                            to={`/projects/${project.internal_reference_number}`}
                                            className="flex items-center justify-between p-3 mb-2 border rounded-xl hover:shadow-md transition"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex flex-wrap gap-1">
                                                    {items.map(i => (
                                                        <Badge key={i.id} className="text-xs px-2 py-0.5">
                                                            {i.name}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <span className="font-semibold text-sm">
                                                    {project.internal_reference_number}
                                                </span>

                                                <span className="text-xs text-gray-500">
                                                    Last Update: {formatDateTime(project.updated_at ?? project.created_at)}
                                                </span>
                                            </div>

                                            <LuChevronRight className="text-gray-400" />
                                        </Link>
                                    );
                                })}
                            </CardContent>

                        </Card>}
                        {has_shipments && <Card className="shadow-sm border-gray-200">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900">Order Handling Process</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                {state.shipments.length == 0 && <NoRecords icon={FaShippingFast} title='No Shipments Yet' subtitle='Create new shipments and manage product delivery' />}
                                {state.shipments.map(shipment => {
                                    var organization = state.organizations.find(o => o.id == shipment.organization_id);
                                    const meta = getUserOrderStatusMeta(shipment.status);
                                    return (<Link
                                        key={shipment.id}
                                        to={`/shipments/${shipment.internal_reference_number}`}
                                        className="flex items-center justify-between p-3 mb-2 border rounded-xl hover:shadow-md transition w-full"
                                    >
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center gap-2 mb-4 w-full">
                                                <SafeImage src={organization?.logo_short} className="w-8 h-8 p-1 object-contain rounded-lg bg-indigo-50 flex items-center justify-center">
                                                    <Store className="w-4 h-4 text-indigo-600" />
                                                </SafeImage>

                                                <h3 className="font-semibold text-gray-900 flex-1">{organization?.name}</h3>
                                                <span className={`${meta.bg} ${meta.fg} rounded-full px-2 font-medium text-xs py-1`}>{meta.name}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {shipment.items.map(i => (
                                                    <Badge key={i.id} className="text-xs px-2 py-0.5">
                                                        {i.name}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <span className="font-semibold text-sm">
                                                {shipment.internal_reference_number}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                Last Update: {formatDateTime(shipment.updated_at ?? shipment.created_at)}
                                            </span>
                                        </div>

                                        <LuChevronRight className="text-gray-400" />
                                    </Link>);
                                })}
                            </CardContent>
                        </Card>}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900">Support Tickets</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <NoRecords icon={MdSupportAgent} title='No Tickets' subtitle='Manage order specific support tickets' />
                            </CardContent>
                        </Card>
                    </div>
                </div>


                {/* Right Column - Summary & Customer */}
                <div className="w-full max-w-[350px] flex flex-col space-y-8">
                    {/* Order Summary */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-semibold text-gray-900">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center font-medium text-2xl text-blue-600">
                                            {state.order.currency_symbol}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order Value</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {state.order.currency_symbol} {state.order.amount}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 py-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900 font-medium">{state.order.currency_symbol} {state.order.base}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-emerald-600 font-medium">-{state.order.currency_symbol} {state.order.discount}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-gray-900 font-medium">{state.order.currency_symbol} {state.order.shipping}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900 font-medium">{state.order.currency_symbol} {state.order.tax}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t-2 border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="text-base font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {state.order.currency_symbol} {state.order.amount}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Country</p>
                                            <p className="text-sm font-medium text-gray-900">{state.order.country_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Payment Method</p>
                                            <p className="text-sm font-medium text-gray-900 capitalize">
                                                {getPaymentMethodName(state.order.payment_method)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Tracking Number</p>
                                            <p className="text-sm font-medium text-blue-600">Not Avaiable Yet</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-semibold text-gray-900">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <LuUser className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Client Name</p>
                                        <p className="font-medium text-gray-900">{state.order.first_name} {state.order.last_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                        <a
                                            href={`mailto:${state.order.email}`}
                                            className="font-medium text-blue-600 hover:text-blue-700 transition-colors break-all"
                                        >
                                            {state.order.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                        <a
                                            href={`tel:${state.order.mobile}`}
                                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {state.order.mobile}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-2">Customer Notes</p>
                                <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                    No Customer Notes
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppPage>
    );
}