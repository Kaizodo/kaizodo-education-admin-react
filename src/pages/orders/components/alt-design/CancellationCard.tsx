
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, RotateCcw, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const typeConfig = {
    cancellation: { label: 'Cancellation', icon: XCircle, color: 'bg-red-100 text-red-700' },
    return: { label: 'Return', icon: RotateCcw, color: 'bg-orange-100 text-orange-700' },
    replacement: { label: 'Replacement', icon: RefreshCw, color: 'bg-blue-100 text-blue-700' }
};

const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700'
};

export default function CancellationsCard({ cancellations }) {
    if (!cancellations || cancellations.length === 0) {
        return null;
    }

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    Cancellations / Returns / Replacements
                    <Badge variant="secondary" className="ml-auto">{cancellations.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {cancellations.map(item => {
                        const typeInfo = typeConfig[item.type] || typeConfig.cancellation;
                        const TypeIcon = typeInfo.icon;
                        return (
                            <div
                                key={item.id}
                                className="p-4 bg-slate-50 rounded-xl"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${typeInfo.color.split(' ')[0]} flex items-center justify-center`}>
                                            <TypeIcon className={`w-4 h-4 ${typeInfo.color.split(' ')[1]}`} />
                                        </div>
                                        <div>
                                            <Badge className={`${typeInfo.color} border-0`}>{typeInfo.label}</Badge>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {item.created_date && format(new Date(item.created_date), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${statusColors[item.status]} border-0`}>
                                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                                        </Badge>
                                        <span className="font-semibold text-slate-900">${item.total_value?.toFixed(2)}</span>
                                    </div>
                                </div>
                                {item.items && item.items.length > 0 && (
                                    <div className="pl-11 space-y-1">
                                        {item.items.map((product, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-slate-600">{product.product_name}</span>
                                                <span className="text-slate-500">x{product.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {item.reason && (
                                    <p className="pl-11 text-sm text-slate-500 mt-2 italic">"{item.reason}"</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}