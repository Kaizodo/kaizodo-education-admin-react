import { useState, useMemo } from 'react';
import {
    ShoppingCart,
    X,
    Plus,
    Minus,
    Trash2,
    ChevronUp,
    FileText,
    Package
} from 'lucide-react';
import { useGlobalContext } from '@/hooks/use-global-context';
import Btn from '@/components/common/Btn';
import SuggestVendor from '@/components/common/suggest/SuggestVendor';
import { useForm } from '@/hooks/use-form';
import { PosService } from '@/services/PosService';

export type Product = {
    id: number;
    name: string;
    image: string;
    quantity: number;
    product_category_name: string;
    sku: string;
    mrp: number;
    sp: number;
    cp: number;
    currency_symbol: string;
};

interface FloatingListProps {
    organization_id: number,
    products: Product[];
    onUpdate: (products: Product[]) => void;
    onSuccess: () => void
}

export default function FloatingItemsForPurchase({ products, onUpdate, organization_id, onSuccess }: FloatingListProps) {
    const { context } = useGlobalContext();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setValue] = useForm<any>({});

    const totalItems = useMemo(() => products.reduce((a, c) => a + c.quantity, 0), [products]);
    const totalCost = useMemo(() => products.reduce((a, c) => a + (c.sp * c.quantity), 0), [products]);

    const updateQuantity = (id: number, change: number) => {
        const updated = products
            .map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(0, item.quantity + change) }
                    : item
            )
            .filter((i) => i.quantity > 0);

        onUpdate(updated);
    };

    const handleCreatePO = async () => {
        var r = await PosService.createPurchaseOrder({
            organization_id,
            organization_vendor_id: form.organization_vendor_id,
            products: products.map(p => ({
                product_price_id: p.id,
                quantity: p.quantity
            }))
        });

        if (r.success) {
            setIsOpen(false);
            onSuccess();
        }
        return r.success;
    };



    if (products.length === 0 && !isOpen) return null;




    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            <div
                className={`
          w-full sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute'}
        `}
            >
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Package size={20} className="text-blue-400" />
                        <h3 className="font-semibold text-lg">Current Order</h3>
                        <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {products.length}
                        </span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1.5">
                        <ChevronUp size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto bg-slate-50 p-2 space-y-2">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <ShoppingCart size={48} className="mb-2" />
                            <p>Your list is empty</p>
                        </div>
                    ) : (
                        products.map((item) => (
                            <div key={item.id} className="bg-white p-3 rounded-xl border shadow-sm flex gap-3">
                                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                                    <img
                                        src={item.image || "https://placehold.co/100"}
                                        onError={(e) => (e.currentTarget.src = "https://placehold.co/100?text=No+Img")}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">
                                            {item.product_category_name} • SKU: {item.sku}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-semibold">
                                            {context.settings.currency_symbol}{item.sp.toLocaleString()}
                                        </span>

                                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">

                                            {/* – BUTTON (bigger) */}
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-700"
                                            >
                                                {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                            </button>

                                            {/* NUMBER INPUT (editable) */}
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    let v = parseInt(e.target.value || "0", 10);
                                                    if (v < 1 || isNaN(v)) v = 1;
                                                    const updated = products.map((p) =>
                                                        p.id === item.id ? { ...p, quantity: v } : p
                                                    );
                                                    onUpdate(updated);
                                                }}
                                                className="w-12 h-8 text-center text-sm font-semibold bg-white rounded-md shadow-sm border border-slate-200"
                                            />

                                            {/* + BUTTON (bigger) */}
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-700"
                                            >
                                                <Plus size={14} />
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {products.length > 0 && (
                    <div className="p-4 bg-white border-t">
                        <div className="flex justify-between text-sm mb-3">
                            <span>Total Quantity</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mb-4">
                            <span>Total Amount</span>
                            <span>
                                {context.settings.currency_symbol}{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className='mb-3'>
                            <SuggestVendor
                                organization_id={organization_id}
                                value={form.organization_vendor_id}
                                onChange={setValue('organization_vendor_id')}
                            >
                                Select Vendor
                            </SuggestVendor>
                        </div>
                        <Btn
                            disabled={products.length == 0 || !form.organization_vendor_id}
                            asyncClick={handleCreatePO}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
                        >
                            <FileText size={18} /> Create Purchase Order
                        </Btn>
                    </div>
                )}
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
    w-16 h-16 rounded-full flex items-center justify-center
    shadow-2xl transition-all relative overflow-visible
    ${isOpen ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'}
  `}
            >
                {isOpen ? <X size={28} /> : <ShoppingCart size={28} />}
                {totalItems > 0 && !isOpen && (
                    <span className="
      absolute -top-1 -right-1 
      h-5 min-w-5 px-1 flex items-center justify-center
      bg-red-600 text-white text-[10px]
      rounded-full border-2 border-white
    ">
                        {totalItems}
                    </span>
                )}
            </button>


        </div>
    );
};


