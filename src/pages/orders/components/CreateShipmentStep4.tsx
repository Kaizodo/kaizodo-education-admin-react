
export default function CreateShipmentStep4({ form, setValue }) {
    return (<div className="space-y-8">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
            <p className="text-gray-500">Please review all details before confirming.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            { }
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 p-1">
                        <img src={form?.organization?.logo_short} alt="logo" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Organization</p>
                        <p className="font-bold text-gray-900">{form?.organization?.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Value</p>
                    <p className="font-bold text-2xl text-indigo-600">{form.currency_symbol}{form?.items.filter(i => (i?.selected_quantity || 0) > 0).reduce((pv, cv) => (pv + (Number(cv.sp) * Number(cv.selected_quantity))), 0)}</p>
                </div>
            </div>

            { }
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Item</th>
                            <th className="px-6 py-3 font-medium text-center">Qty</th>
                            <th className="px-6 py-3 font-medium text-center">Dimensions (cm)</th>
                            <th className="px-6 py-3 font-medium text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {form.items.filter(i => !!i.selected_quantity).map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} className="w-8 h-8 rounded object-cover bg-gray-200" alt="" />
                                        <div>
                                            {item.name}
                                            <div className="text-xs text-gray-400 font-normal">
                                                {item.package_weight ? `${item.package_weight}kg` : 'No weight info'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-indigo-50 text-indigo-700 py-1 px-2 rounded font-medium">{item.selected_quantity}</span>
                                </td>
                                <td className="px-6 py-4 text-center text-gray-500">
                                    {(item.package_length && item.package_width && item.package_height)
                                        ? `${item.package_length} × ${item.package_width} × ${item.package_height}`
                                        : <span className="text-gray-300 italic">Not set</span>}
                                </td>
                                <td className="px-6 py-4 text-right font-medium">
                                    {item.currency_symbol}{item.total_amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t border-gray-200 bg-gray-50/50">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pickup:</span>
                            <span className="font-medium">{form.pickup_date || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Dispatch:</span>
                            <span className="font-medium">{form.dispatch_date || 'Not specified'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Additional Info</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tracking:</span>
                            <span className="font-medium">{form.tracking_number || 'N/A'}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200 italic">
                            "{form.notes || 'No remarks provided'}"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
