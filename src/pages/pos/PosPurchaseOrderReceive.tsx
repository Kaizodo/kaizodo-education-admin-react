import AppPage from '@/components/app/AppPage';
import CenterLoading from '@/components/common/CenterLoading';
import { useForm } from '@/hooks/use-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDateTime } from '@/lib/utils';

import { PosService } from '@/services/PosService';
import Btn from '@/components/common/Btn';
import { useGlobalContext } from '@/hooks/use-global-context';
import { PurchaseOrderDetailState } from '@/data/PurchaseOrder';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import TextField from '@/components/common/TextField';
import SuggestTaxCode from '@/components/common/suggest/SuggestTaxCode';
import { LuArrowRight, LuCircleCheck } from 'react-icons/lu';
import { msg } from '@/lib/msg';
import DownloadPoBtn from './components/DownloadPoBtn';






export default function PosPurchaseOrderReceive() {
    const navigate = useNavigate();
    const { context } = useGlobalContext();
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setStateValue, setState] = useForm<PurchaseOrderDetailState>();


    const load = async () => {
        if (!internal_reference_number) {
            return;
        }
        setLoading(true);
        var r = await PosService.purchaseOrderDetail({
            internal_reference_number,
            organization_id: context.organization.id
        });
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


    if (!state || loading) {
        return <CenterLoading className="relative h-screen" />
    }




    return (<AppPage
        enableBack={true}
        title={'Purchase Order #' + state.purchase_order.internal_reference_number}
        subtitle={`${formatDateTime(state.purchase_order.created_at)}`}
        actions={<div className='flex flex-row items-center gap-3'>
            {!!state.purchase_order.is_received && <span className='flex flex-row items-center gap-2 py-1 px-3 rounded-full bg-green-100 border-green-600s border'>Recevied <LuCircleCheck /></span>}
            <DownloadPoBtn organization_id={state.purchase_order.organization_id} internal_reference_number={state.purchase_order.internal_reference_number} />
        </div>}
    >
        <div className="space-y-4">
            <div className='grid grid-cols-2 gap-3'>
                <Card className="rounded-2xl shadow">
                    <CardHeader>
                        <CardTitle className="text-lg">Vendor</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <div>Name: {state.seller_party.name}</div>
                        <div>Contact: {state.seller_party.mobile}</div>
                        <div>Email: {state.seller_party.email}</div>
                        {!!state.seller_party.gst_number && <div>GST: {state.seller_party.gst_number}</div>}
                    </CardContent>
                </Card>


                <Card className="rounded-2xl shadow">
                    <CardHeader>
                        <CardTitle className="text-lg">Order</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <div>PO: {state.purchase_order.internal_reference_number}</div>
                        <div>Amount: {state.purchase_order.amount}</div>
                        {!!state.purchase_order.is_received && <>
                            <div>Recevied at {formatDateTime(state.purchase_order.received_at)}</div>
                            <div>Ref No: #{state.purchase_order.receiving_number}</div>
                            <div>"{state.purchase_order.receiving_remarks}"</div>
                        </>}
                    </CardContent>
                </Card>
            </div>


            <Card className="rounded-2xl shadow">
                <CardHeader>
                    <CardTitle className="text-lg">Items</CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Tax Rate</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>MRP</TableHead>
                                <TableHead>Sell Price</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Requested Qty</TableHead>
                                <TableHead>Received Quantity</TableHead>
                                <TableHead>Total (CP)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.purchase_order_items.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>

                                    <TableCell>
                                        {!state.purchase_order.is_received && <div className='flex items-center gap-1'>
                                            <SuggestTaxCode
                                                disabled={!item.country_id}
                                                country_id={item.country_id}
                                                value={item.tax_code_id}
                                                selected={item.tax_code}
                                                onChange={setStateValue(`purchase_order_items[id:${item.id}].tax_code_id`)}
                                                placeholder='Select tax scheme' children=''
                                            />
                                        </div>}
                                        {!!state.purchase_order.is_received && <span>{item?.tax_code?.name}</span>}
                                    </TableCell>
                                    <TableCell>
                                        {!!state.purchase_order.is_received && (
                                            <div className='flex flex-col'>
                                                <span>{item.sku_received}</span>
                                                {item.sku_received !== item.sku && (
                                                    <span className='text-sm text-gray-600 line-through'>{item.sku}</span>
                                                )}
                                            </div>
                                        )}

                                        {!state.purchase_order.is_received && (
                                            <div className='flex items-center gap-1'>
                                                <TextField
                                                    disabled={!item.country_id || !item.tax_code_id}
                                                    value={item.sku}
                                                    onChange={setStateValue(`purchase_order_items[id:${item.id}].sku`)}
                                                    placeholder='Enter Sku'
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {!!state.purchase_order.is_received && (
                                            <div className='flex flex-col'>
                                                <span>{item.currency_symbol}{item.mrp_received}</span>
                                                {item.mrp_received !== item.mrp && (
                                                    <span className='text-sm text-gray-600 line-through'>{item.currency_symbol}{item.mrp}</span>
                                                )}
                                            </div>
                                        )}

                                        {!state.purchase_order.is_received && (
                                            <div className='flex items-center gap-1'>
                                                <span className='text-xl text-gray-600'>{item.currency_symbol}</span>
                                                <TextField
                                                    disabled={!item.country_id || !item.tax_code_id}
                                                    type='number'
                                                    value={item.mrp}
                                                    onChange={setStateValue(`purchase_order_items[id:${item.id}].mrp`)}
                                                    placeholder='Enter Mrp'
                                                />
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* SP */}
                                    <TableCell>
                                        {!!state.purchase_order.is_received && (
                                            <div className='flex flex-col'>
                                                <span>{item.currency_symbol}{item.sp_received}</span>
                                                {item.sp_received !== item.sp && (
                                                    <span className='text-sm text-gray-600 line-through'>{item.currency_symbol}{item.sp}</span>
                                                )}
                                            </div>
                                        )}

                                        {!state.purchase_order.is_received && (
                                            <div className='flex items-center gap-1'>
                                                <span className='text-xl text-gray-600'>{item.currency_symbol}</span>
                                                <TextField
                                                    disabled={!item.country_id || !item.tax_code_id}
                                                    type='number'
                                                    value={item.sp}
                                                    onChange={setStateValue(`purchase_order_items[id:${item.id}].sp`)}
                                                    placeholder='Enter Selling Price'
                                                />
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* CP */}
                                    <TableCell>
                                        {!!state.purchase_order.is_received && (
                                            <div className='flex flex-col'>
                                                <span>{item.currency_symbol}{item.cp_received}</span>
                                                {item.cp_received !== item.cp && (
                                                    <span className='text-sm text-gray-600 line-through'>{item.currency_symbol}{item.cp}</span>
                                                )}
                                            </div>
                                        )}

                                        {!state.purchase_order.is_received && (
                                            <div className='flex items-center gap-1'>
                                                <span className='text-xl text-gray-600'>{item.currency_symbol}</span>
                                                <TextField
                                                    disabled={!item.country_id || !item.tax_code_id}
                                                    type='number'
                                                    value={item.cp}
                                                    onChange={setStateValue(`purchase_order_items[id:${item.id}].cp`)}
                                                    placeholder='Enter Cost Price'
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.quantity} {item.unit_name}</TableCell>
                                    <TableCell>
                                        {!state.purchase_order.is_received && <div className='flex items-center gap-1'>
                                            <TextField disabled={!item.country_id || !item.tax_code_id} min={0} max={item.quantity} type='number' value={item.quantity_received} onChange={setStateValue(`purchase_order_items[id:${item.id}].quantity_received`)} placeholder='Enter Quantity' children='' />
                                            <span className='text-sm text-gray-600'>{item.unit_name}</span>
                                        </div>}
                                        {!!state.purchase_order.is_received && <span>{item.quantity_received}  {item.unit_name}</span>}
                                    </TableCell>
                                    <TableCell>{item.currency_symbol}{(Number(item.quantity_received) * Number(item.cp_received)).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                {!state.purchase_order.is_received && <CardFooter className='justify-end border-t pt-6 gap-3 items-end'>
                    <div className='w-full max-w-[400px]'>
                        <TextField placeholder='Remarks' value={state.receiving_remarks} onChange={setStateValue('receiving_remarks')} multiline >Remarks</TextField>
                    </div>
                    <div className='w-full max-w-[300px]'>
                        <TextField placeholder='Receiving Number / Invoice Number' value={state.receiving_number} onChange={setStateValue('receiving_number')} >Receiving Number</TextField>
                    </div>
                    <Btn disabled={!!state.purchase_order_items.find(poi => !poi.country_id || !poi.tax_code_id)} asyncClick={async () => {
                        var r = await PosService.purchaseOrderReceive({
                            purchase_order_id: state.purchase_order.id,
                            organization_id: state.purchase_order.organization_id,
                            products: state.purchase_order_items,
                            receiving_remarks: state.receiving_remarks,
                            receiving_number: state.receiving_number
                        });
                        if (r.success) {
                            msg.success('Purchase order recevied');
                            setState(r.data);
                        }
                        return r.success;
                    }}>Recevie Products <LuArrowRight /></Btn>
                </CardFooter>}
            </Card>
        </div>
    </AppPage>);
};
