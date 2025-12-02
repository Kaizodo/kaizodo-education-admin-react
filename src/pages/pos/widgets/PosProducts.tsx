import { FaMagnifyingGlass } from "react-icons/fa6";
import noProducts from '@/assets/icons/no-products.png';
import noRecords from '@/assets/icons/no-records.png';
import { Badge } from "@/components/ui/badge";
import { FaTimes } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from "react";
import { PosContext } from "../PosHome";
import { EcommerceProductType } from "@/types/Product";
import { getDefaultPaginated, PaginationType } from "@/types/PaginationType";
import { useDebounce } from "@/hooks/use-debounce";
import { LuLoader } from "react-icons/lu";
import useOutsideClick from "@/hooks/use-outside-click";
import { BusinessProductService } from "@/services/BusinessProductService";
import { BusinessService } from "@/services/BusinessService";
import FallbackImage from "@/components/widgets/FallbackImage";
import FallbackNoImage from "@/components/widgets/FallbackNoImage";
import { KeyType } from "./PosNumpad";
import { cn } from "@/lib/Utils";


const SuggestedProduct = ({ product, onClick }: { product: EcommerceProductType, onClick: () => void }) => {
    return <div className="flex flex-row border-b py-2 px-2 hover:bg-red-50 cursor-pointer" onClick={onClick}>
        <FallbackImage src={product.image} fallback={<FallbackNoImage className="text-2xl border p-2 rounded-sm flex items-center justify-center w-[50px]" />} className="w-[50px] border p-2 rounded-sm" />
        <div className="flex-1 p-2">
            <div className="flex flex-row items-center gap-3">
                <span className="font-bold">{product.name}</span>
                <Badge>{product.item_category_name}</Badge>
            </div>
            <div className="flex flex-row items-center gap-3">
                <span className="text-muted-foreground text-sm">{product.item_unit_name}s x ₹{product.sale_price} / {product.item_unit_name}</span>
            </div>
        </div>
        <div className="p-3 items-center flex">
            <span className="text-lg font-bold">₹{product.sale_price}</span>
        </div>

    </div>
}

const SelectedProduct = ({ product }: { product: EcommerceProductType }) => {
    const { setPosContext } = useContext(PosContext);
    return <div
        onClick={() => {
            setPosContext(s => ({ ...s, section: 'product', numkey: KeyType.None, products: s.products.map(p => ({ ...p, selected: p.business_product_stock_id == product.business_product_stock_id ? true : false })) }))
        }}
        className={cn('flex flex-row border-b hover:bg-red-100', product?.selected ? 'bg-gradient-to-r from-primary to-transparent' : '')}
    >
        <div className="flex-1 p-2">
            <div className="flex flex-row items-center gap-3">
                <span className="font-bold">{product.name}</span>
                <Badge>{product.item_category_name}</Badge>
            </div>
            <div className="flex flex-row items-center gap-3">
                <span className="bg-sky-200 rounded-sm inline-block px-2 text-sm">{product.quantity || 1}</span>
                <span className="text-muted-foreground text-sm">{product.item_unit_name}s x ₹{product.sale_price} / {product.item_unit_name}</span>
            </div>
            <span className="text-sm">With 30% Discount</span>
        </div>
        <div className="p-3 items-center flex">
            <span className="text-lg font-bold">₹{Number(product.sale_price) * product.quantity}</span>
        </div>
        <div className="min-w-[50px] bg-primary text-primary-foreground items-center flex justify-center active:bg-red-300 " onClick={() => {
            setPosContext(s => ({ ...s, numkey: KeyType.None, products: s.products.filter(p => p.business_product_stock_id !== product.business_product_stock_id) }))
        }}>
            <FaTimes size={20} />
        </div>
    </div>
}

export default function PosProductsWidget() {

    const { posContext, setPosContext } = useContext(PosContext);
    const [searching, setSearching] = useState(false);
    const [paginated, setPaginated] = useState<PaginationType<EcommerceProductType>>(getDefaultPaginated());
    const [showSearchResults, setShowSearchResults] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (!inputRef.current) {
            return;
        }
        if (posContext.section == 'product_search') {
            if (posContext.numkey == KeyType.Clear) {
                inputRef.current.value = inputRef.current.value.substring(0, inputRef.current.value.length - 1);
                numUpdate();
            } else if (posContext.numkey == KeyType.ClearCurrent) {
                inputRef.current.value = '';
                numUpdate();

            } else if (posContext.numkey >= 0 && posContext.numkey <= 9) {
                inputRef.current.value = inputRef.current.value + posContext.numkey;
                numUpdate();
            } else if (posContext.numkey == KeyType.MultiZero) {
                inputRef.current.value = inputRef.current.value + '00';
                numUpdate();
            }
        } else if (posContext.section == 'product') {
            if (posContext.numkey == KeyType.ClearCurrent) {
                setPosContext(s => ({ ...s, numkey: KeyType.None, products: s.products.filter(p => !p.selected) }));
            } if (posContext.numkey == KeyType.Clear) {
                setPosContext(s => ({ ...s, numkey: KeyType.None, products: s.products.map(p => (p?.selected ? { ...p, quantity: Number(`${p.quantity}`.slice(0, -1)) < 1 ? 1 : Number(`${p.quantity}`.slice(0, -1)) } : p)) }));
            } else if (posContext.numkey >= 0 && posContext.numkey <= 9) {
                setPosContext(s => ({ ...s, numkey: KeyType.None, products: s.products.map(p => (p?.selected ? { ...p, quantity: p.quantity == 1 && posContext.numkey !== 1 ? posContext.numkey : Number(`${p.quantity}${posContext.numkey}`) } : p)) }));
            } else if (posContext.numkey == KeyType.MultiZero) {
                setPosContext(s => ({ ...s, numkey: KeyType.None, products: s.products.map(p => (p?.selected ? { ...p, quantity: Number(`${p.quantity}00`) } : p)) }));
            }
        }
    }, [posContext.numkey])

    const ref = useOutsideClick(() => debounceSetShowResults(false));

    const numUpdate = () => {
        if (!inputRef.current) {
            return;
        }
        debounce(inputRef.current.value);
        debounceSetShowResults(true);
        setPosContext(s => ({ ...s, numkey: KeyType.None }));
    }

    const debounceSetShowResults = useDebounce((b: boolean) => {
        setShowSearchResults(b);
    }, 100);

    const debounce = useDebounce((keyword: string) => {
        search(keyword);
    }, 100);

    const search = async (keyword: string) => {
        setSearching(true);
        var r = await BusinessProductService.search({
            business_id: BusinessService.business_id,
            filter_out_of_stock: true,
            page: 1,
            keyword
        });
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }


    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="w-full" ref={ref}>
                <div className="relative w-full p-2 border-b">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Product Name, Code, Barcode"
                        className="w-full pl-3 pr-10 py-3 rounded-0 border border-gray-300 shadow-inner outline-none text-lg bg-gray-50"
                        onChange={(e) => {
                            if (posContext.section !== 'product_search') {
                                setPosContext(s => ({ ...s, section: 'product_search', numkey: KeyType.None }));
                            }
                            setShowSearchResults(true);
                            setSearching(true);
                            debounce(e.target.value);
                        }}
                    />
                    <FaMagnifyingGlass className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-300 cursor-pointer" size={20} />
                </div>
                {showSearchResults && searching && (
                    <div className="p-2 flex-1">
                        <div className="h-[300px] shadow-inner bg-gray-50 border flex flex-col items-center justify-center">
                            <LuLoader className="animate-spin" size={20} />
                        </div>
                    </div>
                )}
                {showSearchResults && paginated.records.length == 0 && !searching && (
                    <div className="p-2 flex-1">
                        <div className="h-[300px] shadow-inner bg-gray-50 border flex flex-col items-center justify-center">
                            <img src={noProducts} className="h-[100px]" />
                            <span className="text-muted-foreground">No Products Found</span>
                        </div>
                    </div>
                )}
                {showSearchResults && paginated.records.length > 0 && !searching && (
                    <div className="p-2 flex-1">
                        <div className="h-[300px] shadow-inner bg-gray-50 border flex flex-col overflow-auto">
                            {paginated.records.map(product => (
                                <SuggestedProduct
                                    product={product}
                                    key={'sp_' + product.id}
                                    onClick={() => {
                                        if (inputRef.current) {
                                            inputRef.current.value = '';
                                        }

                                        setShowSearchResults(false);
                                        setPosContext(s => ({ ...s, products: s.products.filter(p => p.business_product_stock_id !== product.business_product_stock_id).concat([{ ...product, quantity: 1 }]) }))
                                    }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {posContext.products.length === 0 && (
                <div className="flex-1 flex flex-col gap-3 items-center justify-center">
                    <img src={noRecords} className="h-[100px]" />
                    <span className="text-2xl font-bold text-muted-foreground">Empty List</span>
                    <span className="text-muted-foreground">Your list is empty, add some products</span>
                </div>
            )}
            {posContext.products.length > 0 && <div className="overflow-auto  flex-1 min-h-0">
                {posContext.products.map(product => (
                    <SelectedProduct product={product} key={'sp_' + product.id} />
                ))}
            </div>}
        </div>

    )
}
