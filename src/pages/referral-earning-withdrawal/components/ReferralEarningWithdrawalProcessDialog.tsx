
import { useEffect, useState } from 'react';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import { ReferralEarningWithdrawalService } from '@/services/ReferralEarningWithdrawalService';
import CenterLoading from '@/components/common/CenterLoading';
import { useForm } from '@/hooks/use-form';
import Dropdown from '@/components/common/Dropdown';
import { Badge } from '@/components/ui/badge';
import { EarningWithdrawalStatus, EarningWithdrawalStatusArray, getEarningWithdrawalStatusName, PaymentMethod } from '@/data/user';
import { formatDateTime } from '@/lib/utils';
import TextField from '@/components/common/TextField';
import { Link } from 'react-router-dom';


interface Props {
    record: any,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}
type WithdrawalRecord = {
    record: {
        id: number;
        user_id: string;
        currency_id: number | null;
        bank_name: string;
        bank_account_number: string;
        bank_ifsc_code: string;
        bank_branch_name: string;
        payment_method: number;
        paypal_email: string | null;
        upi_id: string | null;
        amount: string;
        internal_reference_number: string;
        status: number;
        status_datetime: string | null;
        status_remarks: string | null;
        reference_number: string | null;
        created_at: string;
        updated_at: string | null;
    };
    items: {
        id: number;
        is_settled: number;
        client_user_id: string;
        referrer_user_id: string | null;
        internal_reference_number: string;
        order_internal_reference_number: string;
        total_amount: string;
        earned_percentage: string;
        earned_amount: string;
        converted_earned_amount: string;
        is_renewal: number;
        is_secondary: number;
        user_id: string;
        product_id: number;
        product_name: string;
        first_name: string;
        last_name: string;
        mobile: string;
        email: string;
        code: string | null;
        original_currency_symbol: string;
        original_currency_code: string;
        original_currency_rate: string;
        original_currency_name: string;
        original_currency_id: number;
        converted_currency_symbol: string;
        converted_currency_code: string;
        converted_currency_rate: string;
        converted_currency_name: string;
        converted_currency_id: number;
        maturity_days: number;
        maturity_datetime: string;
        created_at: string;
        updated_at: string;
        status_remarks: string;
        reference_number: string;
        status: number;
        updated_status: number;
    }[];
};







export default function ReferralEarningWithdrawalProcessDialog({ record, onCancel }: Props) {
    const [loading, setLoading] = useState(true);
    const [state, setStateValue, setState] = useForm<WithdrawalRecord>()



    const load = async () => {
        setLoading(true);
        let r = await ReferralEarningWithdrawalService.detail(record.id);
        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            onCancel();
        }
    }





    useEffect(() => {
        load();
    }, [])


    var options = EarningWithdrawalStatusArray.filter(e => [
        EarningWithdrawalStatus.Completed,
        EarningWithdrawalStatus.Processing,
        EarningWithdrawalStatus.OnHold
    ].includes(e.id));


    if (!state || loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <>
            <ModalBody className='relative py-6 max-h-[80vh] overflow-y-auto'>
                {/* Record Information */}
                <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold">Withdrawal Request Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* same as before */}
                        <div><span className="font-medium text-muted-foreground">Request ID:</span><p className="mt-1 font-mono text-sm">{state.record.internal_reference_number}</p></div>
                        <div><span className="font-medium text-muted-foreground">Amount:</span><p className="mt-1 text-lg font-semibold">{state.record.amount} {state.record.currency_id === 1 ? 'INR' : 'USD'}</p></div>
                        <div>
                            <span className="font-medium text-muted-foreground">Status:</span>
                            <p className="mt-1">
                                <Badge variant={state.record.status === EarningWithdrawalStatus.Pending ? 'default' : state.record.status === EarningWithdrawalStatus.Rejected ? 'destructive' : 'secondary'}>
                                    {getEarningWithdrawalStatusName(state.record.status)}
                                </Badge>
                            </p>
                        </div>
                        {/* payment method details same as before */}
                        {state.record.payment_method === PaymentMethod.Bank && (
                            <>
                                <div><span className="font-medium text-muted-foreground">Bank:</span><p className="mt-1">{state.record.bank_name}</p></div>
                                <div><span className="font-medium text-muted-foreground">A/C No:</span><p className="mt-1 font-mono">{state.record.bank_account_number}</p></div>
                                <div><span className="font-medium text-muted-foreground">IFSC:</span><p className="mt-1 font-mono uppercase">{state.record.bank_ifsc_code}</p></div>
                            </>
                        )}
                        {state.record.payment_method === PaymentMethod.Paypal && state.record.paypal_email && <div><span className="font-medium text-muted-foreground">PayPal:</span><p className="mt-1">{state.record.paypal_email}</p></div>}
                        {state.record.payment_method === PaymentMethod.UPI && state.record.upi_id && <div><span className="font-medium text-muted-foreground">UPI ID:</span><p className="mt-1">{state.record.upi_id}</p></div>}
                        {state.record.payment_method === PaymentMethod.ClosedWallet && <div><span className="font-medium text-muted-foreground">Payment Method:</span><p className="mt-1">Closed Wallet</p></div>}
                        <div><span className="font-medium text-muted-foreground">Requested On:</span><p className="mt-1">{formatDateTime(state.record.created_at)}</p></div>
                        {state.record.reference_number && <div><span className="font-medium text-muted-foreground">Transaction Ref:</span><p className="mt-1 font-mono">{state.record.reference_number}</p></div>}
                    </div>
                </div>

                {/* Items List - Card Style (no table distortion) */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Included Earnings ({state.items.length})</h3>
                    {state.items.map((item) => {
                        const isFinal = [2, 3].includes(item.status); // Completed or Rejected
                        return (
                            <div key={item.id} className="rounded-lg border bg-card p-5 shadow-sm">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {/* Left - Product & Client */}
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Product</p>
                                            <p className="font-semibold">{item.product_name}</p>
                                            <div className='flex flex-row items-center gap-3'>
                                                <span className='text-sm'>Customer Order : </span>
                                                <Link to={'/orders/' + item.order_internal_reference_number} target='_blank'>
                                                    <span className='text-blue-600 font-medium text-sm hover:underline'>{item.order_internal_reference_number}</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Client</p>
                                            <div className="text-sm">
                                                <div>{item.first_name} {item.last_name}</div>
                                                <div className="text-muted-foreground">{item.email}</div>
                                                <div className="text-muted-foreground">{item.mobile}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center - Amounts & Type */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Original Amount</span>
                                            <span>{item.original_currency_symbol}{item.total_amount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Rate</span>
                                            <span>{item.earned_percentage}%</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Earned (Converted)</span>
                                            <span>{item.converted_currency_symbol}{item.converted_earned_amount}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Type:</span>
                                            <Badge variant={item.is_renewal ? 'default' : item.is_secondary ? 'secondary' : 'outline'}>
                                                {item.is_renewal ? 'Renewal' : item.is_secondary ? 'Secondary' : 'New'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Right - Status Update Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Status</span>
                                            <Badge variant={item.status === 2 ? 'default' : item.status === 3 ? 'destructive' : 'secondary'}>
                                                {getEarningWithdrawalStatusName(item.status)}
                                            </Badge>
                                        </div>

                                        {!isFinal ? (
                                            <>
                                                <Dropdown
                                                    searchable={false}
                                                    value={item.updated_status ?? item.status}
                                                    onChange={setStateValue(`items[id:${item.id}].updated_status`)}
                                                    getOptions={async () => options}
                                                    placeholder="Change status"
                                                />
                                                <TextField
                                                    value={item.status_remarks || ''}
                                                    onChange={setStateValue(`items[id:${item.id}].status_remarks`)}
                                                    multiline
                                                    rows={2}
                                                    placeholder="Remarks (optional)"
                                                />
                                                <TextField
                                                    value={item.reference_number || ''}
                                                    onChange={setStateValue(`items[id:${item.id}].reference_number`)}
                                                    placeholder="Transaction ID / Ref (optional)"
                                                />
                                                <Btn
                                                    size="sm"
                                                    disabled={!item.updated_status}
                                                    asyncClick={async () => {
                                                        const r = await ReferralEarningWithdrawalService.updateItemStatus({
                                                            user_referral_history_id: item.id,
                                                            user_earning_withdrawal_id: state.record.id,
                                                            status: item.updated_status,
                                                            status_remarks: item.status_remarks,
                                                            reference_number: item.reference_number,
                                                        });
                                                        if (r.success) load();
                                                        return r.success;
                                                    }}
                                                >
                                                    Update Item
                                                </Btn>
                                            </>
                                        ) : (
                                            <>
                                                {item.status_remarks && (
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Remarks:</span>
                                                        <p className="mt-1 text-sm">{item.status_remarks}</p>
                                                    </div>
                                                )}
                                                {item.reference_number && (
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Ref:</span>
                                                        <p className="mt-1 font-mono text-sm">{item.reference_number}</p>
                                                    </div>
                                                )}
                                                <Badge variant="outline" className="w-full justify-center">Final Status</Badge>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Total */}
                    <div className="rounded-lg border bg-muted/50 p-4 text-right">
                        <span className="text-lg font-semibold">Total: </span>
                        <span className="text-2xl font-bold">
                            {state.record.currency_id === 1 ? '₹' : '$'}{state.record.amount}
                        </span>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant="outline">Close</Btn>
            </ModalFooter>

        </>
    );
};

