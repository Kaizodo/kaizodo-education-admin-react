import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { OrderDetailState } from '@/data/UserOrder';
import { formatDateTime } from "@/lib/utils";
import { getUserOrderStatusMeta } from "@/data/order";


export default function InvoicesCard({ state }: { state: OrderDetailState }) {
    if (!state.invoices || state.invoices.length === 0) {
        return (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        Generated Invoices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No invoices generated yet</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    Generated Invoices
                    <Badge variant="secondary" className="ml-auto">{state.invoices.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {state.invoices.map(invoice => {
                        const meta = getUserOrderStatusMeta(invoice.status)
                        return (<Link
                            to={'/invoices/' + invoice.internal_reference_number}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            key={invoice.id}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{invoice.internal_reference_number}</p>
                                    <p className="text-sm text-slate-500">
                                        {formatDateTime(invoice.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={`${meta.bg} ${meta.fg} border-0`}>{meta.name}</Badge>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View <ExternalLink className="w-3 h-3" />
                                </Button>
                            </div>
                        </Link>);
                    })}
                </div>
            </CardContent>
        </Card>
    );
}