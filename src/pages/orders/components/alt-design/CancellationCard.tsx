
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, RotateCcw, RefreshCw } from "lucide-react";
import { OrderDetailState } from "@/data/UserOrder";
import { getUserOrderIssueStatusName, UserOrderIssueType } from "@/data/order";
import { formatDateTime } from "@/lib/utils";




export default function CancellationsCard({ state }: { state: OrderDetailState }) {


    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    Cancellations / Returns / Replacements
                    <Badge variant="secondary" className="ml-auto">{state.user_order_issues.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {state.user_order_issues.map(issue => {
                        const meta = getUserOrderIssueStatusName(issue.status);
                        const items = state.user_order_issue_items.filter(uoi => uoi.user_order_issue_id !== issue.id);

                        return (
                            <div
                                key={issue.id}
                                className="p-4 bg-slate-50 rounded-xl"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {issue.issue_type === UserOrderIssueType.Cancellation && (
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-100 text-red-700">
                                                <XCircle />
                                            </div>
                                        )}

                                        {issue.issue_type === UserOrderIssueType.Return && (
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100 text-orange-700">
                                                <RotateCcw />
                                            </div>
                                        )}

                                        {issue.issue_type === UserOrderIssueType.Replacement && (
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-700">
                                                <RefreshCw />
                                            </div>
                                        )}

                                        <div>
                                            <Badge className={` border-0`}>
                                                {meta}
                                            </Badge>

                                            <p className="text-xs text-slate-500 mt-1">
                                                {formatDateTime(issue.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">

                                        <span className="font-semibold text-slate-900">{state.order.currency_symbol}{items.reduce((pv, cv) => pv += Number(cv.total_amount), 0)}</span>
                                    </div>
                                </div>
                                {items && items.length > 0 && (
                                    <div className="pl-11 space-y-1">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-slate-600">{item.name}</span>
                                                <span className="text-slate-500">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!!issue.issue_universal_category_name && (
                                    <p className="pl-11 text-sm text-slate-500 mt-2 italic">"{issue.issue_universal_category_name}"</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}