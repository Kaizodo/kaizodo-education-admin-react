
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuCheck, LuCircle, LuCircleCheck, LuPencil, LuSparkles } from "react-icons/lu";
import { cn, formatDays } from "@/lib/utils";
import { useState } from "react";
import Btn from "@/components/common/Btn";
import { useNavigate } from "react-router-dom";
import { calculateDiscount } from "@/data/Common";


export const SubscriptionPlanThumbnail = ({ record, index }: { record: any, index: number }) => {
    const navigate = useNavigate();
    const versions = [record, ...(record.versions || [])];
    const [plan, setPlan] = useState<any>(record.versions.find((v: any) => !!v.active) ?? record);
    const calculatedPricing = calculateDiscount(plan.pricing);
    const activePrice = calculatedPricing.find(p => !!p.popular) ?? calculatedPricing?.[0];

    const [activePriceIndex, setActivePriceIndex] = useState(calculatedPricing.indexOf(activePrice));

    return (
        <Card
            key={plan.id}
            className={`relative p-8 transition-all hover:shadow-card-hover cursor-pointer animate-scale-in  ${plan.popular ? "border-primary" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="bg-sky-50 border-sky-400 border p-1 rounded-lg flex flex-col my-4">
                <span className="text-xs mb-1 font-medium">Versions</span>
                <div className="flex flex-row flex-wrap items-center gap-1">
                    {versions.map((version: any) => (
                        <Btn
                            className="rounded-full"
                            size={'xs'}
                            key={version.id}
                            variant={version.id === plan.id ? 'default' : 'outline'}
                            onClick={() => setPlan(version)}
                        >
                            v{version.version}
                            {version.id === plan.id ? <LuCircleCheck className="ml-1 h-3 w-3" /> : null}
                            {version.id !== plan.id ? <LuCircle className="ml-1 h-3 w-3" /> : null}
                        </Btn>
                    ))}
                </div>
            </div>


            <div className='flex flex-row  justify-center gap-2 flex-wrap'>
                {calculatedPricing.map((p, pi) => {
                    return (
                        <div
                            onClick={() => setActivePriceIndex(pi)}
                            key={p.id}
                            className={cn(
                                "border flex flex-col py-1 px-2 rounded-sm hover:bg-sky-50 hover:border-sky-300 cursor-pointer select-none",
                                pi == activePriceIndex && "bg-sky-50 border-sky-300"
                            )}>
                            <span className="text-gray-500 text-sm font-bold italic">{formatDays(p.duration_days)}</span>
                            {p.discount > 0 && <span className="text-green-600 font-medium text-xs">{p.discount}% off</span>}
                            {p.discount == 0 && <span className="text-green-600 font-medium text-xs">₹{p.price}</span>}
                        </div>
                    );
                })}
            </div>

            {!!plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary gap-1">
                    <LuSparkles className="h-3 w-3" />
                    Most Popular
                </Badge>
            )}

            {activePrice?.discount > 0 && (
                <Badge variant="secondary" className="absolute top-4 right-4 bg-secondary">
                    {activePrice.discount}% OFF
                </Badge>
            )}

            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
            </div>

            {activePrice && <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold">{`₹${activePrice?.price}`}</span>
                    <span className="text-muted-foreground">/ {formatDays(Number(activePrice?.duration_days ?? 0))}</span>
                </div>
            </div>}

            <ul className="space-y-3 mb-8">
                {record?.features?.map((feature: any) => (
                    <li key={feature.id} className="flex items-start gap-2">
                        <LuCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature.text}</span>
                    </li>
                ))}
            </ul>
            <Btn size={'sm'} className="rounded-full" onClick={() => navigate('/subscription-plans/update/' + plan.id)}>Edit Version v{plan.version} <LuPencil /></Btn>
        </Card>
    );
};
