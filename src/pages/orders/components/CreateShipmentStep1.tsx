import { Minus, Package, Plus } from 'lucide-react';

export default function CreateShipmentStep1({ form, setValue }) {
    return (<div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Select Items</h2>
                <p className="text-gray-500 text-sm">Store: <span className="font-semibold text-indigo-600">{form?.organization?.name}</span></p>
            </div>
            <div className="mt-4 md:mt-0 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-500">Cart Total: </span>
                <span className="font-bold text-gray-900">{form.currency_symbol}{form?.items.filter(i => (i?.selected_quantity || 0) > 0).reduce((pv, cv) => (pv + (Number(cv.sp) * Number(cv.selected_quantity))), 0)}</span>
            </div>
        </div>

        {form.items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No items available for this organization.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {form.items.map((item) => {
                    const qty = item?.selected_quantity || 0;

                    return (
                        <div key={item.id} className={`flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl border transition-all ${qty > 0 ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-sm' : 'border-gray-200'}`}>
                            <img src={item.image} alt={item.name} className="w-full sm:w-20 sm:h-20 rounded-lg object-cover mb-4 sm:mb-0 bg-gray-100" />

                            <div className="flex-1 px-0 sm:px-4 w-full text-center sm:text-left">
                                <h3 className="font-bold text-gray-900">{item.name}</h3>
                                <div className="flex justify-center sm:justify-start items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span>{item.currency_symbol}{item.sp} / {item.unit_name}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className={`${item.quantity < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                                        {item.quantity} available
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                <button
                                    onClick={() => setValue(`items[id:${item.id}].selected_quantity`)((item?.selected_quantity || 0) - 1)}
                                    disabled={qty === 0}
                                    className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold w-8 text-center text-gray-900">{qty}</span>
                                <button
                                    onClick={() => setValue(`items[id:${item.id}].selected_quantity`)((item?.selected_quantity || 0) + 1)}
                                    disabled={qty >= item.quantity}
                                    className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-indigo-600"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>)
}
