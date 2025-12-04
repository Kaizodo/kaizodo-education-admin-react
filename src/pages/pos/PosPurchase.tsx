import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";
import Pagination from "@/components/common/Pagination";
import SafeImage from "@/components/common/SafeImage";
import { Search } from "@/components/ui/search";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useForm } from "@/hooks/use-form";
import { useGlobalContext } from "@/hooks/use-global-context";
import { PosService } from "@/services/PosService";
import { useEffect, useState } from "react";
import { LuArrowRight, LuPackage } from "react-icons/lu";
import { Link, useOutletContext } from "react-router-dom";
import FloatingItemsForPurchase from "./components/pos/FloatingItemsForPurchase";
import { Checkbox } from "@/components/ui/checkbox";
import Btn from "@/components/common/Btn";
import SuggestProductPrice from "@/components/common/suggest/SuggestProductPrice";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { formatDateTime } from "@/lib/utils";
import { msg } from "@/lib/msg";
export default function PosPurchase() {
    const { context } = useGlobalContext();
    const { loadStats, organization_id } = useOutletContext<{ organization_id: number, loadStats: (mainLoading: boolean) => void }>();
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginatedValue, setPaginated] = useForm<PaginationType<any>>(getDefaultPaginated());
    const [form, setValue] = useForm<any>({
        products: []
    });

    const [searchingPurchaseOrders, setSearchingPurchaseOrders] = useState(true);
    const [paginatedPurchaseOrders, setPaginatedPurchaseOrders] = useState<PaginationType<any>>(getDefaultPaginated());


    const [filters, setFilter] = useForm<any>({
        keyword: '',
        organization_id,
        page: 1
    });

    const debounceSearch = useDebounce(() => {
        search();
    }, 300);

    const search = async () => {
        setSearching(true);
        var r = await PosService.searchProductOnDemand({ ...filters, organization_id });
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);

    }


    const searchPurchaseOrders = async () => {
        setSearchingPurchaseOrders(true);
        var r = await PosService.searchPurchaseOrders({
            organization_id,
            page: 1,
            only_pending: true,
            per_page: 5
        });

        if (r.success) {
            setPaginatedPurchaseOrders(r.data);
        }
        setSearchingPurchaseOrders(false);
    }

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }
    }, [filters])


    useEffect(() => {
        setFilter('organization_id')(organization_id);
    }, [organization_id])


    useEffect(() => {
        searchPurchaseOrders();
    }, [])



    console.log(context.organization);


    return (
        <div className="flex flex-row">
            <div className="bg-white  border-b border-e flex-1">
                <div className="flex flex-row  gap-3  items-end p-3 border-b ">

                    <div className="flex-1">
                        <span className=" text-2xl font-medium uppercase flex mb-2">Product Demand</span>
                        <div className="grid grid-cols-2 gap-3 items-end">
                            <SuggestProductPrice organization_id={organization_id} value={form.product_price_id} onChange={setValue('product_price_id')} onSelect={p => {
                                var found = form.products.find((px: any) => px.id == p.id);
                                var found_in_paginated = paginated.records.find(px => px.id == p.id);
                                if (found) {
                                    setValue(`products[id:${found.id}].quantity`)(found.quantity + 1);

                                } else {
                                    setValue(`products[]`)({ ...p, quantity: 1 });
                                }
                                if (found_in_paginated) {
                                    setPaginatedValue(`records[id:${found.id}].quantity`)(found.quantity + 1);
                                } else {
                                    setPaginatedValue(`records[]`)({ ...p, quantity: 1 });
                                }
                            }}>Other Product Search</SuggestProductPrice>
                            <Search placeholder="Demand Search" value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />

                        </div>
                    </div>
                </div>

                {!searching && <div className="w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox
                                        checked={
                                            paginated.records.length > 0 &&
                                            paginated.records.every(r => form.products.some((p: any) => p.id === r.id))
                                        }
                                        onCheckedChange={(v) => {
                                            if (v) {
                                                setValue("products")(
                                                    paginated.records.map(r => ({
                                                        ...r,
                                                        quantity: r.quantity <= 0 ? 1 : r.quantity
                                                    }))
                                                );
                                            } else {
                                                setValue("products")([]);
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Remaining Quantity</TableHead>
                                <TableHead>MRP</TableHead>
                                <TableHead  >Selling Price</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginated.records.map((record: any) => {
                                var checked = !!form.products.find((p: any) => p.id == record.id);
                                return (<TableRow key={record.id}>
                                    <TableCell><Checkbox checked={checked} onCheckedChange={chk => chk ? setValue('products[]')({
                                        ...record,
                                        quantity: record.quantity <= 0 ? 1 : record.quantity
                                    }) : setValue(`products[id:${record.id}]-`)()} /></TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <SafeImage src={record.image} className='w-12 h-12 object-cover rounded-lg border border-gray-100 flex items-center justify-center text-3xl text-gray-300'>
                                                <LuPackage />
                                            </SafeImage>
                                            <div className='flex-grow min-w-0'>
                                                <p className="font-semibold text-gray-800 truncate text-base">{record.name}</p>
                                                <p className="text-xs text-gray-500">{record.product_category_name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell >{record.sku}</TableCell>
                                    <TableCell >{record.quantity >= 0 ? record.quantity : 0}</TableCell>


                                    <TableCell >{context.settings.currency_symbol}{record.mrp}</TableCell>
                                    <TableCell >{context.settings.currency_symbol}{record.sp}</TableCell>


                                </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </div>}
                {searching && <CenterLoading className="relative h-[500px]" />}
                {!searching && paginated.records.length == 0 && <NoRecords />}

                <Pagination paginated={paginated} onChange={setFilter('page', 'debounce')} />
                {!!context.organization.id && <FloatingItemsForPurchase
                    organization_id={context.organization.id}
                    products={form.products}
                    onUpdate={setValue('products')}
                    onSuccess={() => {
                        loadStats(false);
                        setValue('products')([]);
                        searchPurchaseOrders();
                        msg.success('Purchase order successfuly created');

                    }}
                />}
            </div>
            <div className="w-[300px] bg-white border-b">
                <span className=" text-2xl font-medium uppercase flex mb-2 p-3 border-b">Purchase Orders</span>
                {searchingPurchaseOrders && <CenterLoading className="relative h-[200px]" />}
                {!searchingPurchaseOrders && paginatedPurchaseOrders.records.length == 0 && <NoRecords icon={MdOutlinePlaylistRemove} title="No Pending PO" subtitle="There are no pending purchase orders" />}
                {!searchingPurchaseOrders && (
                    <div className="space-y-2 px-3">
                        {paginatedPurchaseOrders.records.map(po => (
                            <div
                                key={po.id}
                                className="relative group p-2 rounded-xl border shadow-sm bg-white flex items-center justify-between overflow-hidden"
                            >
                                {/* content */}
                                <div>
                                    <div className="font-semibold text-sm">{po.internal_reference_number}</div>
                                    <div className="text-xs text-gray-600">{po.seller_party?.name}</div>
                                    <div className="text-xs text-gray-400">{formatDateTime(po.created_at)}</div>
                                </div>

                                <div className="text-right">
                                    <div className="font-bold">
                                        {po.currency_symbol}{po.amount}
                                    </div>
                                </div>

                                {/* overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* button */}
                                <Link
                                    to={'/pos/purchase-orders/' + po.internal_reference_number}
                                    className="absolute inset-0 m-auto h-9 w-28 rounded-lg flex items-center gap-3 px-3 bg-white font-medium shadow opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all"
                                >Receive <LuArrowRight className="shrik-0" /></Link>

                            </div>
                        ))}
                    </div>
                )}


                <div className="p-3 justify-end flex">
                    <Link to={'/pos/purchase-orders'}> <Btn>All Purchase Orders <LuArrowRight /></Btn></Link>
                </div>
            </div>
        </div>
    )
}
