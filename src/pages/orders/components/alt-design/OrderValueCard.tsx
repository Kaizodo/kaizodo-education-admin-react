import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { UserOrderStatus } from "@/data/order";
import { OrderDetailState } from "@/data/UserOrder";
import { DollarSign, TrendingUp, TrendingDown, XCircle } from "lucide-react";

export default function OrderValueCard({ state }: { state: OrderDetailState }) {

    const totalValue = Number(state.order.amount);
    const deliveredValue = state.shipments.filter(s => s.status == UserOrderStatus.Delivered).reduce((pv, cv) => pv += Number(cv.amount), 0);
    const cancelledValue = state.user_order_issue_items.reduce((pv, cv) => pv += Number(cv.total_amount), 0);
    const pendingValue = totalValue - deliveredValue - cancelledValue;

    const deliveredPercent = totalValue > 0 ? (deliveredValue / totalValue) * 100 : 0;
    const cancelledPercent = totalValue > 0 ? (cancelledValue / totalValue) * 100 : 0;

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    Order Value Summary
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                <DollarSign className="w-3 h-3 text-slate-600" />
                            </div>
                            <span className="text-xs text-slate-500 uppercase tracking-wide">Total</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{state.order.currency_symbol}{state.order.amount}</p>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span className="text-xs text-emerald-600 uppercase tracking-wide">Delivered</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">{state.order.currency_symbol}{deliveredValue.toFixed(2)}</p>
                        <p className="text-xs text-emerald-600 mt-1">{deliveredPercent.toFixed(1)}% of total</p>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center">
                                <TrendingDown className="w-3 h-3 text-amber-600" />
                            </div>
                            <span className="text-xs text-amber-600 uppercase tracking-wide">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-700">{state.order.currency_symbol}{pendingValue.toFixed(2)}</p>
                    </div>

                    <div className="bg-red-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">
                                <XCircle className="w-3 h-3 text-red-600" />
                            </div>
                            <span className="text-xs text-red-600 uppercase tracking-wide">Cancelled</span>
                        </div>
                        <p className="text-2xl font-bold text-red-700">{state.order.currency_symbol}{cancelledValue.toFixed(2)}</p>
                        <p className="text-xs text-red-600 mt-1">{cancelledPercent.toFixed(1)}% of total</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}