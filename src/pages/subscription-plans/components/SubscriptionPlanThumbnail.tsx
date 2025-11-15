
import { Badge } from "@/components/ui/badge";
import { LuCheck, LuPencil, LuSparkles } from "react-icons/lu";
import { formatDays } from "@/lib/utils";
import { useState } from "react";
import Btn from "@/components/common/Btn";
import { useNavigate } from "react-router-dom";
import { calculateDiscount } from "@/data/Common";
import Dropdown from "@/components/common/Dropdown";


export const SubscriptionPlanThumbnail = ({ record, index }: { record: any, index: number }) => {
    const navigate = useNavigate();
    const versions = [record, ...(record.versions || [])];
    const [plan, setPlan] = useState<any>(record.versions.find((v: any) => !!v.active) ?? record);
    const calculatedPricing = calculateDiscount(plan.pricing);
    const [activePriceIndex, setActivePriceIndex] = useState(0);

    const activePrice = calculatedPricing[activePriceIndex] ?? calculatedPricing[0];
    return (
        <div
            key={plan.id}
            className={` bg-white rounded-lg border shadow-lg relative px-3 py-6 transition-all hover:shadow-card-hover cursor-pointer animate-scale-in  ${plan.popular ? "border-primary" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="grid grid-cols-2 gap-3 bg-sky-50 p-1 rounded-lg border-sky-400 border">
                <Dropdown
                    searchable={false}
                    placeholder="Select version"
                    value={plan.id}
                    onChange={_ => { }}
                    onSelect={d => setPlan(d.data)}
                    getOptions={async () => {
                        return versions.map(v => ({
                            id: v.id,
                            name: `v${v.version}`,
                            data: v
                        }));
                    }}>Version</Dropdown>
                <Dropdown
                    searchable={false}
                    placeholder="Select price"
                    value={activePriceIndex}
                    onChange={setActivePriceIndex}
                    getOptions={async () => {
                        return calculatedPricing.map((p, pi) => ({
                            id: pi,
                            name: `₹${p.price} / ${formatDays(p.duration_days)}`
                        }));
                    }}
                >Price</Dropdown>

            </div>



            <div className="px-8 mt-3">
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
            </div>
        </div>
    );
};
