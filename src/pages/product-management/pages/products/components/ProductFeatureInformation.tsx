import { useForm } from '@/hooks/use-form';
import TextField from '@/components/common/TextField';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import Btn from '@/components/common/Btn';
import { LuSave } from 'react-icons/lu';
import { useState } from 'react';
import { ProductService } from '@/services/ProductService';
import { msg } from '@/lib/msg';
import Richtext from '@/components/common/Richtext';
import { CommonProductStateProps, FeatureGroup } from '@/data/Product';
export default function ProductFeatureInformation({ state }: CommonProductStateProps) {
    const [form, setValue] = useForm<{
        product_id: number,
        product_features: {
            feature_id: number,
            feature_value: any
        }[]
    }>({
        product_id: state.product.id,
        product_features: state.product_features
    });

    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        var r = await ProductService.saveProductFeaturesInformation(form);
        if (r.success) {
            msg.success('Features saved!');
        }
        setSaving(false);
    }

    return (
        <div className='space-y-6'>
            {state.feature_groups.map((group: FeatureGroup) => {
                var features = state.features.filter(f => f.feature_group_id == group.id);

                return <div key={group.id}>
                    <div>
                        <span className="font-medium text-lg">{group.name}</span>
                        <span className="text-xs text-gray-500">{group.description}</span>
                    </div>
                    <div className="space-y-3">
                        {features.map(feature => {
                            var found = form.product_features.find(pf => pf.feature_id == feature.id);
                            return <div key={group.id + '_' + feature.id}>
                                {feature.input_type === 'text' && <TextField
                                    value={found?.feature_value}
                                    onChange={setValue(`product_features[feature_id:${feature.id}].feature_value`)}
                                    placeholder={"Enter " + feature.name}
                                >{feature.name}</TextField>}
                                {feature.input_type === 'number' && <TextField
                                    type="number"
                                    placeholder={"Enter " + feature.name}
                                    value={found?.feature_value}
                                    onChange={setValue(`product_features[feature_id:${feature.id}].feature_value`)}
                                >{feature.name}</TextField>}
                                {feature.input_type === 'boolean' && <Radio
                                    value={found?.feature_value}
                                    onChange={setValue(`product_features[feature_id:${feature.id}].feature_value`)}
                                    options={YesNoArray}
                                >{feature.name}</Radio>}
                                {feature.input_type === 'richtext' && <Richtext
                                    value={found?.feature_value}
                                    onChange={setValue(`product_features[feature_id:${feature.id}].feature_value`)}
                                    placeholder={"Enter " + feature.name}
                                >{feature.name}</Richtext>}
                            </div>
                        })}
                    </div>

                </div>
            })}
            <div className='p-3 flex flex-row justify-end'>
                <Btn onClick={save} loading={saving}><LuSave />Save Features</Btn>
            </div>
        </div>
    )
}
