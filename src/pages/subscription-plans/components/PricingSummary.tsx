import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubscriptionPlanEditorState } from "../SubscriptionPlanEditor";



export const PricingSummary = ({ state }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) => {

    const calculateTotal = () => {
        let subtotal = 0;
        let discount = 0;

        state.subscription_module_ids.forEach((subscription_module_id) => {
            const module = state.modules.find(m => m.id === subscription_module_id);
            if (module) {
                const features = module.features.filter((f: any) => state.subscription_feature_ids.includes(f.id));
                features.forEach((feature: any) => {
                    subtotal += Number(feature.price);
                });
            }
        });

        state.topup_plan_ids.forEach(topup_plan_id => {
            var found = state.topup_plans.find(t => t.id == topup_plan_id.id);
            if (found) {
                subtotal += found.price * topup_plan_id.quantity;
            }
        });



        return { subtotal, discount, total: subtotal - discount };
    };

    const { total } = calculateTotal();


    return (
        <Card className="border-none flex flex-col max-h-[500px]">
            <div className="px-6 py-2 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Modules & Features:</h2>
            </div>
            <ScrollArea className="flex-1 px-6 pb-4 overflow-y-auto">
                <div className="space-y-3 text-sm pr-4">


                    <div className="space-y-2">
                        {state.subscription_module_ids.map((subscription_module_id) => {

                            const module = state.modules.find(m => m.id === subscription_module_id)!;
                            if (!module) return null;
                            return (
                                <div key={subscription_module_id} className="pl-6 border-l-2 border-primary/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Check className="h-3 w-3 text-primary shrink-0" />
                                        <span className="font-medium">{module.name}</span>
                                    </div>
                                    {module.features.length > 0 && (
                                        <div className=" text-xs text-muted-foreground space-y-0.5">
                                            {module.features.map((feature: any) => (
                                                <div key={feature.id} className="flex flex-row items-center justify-between">
                                                    <span>• {feature.name}</span>
                                                    <span className="text-primary">₹{feature.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {state.topup_plan_ids.length > 0 && (
                        <div>
                            <div className="font-medium mb-2">Top-Ups:</div>
                            <div className="pl-6 space-y-1 border-l-2 border-secondary/20">
                                {state.topup_plan_ids.map((topup_plan_id) => {
                                    var found = state.topup_plans.find(t => t.id == topup_plan_id.id);
                                    if (!found) {
                                        return null;
                                    }

                                    return (
                                        <div key={topup_plan_id.id} className="flex items-center gap-2">
                                            <Check className="h-3 w-3 text-secondary shrink-0" />
                                            <span>
                                                {found.name} × {topup_plan_id.quantity}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <Separator className="flex-shrink-0" />

            {/* Pricing Footer */}
            <div className="p-6 flex-shrink-0 bg-muted/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right">
                            <div className="text-3xl font-bold">
                                ₹{total}
                                <span className="text-base text-muted-foreground font-normal">/month</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Card>
    );
};
