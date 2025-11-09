import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanEditorState } from "../SubscriptionPlanEditor";
import { useEffect, useState } from "react";
import { TopupPlanService } from "@/services/TopupPlanService";
import CenterLoading from "@/components/common/CenterLoading";
import Btn from "@/components/common/Btn";
import { LuPlus } from "react-icons/lu";



export const TopUps = ({ state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) => {

    const [loading, setLoading] = useState(state.topup_plans.length == 0);
    const [topupPlans, setTopupPlans] = useState<any[]>(state.topup_plans);


    const load = async () => {
        setLoading(true);
        var r = await TopupPlanService.all();
        if (r.success) {
            setTopupPlans(r.data);
            setValue('topup_plans')(r.data);
        }
        setLoading(false);
    }

    const handleQuantityChange = (topup_plan_id: number, change: number) => {
        var found = state.topup_plan_ids.find(t => t.id == topup_plan_id);

        var currentQuantity = found?.quantity ?? 0;
        const newQuantity = Math.max(0, currentQuantity + change);

        if (found) {
            if (!newQuantity) {
                setValue('topup_plan_ids')(state.topup_plan_ids.filter(t => t.id !== topup_plan_id));
            } else {

                setValue('topup_plan_ids')(state.topup_plan_ids.map(t => (t.id == topup_plan_id ? {
                    ...t,
                    quantity: newQuantity
                } : t)))
            }

        } else {
            setValue('topup_plan_ids')([...state.topup_plan_ids, {
                id: topup_plan_id,
                quantity: newQuantity
            }]);
        }
    };


    useEffect(() => {
        if (state.topup_plans.length == 0) {
            load();
        }
    }, [])

    return (
        <div className="w-full">

            {loading && <CenterLoading className="relative h-[400px]" />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-3">
                {topupPlans.map((topUp, index) => {
                    var found = state.topup_plan_ids.find(t => t.id == topUp.id);
                    var quantity = 0;
                    if (found) {
                        quantity = found.quantity;
                    }

                    return (
                        <Card
                            key={topUp.id}
                            className={`p-2 transition-all hover:shadow-card-hover animate-scale-in relative ${quantity > 0 ? "ring-2 ring-secondary" : ""}`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {!!topUp.popular && (
                                <Badge className="absolute -top-2 right-0" >Popular</Badge>
                            )}

                            <div className="flex-col items-center gap-3 mb-4">
                                <h4 className="font-semibold text-sm">{topUp.name}</h4>
                                <p className="text-xs text-muted-foreground">{topUp.description}</p>
                            </div>

                            <div className="text-2xl font-bold mb-4">₹{topUp.price}</div>
                            {!quantity && <Btn onClick={() => handleQuantityChange(topUp.id, 1)} size={'sm'} variant={'outline'}><LuPlus />Add to Package</Btn>}
                            {!!quantity && <div className="flex items-center gap-2 max-w-[150px] bg-sky-50 p-1 border-sky-300 border rounded-lg">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(topUp.id, -1)}
                                    disabled={quantity === 0}
                                    className="h-8 w-8"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>

                                <div className="flex-1 text-center font-semibold">
                                    {quantity}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(topUp.id, 1)}
                                    className="h-8 w-8"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>}

                            {quantity > 0 && (
                                <div className="mt-3 pt-3 border-t">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-semibold">₹{topUp.price * quantity}</span>
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
