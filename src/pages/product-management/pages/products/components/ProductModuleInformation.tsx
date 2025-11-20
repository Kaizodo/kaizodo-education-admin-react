import { useState } from "react";
import Btn from "@/components/common/Btn";

import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";

import { Checkbox } from "@/components/ui/checkbox";
import NoRecords from "@/components/common/NoRecords";
import { RiSoundModuleFill } from "react-icons/ri";
import { LuSave } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { CommonProductStateProps } from '@/data/Product';



export default function ProductModuleInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        const r = await ProductService.saveModuleInformation({
            product_id: state.product.id,
            module_feature_ids: state.product_module_features.map(pmf => pmf.module_feature_id)
        });
        if (r.success) {
            msg.success('Details saved!');

        }
        setSaving(false);
    }
    return <div>
        {state.modules.length == 0 && <NoRecords
            icon={RiSoundModuleFill}
            title="No Modules Avaiable"
            subtitle="Try  creating some feature modules"

        />}

        <div className="grid grid-cols-2 gap-3">
            {state.modules.map((m, mi) => {
                var module_selected = !!state.product_module_features.find(pmf => pmf.module_id == m.id);
                var features = state.module_features.filter(mf => mf.module_id == m.id);
                return <div
                    key={m.id}
                    className={cn(
                        `rounded-lg bg-white border p-2 transition-all hover:shadow-card-hover animate-scale-in `,
                        module_selected && "ring-2 ring-sky-400 bg-sky-50",
                        !state.module_features.find(mf => mf.module_id == m.id) && "bg-gray-50 cursor-not-allowed"
                    )}
                    style={{ animationDelay: `${mi * 0.05}s` }}
                >
                    <label
                        className={cn(
                            "flex items-start gap-2 text-sm  font-semibold cursor-pointer",
                            !state.module_features.find(mf => mf.module_id == m.id) && "cursor-not-allowed"
                        )}
                    >
                        <Checkbox
                            disabled={!state.module_features.find(mf => mf.module_id == m.id)}
                            checked={module_selected}
                            onCheckedChange={(checked) => setStateValue('product_module_features')(
                                checked ? [...state.product_module_features, ...features.map(mf => ({
                                    module_id: mf.module_id,
                                    module_feature_id: mf.id
                                }))] : state.product_module_features.filter(mx => mx.module_id !== m.id),

                            )}
                            className="mt-1"
                        />
                        <span> {m.name}</span>
                    </label>
                    {features.length == 0 && <span className="italic text-gray-500 text-xs flex justify-center my-3">No features avaiable</span>}
                    {features.length > 0 && <div className="flex flex-col gap-2 ps-3 mt-3">
                        {features.map(record => {
                            var selected = !!state.product_module_features.find(mf => mf.module_feature_id == record.id);
                            return <label key={record.id} className="text-xs items-center flex gap-1">
                                <Checkbox checked={selected} onCheckedChange={(checked) => setStateValue(`product_module_features`)(
                                    checked ? [...state.product_module_features, {
                                        module_id: m.id,
                                        module_feature_id: record.id
                                    }] : state.product_module_features.filter(mf => mf.module_feature_id !== record.id),

                                )} />
                                <span>{record.name}</span>
                            </label>
                        })}
                    </div>}

                </div>
            })}
        </div>
        {state.module_features.length > 0 && <div className="mt-3 flex justify-end">
            <Btn loading={saving} onClick={save}><LuSave />Save Modules</Btn>
        </div>}
    </div>
}
