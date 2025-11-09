import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


import { PricingSummary } from "./PricingSummary";
import { TopUps } from "./Topups";
import { useEffect, useState } from "react";
import { SubscriptionModuleService } from "@/services/SubscriptionModuleService";
import CenterLoading from "@/components/common/CenterLoading";
import { SubscriptionPlanEditorState } from "../SubscriptionPlanEditor";




export const CustomSubscriptionPlanBuilder = ({ state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) => {

    const [loading, setLoading] = useState(state.modules.length == 0);
    const [modules, setModules] = useState<any[]>(state.modules);


    const load = async () => {
        setLoading(true);
        var r = await SubscriptionModuleService.all();
        if (r.success) {
            setModules(r.data);
            setValue('modules')(r.data);
        }
        setLoading(false);
    }

    const handleModuleToggle = (subscription_module_id: number) => {
        if (state.subscription_module_ids.includes(subscription_module_id)) {
            setValue('subscription_module_ids')(state.subscription_module_ids.filter(i => i !== subscription_module_id));
        } else {
            setValue('subscription_module_ids')([...state.subscription_module_ids, subscription_module_id]);
        }
    };

    const handleFeatureToggle = (subscription_feature_id: number) => {
        if (state.subscription_feature_ids.includes(subscription_feature_id)) {
            setValue('subscription_feature_ids')(state.subscription_feature_ids.filter(i => i !== subscription_feature_id));
        } else {
            setValue('subscription_feature_ids')([...state.subscription_feature_ids, subscription_feature_id]);
        }
    };

    useEffect(() => {
        if (state.modules.length == 0) {
            load();
        }
    }, []);

    return (
        <div className="space-y-6">
            <Card className="p-6 bg-sky-50 border-sky-400">
                <h3 className="text-lg font-semibold mb-2">Build Your Custom Plan</h3>
                <p className="text-sm text-muted-foreground">
                    Select modules and their features to create a plan tailored to your needs.
                    Note: Custom plans are not eligible for discounts.
                </p>
            </Card>


            <div className="flex flex-row gap-3 items-start">
                <Tabs defaultValue="modules" className="flex-1">
                    <TabsList>
                        <TabsTrigger value="modules">Modules & Features</TabsTrigger>
                        <TabsTrigger value="top-ups">Top Ups & VAS</TabsTrigger>
                    </TabsList>
                    <TabsContent value="modules">
                        {loading && <CenterLoading className="relative h-[400px]" />}
                        {!loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                            {modules.map((module: any, index: number) => {
                                const isSelected = state.subscription_module_ids.includes(module.id);

                                return (
                                    <Card
                                        key={module.id}
                                        className={`p-2 transition-all hover:shadow-card-hover animate-scale-in ${isSelected ? "ring-2 ring-primary" : ""
                                            }`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <label
                                            htmlFor={module.id}
                                            className="flex items-start gap-2  font-semibold cursor-pointer"
                                        >
                                            <Checkbox
                                                id={module.id}
                                                checked={isSelected}
                                                onCheckedChange={() => handleModuleToggle(module.id)}
                                                className="mt-1"
                                            />
                                            <span> {module.name}</span>
                                        </label>

                                        {isSelected && (
                                            <div className="ml-9 space-y-2 pt-4 border-t animate-fade-in">
                                                <p className="text-sm font-medium mb-3">Select Features:</p>
                                                {module.features.map((feature: any) => (
                                                    <div key={feature.id} className="flex items-center gap-3">
                                                        <Checkbox
                                                            id={`${module.id}-${feature.id}`}
                                                            checked={state.subscription_feature_ids.includes(feature.id)}
                                                            onCheckedChange={() => handleFeatureToggle(feature.id)}
                                                        />
                                                        <label
                                                            htmlFor={`${module.id}-${feature.id}`}
                                                            className="text-sm flex-1 cursor-pointer"
                                                        >
                                                            {feature.name}
                                                        </label>
                                                        <span className="text-xs text-muted-foreground">
                                                            +₹{feature.price}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>}
                    </TabsContent>
                    <TabsContent value="top-ups">
                        <TopUps state={state} setValue={setValue} />
                    </TabsContent>
                </Tabs>

                <div className="w-[300px] border rounded-lg">
                    <PricingSummary
                        state={state}
                        setValue={setValue}
                    />
                </div>
            </div>
        </div>
    );
};
