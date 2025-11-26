import DateTimeField from '@/components/common/DateTimeField'
import Radio from '@/components/common/Radio'
import TextField from '@/components/common/TextField'
import { ShipmentPackageType, ShipmentPackageTypeArray } from '@/data/order'

export default function CreateShipmentStep3({ form, setValue }) {

    return (<div className="space-y-8">
        <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Packing</h2>
            <p className="text-gray-500 text-sm">Enter dimensions and weights for selected items.</p>
        </div>

        <Radio value={form.package_type || ShipmentPackageType.Individual} onChange={(v) => {
            if (v == ShipmentPackageType.Consolidated) {
                var selected_items = form.items.filter(i => i.selected_quantity > 0);
                var package_weight = selected_items.reduce((pv, cv) => pv += Number(cv.package_weight), 0);
                var package_height = selected_items.reduce((pv, cv) => pv += Number(cv.package_height), 0);
                var package_width = selected_items.reduce((pv, cv) => pv += Number(cv.package_width), 0);
                var package_length = selected_items.reduce((pv, cv) => pv += Number(cv.package_length), 0);
                setValue('package_type', 'package_weight', "package_height", "package_width", "package_length")(v, package_weight, package_height, package_width, package_length);
            } else {
                setValue('package_type')(v);

            }
        }} options={ShipmentPackageTypeArray}>
            Packaging Type
        </Radio>
        {form.package_type == ShipmentPackageType.Individual && <div className="space-y-4">
            {form.items.filter(i => i.selected_quantity > 0).map((item, idx) => (
                <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                        <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-auto">Qty: {item.selected_quantity}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TextField
                            type="number"
                            value={item.package_weight}
                            onChange={setValue(`items[id:${item.id}].package_weight`)}
                            placeholder="0.0"
                        >
                            Weight (kg)
                        </TextField>

                        <TextField
                            type="number"
                            value={item.package_length}
                            onChange={setValue(`items[id:${item.id}].package_length`)}

                            placeholder="0.0"
                        >
                            Length (cm)
                        </TextField>

                        <TextField
                            type="number"
                            value={item.package_width}
                            onChange={setValue(`items[id:${item.id}].package_width`)}
                            placeholder="0.0"
                        >
                            Width (cm)
                        </TextField>

                        <TextField
                            type="number"
                            value={item.package_height}
                            onChange={setValue(`items[id:${item.id}].package_height`)}
                            placeholder="0.0"
                        >
                            Height (cm)
                        </TextField>
                    </div>
                </div>
            ))}
        </div>}

        {form.package_type == ShipmentPackageType.Consolidated && <div className=' bg-white rounded-lg border shadow'>
            <div className='flex flex-col border-b  p-3'>
                <span className='text-2xl font-medium'>Consolidated Package</span>
                <span className='text-xs text-gray-500'>Deliver goods in single package</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3">
                <TextField
                    type="number"
                    value={form.package_weight}
                    onChange={setValue(`package_weight`)}
                    placeholder="0.0"
                >
                    Weight (kg)
                </TextField>

                <TextField
                    type="number"
                    value={form.package_length}
                    onChange={setValue(`package_length`)}

                    placeholder="0.0"
                >
                    Length (cm)
                </TextField>

                <TextField
                    type="number"
                    value={form.package_width}
                    onChange={setValue(`package_width`)}
                    placeholder="0.0"
                >
                    Width (cm)
                </TextField>

                <TextField
                    type="number"
                    value={form.package_height}
                    onChange={setValue(`package_height`)}
                    placeholder="0.0"
                >
                    Height (cm)
                </TextField>
            </div>
        </div>}

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">Shipment Info</h3>

            <TextField
                placeholder="TRK-000000000"
                value={form.tracking_number}
                onChange={setValue('tracking_number')}
            >
                Tracking Number (Optional)
            </TextField>

            <div className="grid grid-cols-2 gap-3">
                <DateTimeField
                    mode="datetime"
                    placeholder="Select date"
                    value={form.pickup_datetime}
                    onChange={setValue('pickup_datetime')}
                    previewFormat='DD MMM, Y LT'

                >
                    Pickup Date
                </DateTimeField>

                <DateTimeField
                    mode="datetime"
                    placeholder="Select date"
                    value={form.dispatch_datetime}
                    onChange={setValue('dispatch_datetime')}
                    previewFormat='DD MMM, Y LT'
                >
                    Dispatch Date
                </DateTimeField>
            </div>

            <TextField
                multiline
                rows={4}
                placeholder="Any special handling instructions..."
                value={form.notes}
                onChange={setValue('notes')}
            >
                Notes / Remarks
            </TextField>
        </div>
    </div>)
}
