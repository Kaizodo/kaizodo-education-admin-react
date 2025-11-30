import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OrderDetailState } from "@/data/UserOrder";
import { User, MapPin, Phone, Mail } from "lucide-react";

export default function PartyInformationCard({ state }: { state: OrderDetailState }) {

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    Billing Address
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-slate-400 mt-0.5  shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Name</p>
                                <p className="font-medium text-slate-900">{state.buyer_party.name}</p>
                            </div>
                        </div>
                        {state.buyer_party.email && (
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-slate-400 mt-0.5  shrink-0" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                                    <p className="font-medium text-slate-900">{state.buyer_party.email}</p>
                                </div>
                            </div>
                        )}
                        {state.buyer_party.mobile && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-slate-400 mt-0.5  shrink-0" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                                    <p className="font-medium text-slate-900">{state.buyer_party.mobile}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5  shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Delivery Address</p>
                                <p className="font-medium text-slate-900 leading-relaxed">{state.buyer_party.address}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}