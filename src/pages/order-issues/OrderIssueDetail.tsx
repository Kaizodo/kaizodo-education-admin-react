import AppPage from '@/components/app/AppPage';
import CenterLoading from '@/components/common/CenterLoading';
import { Party } from '@/data/UserOrder';
import { useForm } from '@/hooks/use-form';
import { UserOrderService } from '@/services/UserOrderService';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { OrderIssueDetailState } from '@/data/order-issue';
import { getUserOrderIssueSourceName, getUserOrderIssueTypeName, UserOrderIssueType } from '@/data/order';
import Btn from '@/components/common/Btn';
import SafeImage from '@/components/common/SafeImage';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TrackingHistoryItem } from '@/components/common/TrackingHistoryItem';
import { LuBadgeAlert, LuBadgeCheck, LuBadgeHelp, LuBadgeX, LuCalendarClock, LuCircleCheck, LuCircleX, LuCornerDownLeft, LuHash, LuListChecks, LuPlus } from 'react-icons/lu';
import TextField from '@/components/common/TextField';
import DateTimeField from '@/components/common/DateTimeField';
import { Modal } from '@/components/common/Modal';
import IssueItemReturnDialog from './components/IssueItemReturnDialog';
import { TbRefresh } from 'react-icons/tb';




const PartyDetail: React.FC<{ title: string, party: Party }> = ({ title, party }) => (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1">{title}</h3>
        <p className="text-xl font-semibold text-indigo-700">{party.name}</p>
        <p className="text-sm text-gray-600 mt-1">
            {party.address}
            <br />
            {party.country_name}, {party.state_name} - {party.pincode}
        </p>
        <p className="text-xs mt-3 font-medium">
            <span className="font-bold text-gray-700">GSTIN:</span> {party.gst_number}
        </p>

    </div>
);



export default function OrderIssueDetail() {
    const navigate = useNavigate();
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<OrderIssueDetailState>();
    const [form, setValue, setForm] = useForm<any>({})


    const load = async () => {
        if (!internal_reference_number) {
            return;
        }
        setLoading(true);
        var r = await UserOrderService.issueDetail(internal_reference_number);
        if (r.success) {
            setState(r.data);
            setForm({});
            setLoading(false);
        } else {
            navigate(-1);
        }
    }


    const returnItems = () => {
        if (!state) {
            return;
        }
        const modal_id = Modal.show({
            title: 'Return Items',
            subtitle: 'Update stock for returned items',
            maxWidth: 700,
            content: () => <IssueItemReturnDialog state={state} onSuccess={() => {
                load();
                Modal.close(modal_id);
            }} />
        })
    }


    useEffect(() => {
        load();
    }, [internal_reference_number])


    if (!state || loading) {
        return <CenterLoading className="relative h-screen" />
    }




    return (<AppPage
        enableBack={true}
        title={`${getUserOrderIssueTypeName(state.user_order_issue.issue_type)} #` + state.user_order_issue.internal_reference_number}
        subtitle={`ORDER #${state.user_order_issue.order_internal_reference_number}`}
        actions={<div className='text-xs flex flex-col'>
            <span className='font-medium text-red-600 bg-red-50 border border-red-800 rounded-full px-2 text-xs'>Created by {getUserOrderIssueSourceName(state.user_order_issue.issue_source)}</span>
            <span className='italic'>On {formatDateTime(state.user_order_issue.created_at)}</span>
        </div>}
    >
        <div className='flex flex-row gap-6'>
            <div className="flex-1 ">



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <PartyDetail title="Seller (Billed From)" party={state.seller_party} />
                    <PartyDetail title="Buyer (Billed To)" party={state.buyer_party} />
                </div>

                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Handling Events</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="relative">

                            {state.user_order_issue.is_approved == 1 && <TrackingHistoryItem
                                icon={LuListChecks}
                                title={!state.user_order_issue.is_items_received ? `Received Items & Update Stock` : 'Items Received'}
                                subtitle={`Once item receive you can update the stock`}
                                show_line={true}
                                active={!state.user_order_issue.is_items_received}
                            >
                                {!state.user_order_issue.is_items_received && <Btn size={'sm'} variant={'destructive'} onClick={returnItems}>Items Returned<LuCornerDownLeft /></Btn>}

                                {!!state.user_order_issue.receiving_remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>
                                    <span className='text-sm text-gray-600'>{state.user_order_issue.receiving_remarks}</span>
                                </div>}


                            </TrackingHistoryItem>}

                            {!!state.user_order_issue.is_pickup_scheduled && <TrackingHistoryItem
                                icon={state.user_order_issue.is_approved === 0
                                    ? LuBadgeAlert
                                    : state.user_order_issue.is_approved === 1
                                        ? LuBadgeCheck
                                        : state.user_order_issue.is_approved === 2
                                            ? LuBadgeX
                                            : LuBadgeHelp}
                                title={
                                    state.user_order_issue.is_approved === 0
                                        ? "Request Approval"
                                        : state.user_order_issue.is_approved === 1
                                            ? "Request Approved"
                                            : state.user_order_issue.is_approved === 2
                                                ? "Request Declined"
                                                : ""
                                }
                                subtitle={`Approve or reject the request`}
                                show_line={true}
                                active={!state.user_order_issue.is_approved}
                            >
                                {!state.user_order_issue.is_approved && <div className='flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg'>
                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>
                                    <div className='flex flex-row gap-3'>
                                        <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r = await UserOrderService.handleIssueApproval({
                                                user_order_issue_id: state.user_order_issue.id,
                                                remarks: form.remarks,
                                                approved: 1
                                            });
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}><LuCircleCheck /> Approve</Btn>
                                        <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r = await UserOrderService.handleIssueApproval({
                                                user_order_issue_id: state.user_order_issue.id,
                                                remarks: form.remarks,
                                                approved: 0
                                            });
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}>Decline <LuCircleX /></Btn>
                                    </div>
                                </div>}

                                {!!state.user_order_issue.approval_remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>

                                    <span className='text-sm text-gray-600'>{state.user_order_issue.approval_remarks}</span>
                                </div>}

                            </TrackingHistoryItem>}

                            <TrackingHistoryItem
                                icon={LuCalendarClock}
                                title={state.user_order_issue.is_pickup_scheduled ? `Pickup Scheduled` : 'Schedule Pickup'}
                                subtitle={state.user_order_issue.is_pickup_scheduled ? `Pickup on ${formatDateTime(state.user_order_issue.pickup_datetime)}` : `Schdule pickup so customer can send products back for inspection and further process.`}
                                show_line={true}
                                active={!state.user_order_issue.is_pickup_scheduled}
                            >
                                {!state.user_order_issue.is_pickup_scheduled && <div className='flex flex-col gap-3 p-3 bg-sky-50 border-sky-400 border w-full rounded-lg'>
                                    <DateTimeField value={form.pickup_datetime} outputFormat='Y-MM-DD HH:mm:ss' onChange={setValue('pickup_datetime')} mode='datetime' placeholder='Select a date and time'>Schedule Pickup</DateTimeField>
                                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>
                                    <div className='flex flex-row gap-3'>
                                        <Btn size={'sm'} variant={'destructive'} asyncClick={async () => {
                                            var r = await UserOrderService.scheduleIssuePickup({
                                                pickup_datetime: form.pickup_datetime,
                                                user_order_issue_id: state.user_order_issue.id,
                                                remarks: form.remarks
                                            });
                                            if (r.success) {
                                                load();
                                            }
                                            return r.success;
                                        }}><LuCalendarClock /> Schedule</Btn>
                                    </div>
                                </div>}

                                {!!state.user_order_issue.pickup_remarks && <div className='bg-sky-50 border-sky-400 border  self-start inline-flex rounded-lg p-2  flex-col'>

                                    <span className='text-sm text-gray-600'>{state.user_order_issue.pickup_remarks}</span>
                                </div>}

                            </TrackingHistoryItem>




                            <TrackingHistoryItem
                                icon={LuPlus}
                                title={`${getUserOrderIssueTypeName(state.user_order_issue.issue_type)} Created`}
                                subtitle={` ${getUserOrderIssueSourceName(state.user_order_issue.issue_source)} created request`}
                                datetime={state?.user_order_issue?.created_at}
                                show_line={false}
                            >
                                <p className="text-sm font-medium text-gray-700 mt-1">
                                    <LuHash className="w-3 h-3 inline mr-1" />
                                    {state.user_order_issue.internal_reference_number}
                                </p>
                            </TrackingHistoryItem>

                        </div>
                    </CardContent>
                </Card>




            </div>
            <div className='w-[350px] '>
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 py-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                            <span>Items</span>
                            <Badge>{state.user_order_issue_items.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-4">

                        {state.user_order_issue.issue_type !== UserOrderIssueType.Replacement && state.user_order_issue_items.map((item, index) => {

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
                                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Quantity:</span>
                                            <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">Amount</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {item.currency_symbol}{item.total_amount}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {state.user_order_issue.issue_type == UserOrderIssueType.Replacement && state.user_order_issue_items.map((item, index) => {

                            return (
                                <div
                                    key={index}
                                    className="p-3 rounded-xl border bg-white flex gap-4 items-center"
                                >

                                    <div className="flex gap-3">
                                        {/* Original product */}
                                        <div className="flex flex-col items-center w-20">
                                            <SafeImage
                                                src={item.image}
                                                className="w-14 h-14 object-contain rounded-lg border bg-white p-1"
                                            >
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </SafeImage>

                                            <p className="text-[11px] mt-1 text-center text-gray-700 line-clamp-2">
                                                {item.name}
                                            </p>
                                            <p className="text-[10px] text-gray-500">SKU: {item.sku}</p>
                                        </div>

                                        <TbRefresh className="text-blue-500 shrink-0 mt-6" />

                                        {/* Exchange product */}
                                        <div className="flex flex-col items-center w-20">
                                            <SafeImage
                                                src={item.exchange_product_image}
                                                className="w-14 h-14 object-contain rounded-lg border bg-white p-1"
                                            >
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </SafeImage>

                                            <p className="text-[11px] mt-1 text-center text-gray-700 line-clamp-2">
                                                {item.exchange_product_name}
                                            </p>
                                            <p className="text-[10px] text-gray-500">SKU: {item.exchange_product_sku}</p>
                                        </div>
                                    </div>

                                    <div className="ml-auto text-right">
                                        <p className="text-[11px] text-gray-500">Amount</p>
                                        <p className="text-base font-semibold">
                                            {item.currency_symbol}{item.total_amount}
                                        </p>
                                        <p className="text-[10px]">{item.quantity} {item.unit_name}</p>
                                    </div>
                                </div>

                            );
                        })}

                    </CardContent>
                </Card>
            </div>
        </div>
    </AppPage>);
};
