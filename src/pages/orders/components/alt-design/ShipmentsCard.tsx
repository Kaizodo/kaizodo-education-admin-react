import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { OrderDetailState } from '@/data/UserOrder';
import { formatDateTime } from "@/lib/utils";
import { LuChevronRight } from "react-icons/lu";
import NoRecords from "@/components/common/NoRecords";
import { FaShippingFast } from "react-icons/fa";

export default function ShipmentsCard({ state }: { state: OrderDetailState }) {
    return (<Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Shipments</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
            {state.shipments.length == 0 && <NoRecords icon={FaShippingFast} title='No Shipments Yet' subtitle='Create new shipments and manage product delivery' />}
            {state.shipments.map(shipment => {
                return (<Link
                    key={shipment.id}
                    to={`/shipments/${shipment.internal_reference_number}`}
                    className="flex items-center justify-between p-3 mb-2 border rounded-xl hover:shadow-md transition w-full"
                >
                    <div className="flex flex-col gap-1 w-full">

                        <div className="flex flex-wrap gap-1">
                            {shipment.items.map(i => (
                                <Badge key={i.id} className="text-xs px-2 py-0.5">
                                    {i.name}
                                </Badge>
                            ))}
                        </div>

                        <span className="font-semibold text-sm">
                            {shipment.internal_reference_number}
                        </span>

                        <span className="text-xs text-gray-500">
                            Last Update: {formatDateTime(shipment.updated_at ?? shipment.created_at)}
                        </span>
                    </div>

                    <LuChevronRight className="text-gray-400" />
                </Link>);
            })}
        </CardContent>
    </Card>)
}
