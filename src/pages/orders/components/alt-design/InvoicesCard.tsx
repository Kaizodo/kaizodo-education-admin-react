import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Package, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const statusConfig = {
    generated: { label: 'Generated', color: 'bg-slate-100 text-slate-700' },
    labels_generated: { label: 'Labels Ready', color: 'bg-blue-100 text-blue-700' },
    ready_to_dispatch: { label: 'Ready to Dispatch', color: 'bg-indigo-100 text-indigo-700' },
    dispatched: { label: 'Dispatched', color: 'bg-purple-100 text-purple-700' },
    in_transit: { label: 'In Transit', color: 'bg-cyan-100 text-cyan-700' },
    near_customer: { label: 'Near Customer', color: 'bg-teal-100 text-teal-700' },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-amber-100 text-amber-700' },
    delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
    returned: { label: 'Returned', color: 'bg-orange-100 text-orange-700' }
};

export default function InvoicesCard({ invoices }) {
    if (!invoices || invoices.length === 0) {
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
                    <Badge variant="secondary" className="ml-auto">{invoices.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {invoices.map(invoice => {
                        const status = statusConfig[invoice.status] || statusConfig.generated;
                        return (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{invoice.invoice_number}</p>
                                        <p className="text-sm text-slate-500">
                                            {invoice.created_date && format(new Date(invoice.created_date), 'MMM d, yyyy')} • ${invoice.total?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={`${status.color} border-0`}>{status.label}</Badge>
                                    <Link to={''}>
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            View <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}