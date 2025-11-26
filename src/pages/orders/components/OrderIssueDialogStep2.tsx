import { OrderIssueDialogProps } from "./OrderIssueDialog";
import { Minus, Plus } from "lucide-react";




export default function OrderIssueDialogStep2({ form, setValue }: OrderIssueDialogProps) {




    return (
        <>

            <h3 className="text-md font-semibold text-gray-800 mb-3">Items</h3>
            <div className="grid grid-cols-1 gap-4">
                {form.items.map((item) => {
                    const qty = Number(item?.selected_quantity || item.quantity_unlocked);

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
                                    onClick={() => setValue(`items[id:${item.id}].selected_quantity`)(qty - 1)}
                                    disabled={qty === 0}
                                    className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600"
                                >
                                    <Minus size={16} />
                                </button>
                                <input type="number" value={qty} className="font-bold w-8 text-center text-gray-900" onChange={(e) => setValue(`items[id:${item.id}].selected_quantity`)(qty + 1)} />
                                <span className="font-bold w-8 text-center text-gray-900">{qty}</span>
                                <button
                                    onClick={() => setValue(`items[id:${item.id}].selected_quantity`)(qty + 1)}
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


        </>
    );
};