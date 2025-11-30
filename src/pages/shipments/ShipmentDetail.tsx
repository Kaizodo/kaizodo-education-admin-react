import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Package,
    Truck,
    MapPin,
    Clock,
    AlertCircle,
    Edit
} from "lucide-react";
import AppPage from '@/components/app/AppPage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cn, formatDateTime, nameLetter } from '@/lib/utils';
import Btn from '@/components/common/Btn';
import { LuCalendarSync, LuCircle, LuCircleCheck, LuCornerDownLeft, LuHash, LuListCheck, LuMail, LuPencil, LuPhone, LuPlus, LuPrinter, LuSave, LuTag, LuTruck } from 'react-icons/lu';
import CenterLoading from '@/components/common/CenterLoading';
import { UserOrderService } from '@/services/UserOrderService';
import ShippingLabelPrintDialog from '../orders/components/ShippingLabelPrintDialog';
import { Modal } from '@/components/common/Modal';
import TextField from '@/components/common/TextField';
import { useForm } from '@/hooks/use-form';
import { getUserOrderStatusMeta, ShipmentPackageType, ShipmentPackageTypeArray, UserOrderIssueSource, UserOrderStatus } from '@/data/order';
import { TbHomeCancel, TbMapPinCancel, TbMapPinCheck, TbTruckDelivery, TbTruckLoading } from 'react-icons/tb';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import { RiCheckDoubleFill, RiUserLocationLine } from 'react-icons/ri';
import { GrMapLocation } from 'react-icons/gr';
import { ApiResponseType } from '@/lib/api';
import { LiaCitySolid } from 'react-icons/lia';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import SuggestEmployee from '@/components/common/suggest/SuggestEmployee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import DateTimeField from '@/components/common/DateTimeField';
import { UniversalCategoryService } from '@/services/UniversalCategoryService';
import { ShipmentDetailState, ShipmentItem } from '@/data/Shipment';
import { IoWarningOutline } from 'react-icons/io5';
import DownloadInvoiceBtn from '../invoices/components/DownloadInvoiceBtn';
import { msg } from '@/lib/msg';
import ShipmentItemReturnDialog from './components/ShipmentItemReturnDialog';
import { BsHouseCheck } from 'react-icons/bs';
import SafeImage from '@/components/common/SafeImage';
import CancelShipmentDialog from './components/CancelShipmentDialog';
import { TrackingHistoryItem } from '@/components/common/TrackingHistoryItem';




export default function ShipmentDetail() {
    const navigate = useNavigate();
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setStateValue, setState] = useForm<ShipmentDetailState>();
    const [form, setValue, setForm] = useForm<any>({
        items: [],
        package_type: ShipmentPackageType.Individual
    })
    const [reasons, setReasons] = useState<{ id: number, name: string, description: string }[]>([]);
    const [loadingReasons, setLoadingReasons] = useState(false);


    const returnItems = () => {
        const modal_id = Modal.show({
            title: 'Return Items',
            subtitle: 'Update stock for returned items',
            maxWidth: 700,
            content: () => <ShipmentItemReturnDialog state={state} onSuccess={() => {
                load();
                Modal.close(modal_id);
            }} />
        })
    }

    const load = async () => {
        if (!internal_reference_number) {
            return;
        }
        setLoading(true);
        var r = await UserOrderService.shipmentDetail(internal_reference_number);
        if (r.success) {
            setState(r.data);
            setForm({
                package_type: r.data.shipment.package_type,
                package_weight: r.data.shipment.package_weight,
                package_length: r.data.shipment.package_length,
                package_width: r.data.shipment.package_width,
                package_height: r.data.shipment.package_height,
                shipment_provided: r.data.shipment.shipment_provided,
                notes: r.data.shipment.remarks,
                tracking_number: r.data.shipment.tracking_number,
                pickup_datetime: r.data.shipment.pickup_datetime,
                dispatch_datetime: r.data.shipment.dispatch_datetime,
                status: r.data.shipment.status,
                items: r.data.shipment_items
            });
            setLoading(false);
        } else {
            navigate(-1);
        }
    }

    const loadReasons = async () => {
        if (reasons.length > 0) {
            return;
        }
        setLoadingReasons(true);
        var r = await UniversalCategoryService.all({
            is_delivery_failure_reason: 1
        });
        if (r.success) {
            setReasons(r.data);
        }
        setLoadingReasons(false);
    }


    const printLabels = () => {
        if (!internal_reference_number) {
            return;
        }
        Modal.show({
            title: 'Print Labels',
            subtitle: `#${internal_reference_number}`,
            maxWidth: 600,
            content: () => <ShippingLabelPrintDialog internal_reference_number={internal_reference_number} />

        })
    }


    const cancelShipment = () => {
        const modal_id = Modal.show({
            title: 'Cancel Shipment',
            subtitle: `#${internal_reference_number}`,
            maxWidth: 600,
            content: () => <CancelShipmentDialog
                onSuccess={() => {
                    Modal.close(modal_id);
                    load();
                }}
                shipment={state.shipment}
            />

        })
    }




    useEffect(() => {
        load();
    }, [internal_reference_number])

    if (!state || loading) {
        return <CenterLoading className="relative h-screen" />
    }


    var ready_for_shipment = state.shipment_logs.find(s => s.status == UserOrderStatus.ReadyForShipment);
    var dispatched = state.shipment_logs.find(s => s.status == UserOrderStatus.Dispatched);
    var locations: any[] = state.shipment_logs.filter(s => s.status == UserOrderStatus.Location);
    var reached_nearest = state.shipment_logs.find(s => s.status == UserOrderStatus.ReachedNearestHub);
    var out_for_delivery = state.shipment_logs.find(s => s.status == UserOrderStatus.OutForDelivery);
    var delivery_attempts = state.shipment_logs.filter(s => s.status == UserOrderStatus.DeliveryAttempted);
    var delivered = state.shipment_logs.find(s => s.status == UserOrderStatus.Delivered);
    var cancelled_items_returend = state.shipment_logs.find(s => s.status == UserOrderStatus.CancelledItemsReturned);
    var status_meta = getUserOrderStatusMeta(state.shipment.status);
    var cancelled = state.shipment_logs.find(s => s.status == UserOrderStatus.Cancelled);
    var cancellation = state.user_order_issues.find(s => s.shipment_id == state.shipment.id);

    var can_update = state.shipment.status !== UserOrderStatus.Cancelled;

    return (<AppPage
        enableBack={true}
        title={'Shipment #' + internal_reference_number}
        subtitle={`Placed on ${formatDateTime(state?.shipment.order_created_at)}`}
        actions={<div className='flex flex-row items-center gap-3'>
            <DownloadInvoiceBtn internal_reference_number={state.shipment.invoice_internal_reference_number} />
            {!cancelled && state.shipment.status !== UserOrderStatus.Cancelled && <Btn size={'sm'} variant={'outline'} onClick={() => printLabels()}>Print Labels <LuPrinter /></Btn>}
            {!delivered && !dispatched && !cancelled && state.shipment.status !== UserOrderStatus.Cancelled && <Btn size={'sm'} variant={'destructive'} onClick={cancelShipment}><TbHomeCancel /> Cancel Shipment</Btn>}
        </div>}
    >
        {state.user_order_issues.length == 0 && <div className="bg-white border rounded-lg border-gray-200 px-4 md:px-8 py-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>

                    <div className="text-sm text-gray-500 flex flex-row items-center gap-2">
                        <span>Order : </span>
                        <Link
                            to={'/orders/' + state.shipment.order_internal_reference_number}
                            className='text-blue-500 underline'
                        >
                            #{state.shipment.order_internal_reference_number}
                        </Link>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-row items-center gap-2">
                        <span>Invoice : </span>
                        <Link
                            to={'/invoices/' + state.shipment.invoice_internal_reference_number}
                            className='text-blue-500 underline'
                        >
                            #{state.shipment.invoice_internal_reference_number}
                        </Link>
                    </div>
                </div>


                <div className="flex flex-wrap items-center gap-3">
                    <span className={`${status_meta.bg} ${status_meta.fg} border px-4 py-2 text-sm font-medium uppercase rounded-full`}>
                        {status_meta?.name}
                    </span>

                </div>
            </div>
        </div>}

        {state.user_order_issues.map(user_order_issue => {
            return <div key={user_order_issue.id} className="bg-red-50 border rounded-lg border-red-500 px-4 md:px-8 py-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className='flex flex-col gap-2'>

                        <div className="text-sm text-gray-500 flex flex-row items-center gap-2">
                            <span>Order : </span>
                            <Link
                                to={'/orders/' + state.shipment.order_internal_reference_number}
                                className='text-blue-500 underline'
                            >
                                #{state.shipment.order_internal_reference_number}
                            </Link>
                        </div>
                        <div className="text-sm text-gray-500 flex flex-row items-center gap-2">
                            <span> Cancellation Request : </span>
                            <Link
                                to={'/orders/' + user_order_issue.internal_reference_number}
                                className='text-blue-500 underline'
                            >
                                #{user_order_issue.internal_reference_number}
                            </Link>
                        </div>
                        <div className="text-sm text-gray-500 flex flex-row items-center gap-2">
                            <span> Cancellation Reason : </span>
                            <span
                                className='text-red-500'
                            >
                                {user_order_issue.universal_category_name}
                            </span>
                        </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`${status_meta.bg} ${status_meta.fg} border px-4 py-2 text-sm font-medium uppercase rounded-full`}>
                            {status_meta?.name}
                        </span>

                    </div>
                </div>
            </div>
        })}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-6 md:space-y-8">

                {/* Tracking Timeline */}
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Order Handling & Delivery Events</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="relative">

                            {delivered && <TrackingHistoryItem
                                icon={BsHouseCheck}
                                active={!delivered && !cancelled_items_returend}
                                title='Order Delivered'
                                subtitle={'Order sucessfuly delivered to customer'}
                                datetime={delivered?.created_at}
                            >


                                {delivered && delivered.remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>
                                    <span className='text-sm text-gray-600'>{delivered.remarks}</span>
                                </div>}

                            </TrackingHistoryItem>}

                            {cancelled_items_returend && <TrackingHistoryItem
                                icon={LuCornerDownLeft}
                                active={false}
                                title='Items Returned'
                                subtitle="Items returned back to seller's warehouse"
                                datetime={cancelled_items_returend.created_at}
                            >

                                {cancelled_items_returend.remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>
                                    <span className='text-sm text-gray-600'>{cancelled_items_returend.remarks}</span>
                                </div>}

                            </TrackingHistoryItem>}
                            {state.user_order_issues.length == 0 && !can_update && !delivered && <TrackingHistoryItem

                                icon={IoWarningOutline}
                                active={false}
                                title='Order Cancelled'
                                subtitle={'Customer cancelled the order'}
                                datetime={state?.shipment?.updated_at}
                            >



                            </TrackingHistoryItem>}
                            {state.user_order_issues.map(user_order_issue => {
                                return <TrackingHistoryItem
                                    key={user_order_issue.id}
                                    icon={IoWarningOutline}
                                    active={!cancellation && !delivered && !cancelled_items_returend}
                                    title='Order Cancelled'
                                    subtitle={user_order_issue.universal_category_name}
                                    datetime={user_order_issue?.created_at}
                                >
                                    <span className='text-xs text-red-700'>{cancellation?.issue_source == UserOrderIssueSource.Customer && 'Cancelled by customer'}</span>
                                    <span className='text-xs text-red-700'>{cancellation?.issue_source == UserOrderIssueSource.Seller && 'Cancelled by seller'}</span>
                                    <span className='text-xs text-red-700'>{cancellation?.issue_source == UserOrderIssueSource.Delivery && 'Cancelled due to delivery failure'}</span>

                                    {!cancellation && !cancelled_items_returend && <Btn size={'sm'} variant={'destructive'} onClick={returnItems}>Items Returned<LuCornerDownLeft /></Btn>}

                                    {cancelled && cancelled.remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>
                                        <span className='text-sm text-gray-600'>{cancelled.remarks}</span>
                                    </div>}


                                </TrackingHistoryItem>
                            })}
                            {out_for_delivery && <TrackingHistoryItem
                                icon={LiaCitySolid}
                                active={state.user_order_issues.length == 0 && state.shipment.status !== UserOrderStatus.Delivered}
                                title='Out for Delivery'
                                subtitle={`Items are out for delivery`}
                                datetime={out_for_delivery?.created_at}
                            >
                                {state.delivery_agent && <div className='rounded-lg p-3 bg-green-50 border border-green-700 inline-flex  items-center mb-2'>
                                    <Avatar className="h-10 w-10 mr-3">
                                        <AvatarImage src={state?.delivery_agent?.image} />
                                        <AvatarFallback>
                                            {nameLetter(state?.delivery_agent?.first_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{state?.delivery_agent?.first_name} {state?.delivery_agent?.last_name}</div>
                                        <span className='flex text-xs flex-row items-center gap-1'><LuPhone />{state?.delivery_agent?.mobile}</span>
                                        <span className='flex text-xs flex-row items-center gap-1'><LuMail />{state?.delivery_agent?.email}</span>
                                    </div>
                                </div>}
                                {(() => {
                                    const total = delivery_attempts.length;
                                    return delivery_attempts
                                        .map((a, idx) => ({ ...a, attempt_no: total - idx })) // idx 0 -> nth attempt = total
                                        .slice() // clone
                                        .reverse() // latest first
                                        .map((a) => (
                                            <div key={a.attempt_no} className="p-4 mb-3 rounded-lg border border-gray-200 shadow-sm bg-gray-50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge className="px-2 py-1 text-xs font-semibold">ATTEMPT {a.attempt_no}</Badge>
                                                    <span className="text-xs text-gray-500">{formatDateTime(a.created_at)}</span>
                                                </div>

                                                <div className="text-sm space-y-1">
                                                    <div className="flex gap-2">
                                                        <span className="font-medium text-gray-700">Reason:</span>
                                                        <span className="text-gray-800">{a.universal_category_name}</span>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <span className="font-medium text-gray-700">Next Attempt:</span>
                                                        <span className="text-gray-800">{formatDateTime(a.next_datetime)}</span>
                                                    </div>

                                                    {a.remarks && a.remarks.trim() !== "" && (
                                                        <div className="flex gap-2">
                                                            <span className="font-medium text-gray-700">Remarks:</span>
                                                            <span className="text-gray-800">{a.remarks}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ));
                                })()}


                                {!delivered && state.user_order_issues.length == 0 && <div className={cn(
                                    'flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg transition-all',
                                    form.status == UserOrderStatus.DeliveryAttempted && 'bg-red-50 border-red-400'
                                )}>
                                    <Radio value={form.status} onChange={(v) => {
                                        setValue('status')(v);
                                        if (v == UserOrderStatus.DeliveryAttempted) {
                                            loadReasons();
                                        }
                                    }} options={[
                                        { id: UserOrderStatus.Delivered, name: 'Delivered' },
                                        { id: UserOrderStatus.DeliveryAttempted, name: 'Attempted / Failed' }
                                    ]}>Delivery Status</Radio>
                                    {form.status === UserOrderStatus.DeliveryAttempted && <>
                                        {loadingReasons && <CenterLoading className="relative h-[100px]" />}
                                        <div className='grid grid-cols-3 gap-3'>
                                            {reasons.map(reason => {

                                                return <label
                                                    onClick={() => setValue('universal_category_id')(reason.id)}
                                                    className={cn(
                                                        'flex flex-row items-center gap-3 border p-2 rounded-lg bg-white hover:bg-accent transition-all cursor-pointer',
                                                        form.universal_category_id === reason.id && " bg-sky-50 border-sky-500"
                                                    )}>
                                                    {form.universal_category_id !== reason.id && <LuCircle className='text-xl' />}
                                                    {form.universal_category_id === reason.id && <LuCircleCheck className='text-xl' />}
                                                    <div className='flex flex-col'>
                                                        <span className='text-sm font-medium'>{reason.name}</span>
                                                        <span className='text-xs'>{reason.description}</span>
                                                    </div>
                                                </label>
                                            })}
                                        </div>
                                        <Radio value={form.action} onChange={(v) => {
                                            setValue('action')(v);
                                            if (v == UserOrderStatus.DeliveryAttempted) {
                                                loadReasons();
                                            }
                                        }} options={[
                                            { id: 'reattempt', name: 'Re-Attempt Delivery' },
                                            { id: 'cancel', name: 'Cancel Order' }
                                        ]}>Take Action</Radio>

                                        {form.action === 'reattempt' && <>
                                            <DateTimeField mode='datetime' outputFormat='Y-MM-DD HH:mm:ss' value={form.next_datetime} onChange={setValue('next_datetime')} placeholder='Select a date & time'>Next Date & Time</DateTimeField>
                                        </>}

                                    </>}
                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>

                                    <div>
                                        {form.status == UserOrderStatus.Delivered && <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r = await UserOrderService.delivered({
                                                shipment_id: state.shipment.id,
                                                remarks: form.remarks
                                            });
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}>Order Delivered<RiCheckDoubleFill /></Btn>}
                                        {form.status == UserOrderStatus.DeliveryAttempted && form.action == 'reattempt' && <Btn
                                            disabled={!form.universal_category_id || !form.next_datetime}
                                            size={'sm'}
                                            variant={'destructive'}
                                            asyncClick={async () => {
                                                var r = await UserOrderService.rescheduleDelivery({
                                                    shipment_id: state.shipment.id,
                                                    remarks: form.remarks,
                                                    universal_category_id: form.universal_category_id,
                                                    next_datetime: form.next_datetime
                                                });
                                                if (r.success) {
                                                    load();
                                                }
                                                return r.success;
                                            }}>Reschedule Delivery <LuCalendarSync /></Btn>}
                                        {form.status == UserOrderStatus.DeliveryAttempted && form.action == 'cancel' && <Btn
                                            disabled={!form.universal_category_id}
                                            size={'sm'}
                                            variant={'destructive'}
                                            asyncClick={async () => {
                                                var r = await UserOrderService.cancelDelivery({
                                                    shipment_id: state.shipment.id,
                                                    remarks: form.remarks,
                                                    universal_category_id: form.universal_category_id
                                                });
                                                if (r.success) {
                                                    load();
                                                }
                                                return r.success;
                                            }}>Cancel Order <TbMapPinCancel /></Btn>}
                                    </div>
                                </div>}

                            </TrackingHistoryItem>
                            }
                            {reached_nearest && <TrackingHistoryItem
                                icon={LiaCitySolid}
                                active={!out_for_delivery}
                                title='Reached Nearest To Customer'
                                subtitle={`Items have reached nested hub to customer`}
                                datetime={reached_nearest?.created_at}
                            >

                                {!out_for_delivery && <div className='flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg'>

                                    <SuggestEmployee value={form.user_id} onChange={setValue('user_id')} placeholder='Select an delivery agent'>Delivery Agent</SuggestEmployee>
                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>

                                    <div>
                                        <Btn disabled={!form.user_id} size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r = await UserOrderService.outForDelivery({
                                                shipment_id: state.shipment.id,
                                                remarks: form.remarks,
                                                user_id: form.user_id
                                            });
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}>Out for Delivery<MdOutlineDeliveryDining /></Btn>
                                    </div>
                                </div>}
                                {reached_nearest.remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>

                                    <span className='text-sm text-gray-600'>{reached_nearest.remarks}</span>
                                </div>}
                            </TrackingHistoryItem>}



                            {locations.length > 0 && !out_for_delivery && !reached_nearest && <TrackingHistoryItem
                                icon={LuTruck}
                                active={true}
                                title='Transit'
                                subtitle={`Items are in transit and yet to reach nearest to customer's address`}
                                datetime={dispatched?.created_at}
                            >

                                <div className='flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg'>
                                    <Radio value={form.status} onChange={setValue('status')} options={[
                                        { id: UserOrderStatus.Location, name: 'Reached a Location' },
                                        { id: UserOrderStatus.OutForDelivery, name: 'Out for Delivery' }
                                    ]}>Nearest to customer ?</Radio>
                                    {form.status === UserOrderStatus.Location && <>
                                        <TextField value={form.location} onChange={setValue('location')} placeholder='Enter location, city, hub, warehouse'>Location*</TextField>
                                        <Radio value={form.nearest} onChange={setValue('nearest')} options={YesNoArray}>Nearest to customer ?</Radio>
                                    </>}
                                    {form.status == UserOrderStatus.OutForDelivery && <SuggestEmployee value={form.user_id} onChange={setValue('user_id')} placeholder='Select an delivery agent'>Delivery Agent</SuggestEmployee>}
                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>

                                    <div>
                                        <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r: ApiResponseType;
                                            if (form.status === UserOrderStatus.OutForDelivery) {
                                                r = await UserOrderService.outForDelivery({
                                                    shipment_id: state.shipment.id,
                                                    remarks: form.remarks,
                                                    user_id: form.user_id
                                                });
                                            } else {
                                                r = await UserOrderService.addTransitLocation({
                                                    shipment_id: state.shipment.id,
                                                    remarks: form.remarks,
                                                    location: form.location,
                                                    nearest: form.nearest
                                                });
                                            }
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}>Add Update{form.status == UserOrderStatus.OutForDelivery ? <RiUserLocationLine /> : <GrMapLocation />}</Btn>
                                    </div>
                                </div>
                            </TrackingHistoryItem>}


                            {locations.map((location) => {

                                return (<TrackingHistoryItem
                                    key={location.id}
                                    icon={TbMapPinCheck}
                                    active={false}
                                    title={`Location - ${location.location}`}
                                    subtitle={`Items have reached ${location.location}`}
                                    datetime={location?.created_at}
                                >


                                    {location.remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>

                                        <span className='text-sm text-gray-600'>{location.remarks}</span>
                                    </div>}
                                </TrackingHistoryItem>);
                            })}


                            {dispatched && <TrackingHistoryItem
                                icon={LuTruck}
                                active={!dispatched}
                                title='Items Dispatched'
                                subtitle={`Items are dispatched from seller's end`}
                                datetime={dispatched?.created_at}
                            >

                                {(!locations.length && !out_for_delivery) && <div className='flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg'>
                                    <Radio value={form.status} onChange={setValue('status')} options={[
                                        { id: UserOrderStatus.Location, name: 'Reached a Location' },
                                        { id: UserOrderStatus.OutForDelivery, name: 'Out for Delivery' }
                                    ]}>Nearest to customer ?</Radio>
                                    {form.status === UserOrderStatus.Location && <>
                                        <TextField value={form.location} onChange={setValue('location')} placeholder='Enter location, city, hub, warehouse'>Location*</TextField>
                                        <Radio value={form.nearest} onChange={setValue('nearest')} options={YesNoArray}>Nearest to customer ?</Radio>
                                    </>}
                                    {form.status == UserOrderStatus.OutForDelivery && <SuggestEmployee value={form.user_id} onChange={setValue('user_id')} placeholder='Select an delivery agent'>Delivery Agent</SuggestEmployee>}

                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>

                                    <div>
                                        <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r: ApiResponseType;
                                            if (form.status === UserOrderStatus.OutForDelivery) {
                                                r = await UserOrderService.outForDelivery({
                                                    shipment_id: state.shipment.id,
                                                    remarks: form.remarks,
                                                    user_id: form.user_id
                                                });
                                            } else {
                                                r = await UserOrderService.addTransitLocation({
                                                    shipment_id: state.shipment.id,
                                                    remarks: form.remarks,
                                                    location: form.location,
                                                    nearest: form.nearest
                                                });
                                            }
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}>Add Update{form.status == UserOrderStatus.OutForDelivery ? <RiUserLocationLine /> : <GrMapLocation />}</Btn>
                                    </div>
                                </div>}
                                {dispatched && (!!state.shipment.reference_number || !!dispatched.remarks) && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>
                                    {state.shipment.reference_number && <div className='flex flex-row items-center gap-1'>
                                        <span className='text-gray-600 text-xs'>Reference Number :- </span>
                                        <span className='font-medium'>{state.shipment.reference_number}</span>
                                    </div>}
                                    <span className='text-sm text-gray-600'>{dispatched.remarks}</span>
                                </div>}
                            </TrackingHistoryItem>}


                            {ready_for_shipment && <TrackingHistoryItem
                                icon={TbTruckLoading}
                                active={!dispatched}
                                title='Ready for shipment'
                                subtitle={`Items are packed and ready for shipment`}
                                datetime={ready_for_shipment?.created_at}
                            >

                                {!dispatched && <div className='flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg'>
                                    <TextField value={form.reference_number} onChange={setValue('reference_number')} placeholder='Enter reference number'>Reference Number (If Any)</TextField>
                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>
                                    <div>
                                        <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r = await UserOrderService.dispatch({
                                                shipment_id: state.shipment.id,
                                                remarks: form.remarks,
                                                reference_number: form.reference_number
                                            });
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}>Dispatch<TbTruckDelivery /></Btn>
                                    </div>
                                </div>}
                                {dispatched && (!!state.shipment.reference_number || !!dispatched.remarks) && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>
                                    {state.shipment.reference_number && <div className='flex flex-row items-center gap-1'>
                                        <span className='text-gray-600 text-xs'>Reference Number :- </span>
                                        <span className='font-medium'>{state.shipment.reference_number}</span>
                                    </div>}
                                    <span className='text-sm text-gray-600'>{dispatched.remarks}</span>
                                </div>}
                            </TrackingHistoryItem>}

                            {!!state.shipment.shipment_provided && <TrackingHistoryItem
                                icon={LuTag}
                                active={!ready_for_shipment}
                                title='Print Labels'
                                subtitle={`Print lables for selected items`}
                                datetime={''}
                            >
                                {can_update && <div className='flex flex-row gap-3 mb-3'>
                                    <Btn size={'sm'} variant={'outline'} onClick={() => printLabels()}>Print Labels <LuPrinter /></Btn>
                                </div>}
                                {can_update && !ready_for_shipment && <div className='flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg'>
                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>
                                    <div>
                                        <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r = await UserOrderService.readyForShipment({
                                                shipment_id: state.shipment.id,
                                                remarks: form.remarks
                                            });
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}>Ready for Shipment <TbTruckLoading /></Btn>
                                    </div>
                                </div>}
                                {ready_for_shipment && !!ready_for_shipment?.remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-block rounded-lg p-2'>
                                    <span className='text-sm text-gray-600'>{ready_for_shipment.remarks}</span>
                                </div>}
                            </TrackingHistoryItem>}

                            <TrackingHistoryItem
                                icon={LuListCheck}
                                title='Stock Check / Items Picked'
                                subtitle={`You have selected ${state.shipment_items.length} ${state.shipment_items.length == 1 ? 'Item' : 'Items'} for processing`}
                                datetime={state.shipment.created_at}
                            >
                                {(!form.show_shipping_editor && !!state.shipment.shipment_provided) && <div className='flex flex-row gap-3 flex-wrap'>
                                    {!dispatched && <Btn size={'xs'} variant={'outline'} onClick={() => setValue('show_shipping_editor')(true)}><LuPencil /> Edit List</Btn>}
                                    {state.shipment_items.map((item) => <Badge variant={'outline'} key={item.id}>{item.name} ({item.quantity} {item.unit_name})</Badge>)}
                                </div>}
                                {can_update && !cancellation && (form.show_shipping_editor || !state.shipment.shipment_provided) && <div className='flex flex-col gap-3'>
                                    <Radio value={form.package_type || ShipmentPackageType.Individual} onChange={setValue('package_type')} options={ShipmentPackageTypeArray}>
                                        Packaging Type
                                    </Radio>
                                    {form.package_type == ShipmentPackageType.Individual && <div className="space-y-4">
                                        {form.items.map((item: any, idx: number) => (
                                            <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                                <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                                                    <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-auto">Qty: {item.quantity}</span>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <TextField
                                                        type="number"
                                                        value={item.package_weight}
                                                        onChange={setValue(`items[id:${item.id}].package_weight`)}
                                                        placeholder="0.0"
                                                    >
                                                        Weight (kg)
                                                    </TextField>

                                                    <TextField
                                                        type="number"
                                                        value={item.package_length}
                                                        onChange={setValue(`items[id:${item.id}].package_length`)}

                                                        placeholder="0.0"
                                                    >
                                                        Length (cm)
                                                    </TextField>

                                                    <TextField
                                                        type="number"
                                                        value={item.package_width}
                                                        onChange={setValue(`items[id:${item.id}].package_width`)}
                                                        placeholder="0.0"
                                                    >
                                                        Width (cm)
                                                    </TextField>

                                                    <TextField
                                                        type="number"
                                                        value={item.package_height}
                                                        onChange={setValue(`items[id:${item.id}].package_height`)}
                                                        placeholder="0.0"
                                                    >
                                                        Height (cm)
                                                    </TextField>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}

                                    {form.package_type == ShipmentPackageType.Consolidated && <div className=' bg-white rounded-lg border shadow'>
                                        <div className='flex flex-col border-b  p-3'>
                                            <span className='text-2xl font-medium'>Consolidated Package</span>
                                            <span className='text-xs text-gray-500'>Deliver goods in single package</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3">
                                            <TextField
                                                type="number"
                                                value={form.package_weight}
                                                onChange={setValue(`package_weight`)}
                                                placeholder="0.0"
                                            >
                                                Weight (kg)
                                            </TextField>

                                            <TextField
                                                type="number"
                                                value={form.package_length}
                                                onChange={setValue(`package_length`)}

                                                placeholder="0.0"
                                            >
                                                Length (cm)
                                            </TextField>

                                            <TextField
                                                type="number"
                                                value={form.package_width}
                                                onChange={setValue(`package_width`)}
                                                placeholder="0.0"
                                            >
                                                Width (cm)
                                            </TextField>

                                            <TextField
                                                type="number"
                                                value={form.package_height}
                                                onChange={setValue(`package_height`)}
                                                placeholder="0.0"
                                            >
                                                Height (cm)
                                            </TextField>
                                        </div>
                                    </div>}

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">Shipment Info</h3>

                                        <TextField
                                            placeholder="TRK-000000000"
                                            value={form.tracking_number}
                                            onChange={setValue('tracking_number')}
                                        >
                                            Tracking Number (Optional)
                                        </TextField>

                                        <div className="grid grid-cols-2 gap-3">
                                            <DateTimeField
                                                mode="datetime"
                                                placeholder="Select date"
                                                value={form.pickup_datetime}
                                                onChange={setValue('pickup_datetime')}
                                                previewFormat='DD MMM, Y LT'

                                            >
                                                Pickup Date
                                            </DateTimeField>

                                            <DateTimeField
                                                mode="datetime"
                                                placeholder="Select date"
                                                value={form.dispatch_datetime}
                                                onChange={setValue('dispatch_datetime')}
                                                previewFormat='DD MMM, Y LT'
                                            >
                                                Dispatch Date
                                            </DateTimeField>
                                        </div>

                                        <TextField
                                            multiline
                                            rows={4}
                                            placeholder="Any special handling instructions..."
                                            value={form.notes}
                                            onChange={setValue('notes')}
                                        >
                                            Notes / Remarks
                                        </TextField>
                                    </div>

                                    <div>
                                        <Btn asyncClick={async () => {
                                            var r = await UserOrderService.updateShipment({
                                                shipment_id: state.shipment.id,
                                                items: form.items.map((i: ShipmentItem) => ({
                                                    id: i.id,
                                                    package_weight: i.package_weight,
                                                    package_length: i.package_length,
                                                    package_width: i.package_width,
                                                    package_height: i.package_height
                                                })),
                                                tracking_number: form.tracking_number,
                                                pickup_date: form.pickup_date,
                                                dispatch_date: form.dispatch_date,
                                                notes: form.notes,
                                                package_type: form.package_type,
                                                package_weight: form.package_weight,
                                                package_length: form.package_length,
                                                package_width: form.package_width,
                                                package_height: form.package_height
                                            });
                                            if (r.success) {
                                                msg.success('Shipment details updated');
                                                setValue('show_shipping_editor')(false);
                                                setStateValue('shipment.shipment_provided')(1);
                                            }
                                            return r.success;
                                        }}>
                                            <LuSave />
                                            <span className='text-xs'>Save Information</span>
                                        </Btn>
                                    </div>
                                </div>}
                            </TrackingHistoryItem>
                            <TrackingHistoryItem
                                icon={LuPlus}
                                title='Order Placed'
                                subtitle='Customer placed order'
                                datetime={state?.shipment?.order_created_at}
                                show_line={false}
                            >
                                <p className="text-sm font-medium text-gray-700 mt-1">
                                    <LuHash className="w-3 h-3 inline mr-1" />
                                    {state.shipment.order_internal_reference_number}
                                </p>
                            </TrackingHistoryItem>

                        </div>
                    </CardContent>
                </Card>

                {/* Shipped Items */}
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-900">Shipped Items</CardTitle>
                            <Badge variant="outline" className="gap-2">
                                <Package className="w-3 h-3" />
                                {state.shipment_items.length} Items
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {state.shipment_items.map((item, index) => {

                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
                                    >

                                        <SafeImage src={item.image} className="w-16 h-16 min-h-16 min-w-16 grow-0 object-contain p-1 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                            <Package className="w-6 h-6 text-gray-400" />
                                        </SafeImage>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500 mb-3">SKU: {item.sku}</p>

                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">Ordered:</span>
                                                    <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">Shipped:</span>
                                                    <span className={`text-sm font-semibold text-emerald-600`}>
                                                        {item.quantity}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {item.currency_symbol}{item.sp}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">Total Shipped Value</span>
                                    <span className="text-xl font-bold text-gray-900">
                                        {state.shipment.currency_symbol}{state.shipment.amount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <CardTitle className="text-base font-semibold text-gray-900">Delivery Address</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900">{state.buyer_party.name}</p>
                                <p className="text-sm text-gray-700">{state.buyer_party.address}</p>
                                <p className="text-sm text-gray-700">
                                    {state.buyer_party.country_name}, {state.buyer_party.state_name} {state.buyer_party.pincode}
                                </p>
                                <p className="text-sm text-gray-700">{state.buyer_party.country_name}</p>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Shipment Notes */}
                {!!state.shipment.remarks && (
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-semibold text-gray-900">Shipment Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-gray-700">{state.shipment.remarks}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Column - Quick Info */}
            <div className="space-y-6 md:space-y-8">
                {/* Delivery Estimate */}
                {(dispatched || reached_nearest || out_for_delivery || state.delivery_agent) && <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">

                        <div className="space-y-4">
                            {state.delivery_agent && <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={state?.delivery_agent?.image} />
                                    <AvatarFallback>
                                        {nameLetter(state?.delivery_agent?.first_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Delivery Agent</p>
                                    <p className="font-semibold text-gray-900">
                                        {state?.delivery_agent?.first_name} {state?.delivery_agent?.last_name}
                                    </p>
                                    <span className='flex text-xs flex-row items-center gap-1'><LuPhone />{state?.delivery_agent?.mobile}</span>
                                    <span className='flex text-xs flex-row items-center gap-1'><LuMail />{state?.delivery_agent?.email}</span>
                                </div>
                            </div>}
                            {out_for_delivery && <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <MdOutlineDeliveryDining className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Out for Delivery</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatDateTime(out_for_delivery.created_at)}
                                    </p>
                                </div>
                            </div>}
                            {reached_nearest && <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <LiaCitySolid className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Reached Nearest to customer</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatDateTime(reached_nearest.created_at)}
                                    </p>
                                </div>
                            </div>}

                            {dispatched && <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Dispatched Date</p>
                                    <p className="font-semibold text-gray-900">{formatDateTime(dispatched.created_at)}</p>
                                </div>
                            </div>}
                        </div>
                    </CardContent>
                </Card>}

                {/* Shipment Details */}
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Shipment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Carrier</p>
                                <p className="font-semibold text-gray-900">{state.shipment.courier_channel_name}</p>
                            </div>



                            <div>
                                <p className="text-xs text-gray-500 mb-1">Shipping Cost</p>
                                <p className="font-semibold text-gray-900">{state.shipment.currency_symbol}{state.shipment.shipping}</p>
                            </div>
                            {state.shipment.package_type == ShipmentPackageType.Consolidated && <>
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Package Weight</p>
                                    <p className="font-medium text-gray-900">{state.shipment.package_weight}KG</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                                    <p className="font-medium text-gray-900">w{state.shipment.package_width} x l{state.shipment.package_length} x h{state.shipment.package_height} CM</p>
                                </div>
                            </>}
                            {state.shipment.package_type == ShipmentPackageType.Individual && state.shipment_items.map(item => {
                                return (<div key={item.id} className='border-t   border-gray-100 pt-4'>
                                    <span className='font-medium text-xl text-gray-800'>{item.name}</span>
                                    <div className="">
                                        <p className="text-xs text-gray-500 mb-1">Package Weight</p>
                                        <p className="font-medium text-gray-900">{item.package_weight}KG</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                                        <p className="font-medium text-gray-900">w{item.package_width} x l{item.package_length} x h{item.package_height} CM</p>
                                    </div>
                                </div>);
                            })}


                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Edit className="w-4 h-4" />
                                Edit Shipment Details
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Truck className="w-4 h-4" />
                                Change Carrier
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <AlertCircle className="w-4 h-4" />
                                Report Issue
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppPage>);
}