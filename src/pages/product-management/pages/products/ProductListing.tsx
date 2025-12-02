import { lazy, Suspense, useEffect, useState } from "react";
import { StatsCard } from "./components/StatsCard";
import { Package, TrendingUp, AlertCircle, Edit } from "lucide-react";
import AppPage from "@/components/app/AppPage";
import Btn from "@/components/common/Btn";
import { LuArchive, LuArrowRight, LuBuilding2, LuCamera, LuCopy, LuPlus } from "react-icons/lu";
import TextField from "@/components/common/TextField";
import { useSetValue } from "@/hooks/use-set-value";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductService } from "@/services/ProductService";
import CenterLoading from "@/components/common/CenterLoading";
import SuggestProductCategory from "@/components/common/suggest/SuggestProductCategory";
import Dropdown from "@/components/common/Dropdown";
import Pagination from "@/components/common/Pagination";
import NoRecords from "@/components/common/NoRecords";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { msg } from "@/lib/msg";
import { Link } from "react-router-dom";
import SafeImage from "@/components/common/SafeImage";
import { CategoryTree } from "../product-categories/ProductCategoryListing";
import { getProductTypeName, ProductType } from "@/data/Product";
import { cn, formatDays } from "@/lib/utils";
import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/ui/badge";
import Radio from "@/components/common/Radio";
import { YesNoArray } from "@/data/Common";
import { Skeleton } from "@/components/ui/skeleton";
import { GrMoney } from "react-icons/gr";
const LazyCloneProductForm = lazy(() => import('./components/CloneProductForm'));


const StatsSkeleton = () => {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[120px] border shadow-sm bg-white" />
        <Skeleton className="h-[120px] border shadow-sm bg-white" />
        <Skeleton className="h-[120px] border shadow-sm bg-white" />
        <Skeleton className="h-[120px] border shadow-sm bg-white" />
    </div>
}

const Products = () => {
    const [stats, setStats] = useState({
        currency_symbol: '₹',
        non_archived: 0,
        archived: 0,
        total_products: 0,
        low_stock: 0,
        total_stock: 0,
        total_sp: 0,
        total_mrp: 0,
        total_cp: 0
    });
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<any>({
        debounce: true,
        page: 1,
        keyword: '',
    });

    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        var r = await ProductService.stats();
        if (r.success) {
            setStats(r.data);
        }
        setLoading(false);
    }

    const setFilter = useSetValue(setFilters);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await ProductService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    const openCloner = async (product: any) => {
        const modal_id = Modal.show({
            title: 'Clone Product',
            subtitle: `Clone ${product.name} and create new product`,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyCloneProductForm product={product} onSuccess={() => {
                    search();
                    load();
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }


    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);


    useEffect(() => {
        load();
    }, [])


    return (
        <AppPage
            title="Products & Services"
            subtitle="Manage your product catalog"
            actions={<Link to={'/product-management/products/create'}><Btn><LuPlus /> Add Product</Btn></Link>}
            containerClassName="space-y-6"
        >
            {/* Stats */}
            {loading && <StatsSkeleton />}

            {!loading && <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Products"
                    value={`${stats.total_products}`}
                    change={`${stats.archived} Archived`}
                    icon={Package}
                    trend="up"
                />
                <StatsCard
                    title="Stock Value"
                    value={`${stats.currency_symbol}${stats.total_cp}`}
                    change={`${stats.currency_symbol}${stats.total_sp} selling value`}
                    icon={GrMoney}
                    trend="up"
                />
                <StatsCard
                    title="Active Products"
                    value={`${stats.non_archived}`}
                    change={`${stats.total_products} total products`}
                    icon={TrendingUp}
                    trend="up"
                />
                <StatsCard
                    title="Low Stock"
                    value={`${stats.low_stock}`}
                    change={`${stats.total_stock} total stock`}
                    icon={AlertCircle}
                    trend="down"
                />
            </div>}

            <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
                <div className="   p-4 grid grid-cols-5 gap-4 border-b">
                    <TextField value={filters.keyword} onChange={v => setFilter('keyword', 'debounce')(v, true)} placeholder="Search by name">Keyword</TextField>
                    <SuggestProductCategory value={filters.product_category_id} onChange={setFilter('product_category_id', 'debounce')} />
                    <Dropdown searchable={false} value={filters.product_type} onChange={setFilter('product_type', 'debounce')} getOptions={async () => [
                        { id: undefined, name: "All" },
                        { id: ProductType.Service, name: 'Service' },
                        { id: ProductType.Goods, name: 'Goods' }
                    ]}>Product Type</Dropdown>
                    <Dropdown
                        searchable={false}
                        value={filters.sort_by}
                        onChange={setFilter('sort_by', 'debounce')}
                        getOptions={async () => [
                            { id: undefined, name: 'Newest First' },
                            { id: 'oldest', name: 'Oldest First' },
                            { id: 'name_asc', name: 'Name A-Z' },
                            { id: 'name_desc', name: 'Name Z-A' }
                        ]}
                    >
                        Sort By
                    </Dropdown>
                    <Dropdown
                        searchable={false}
                        value={filters.is_draft}
                        onChange={setFilter('is_draft', 'debounce')}
                        getOptions={async () => [
                            { id: undefined, name: 'All' },
                            { id: 0, name: 'Public' },
                            { id: 1, name: 'Draft' }
                        ]}
                    >
                        Status
                    </Dropdown>
                    <Radio value={filters.show_deleted} onChange={setFilter('show_deleted', 'debounce')} options={YesNoArray}>Show Arcived Products</Radio>
                    <div className="col-span-2">
                        <Radio value={filters.show_clones} onChange={setFilter('show_clones', 'debounce')} options={[
                            { id: undefined, name: 'All Products' },
                            { id: 1, name: 'Clones Only' },
                            { id: 0, name: 'Orignals Only' }
                        ]}>Orignal & Clone</Radio>
                    </div>
                    <div className="self-end">
                        <Btn onClick={() => setFilters({
                            page: 1,
                            keyword: '',
                            debounce: false
                        })}>Clear Filters</Btn>
                    </div>
                </div>
                {!searching && <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#ID</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Product Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-end">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginated.records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-row items-center gap-1">
                                        <SafeImage src={record?.organization_logo_short} className="h-5 w-5   object-contain ">
                                            <div className="text-xl flex items-center justify-center flex-1  h-full w-full text-gray-400">
                                                <LuBuilding2 />
                                            </div>
                                        </SafeImage>
                                        {!!record.organization_id && <span className="text-xs">{record.organization_name}</span>}
                                        {!record.organization_id && <span className="text-xs text-red-600">NO STORE</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <SafeImage src={record?.media?.media_path} className="h-12 w-12 rounded-md border object-contain p-1">
                                        <div className="text-2xl flex items-center justify-center flex-1  h-full w-full text-gray-400">
                                            <LuCamera />
                                        </div>
                                    </SafeImage>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center gap-1">
                                            <span className="font-medium">{record.name}</span>
                                            {!!record.product_id && <Badge>Cloned</Badge>}
                                        </div>
                                        {!!record.product_id && <div className="text-xs text-gray-500">
                                            <span>Clone of </span>
                                            <Link to={"/product-management/products/" + record.product_id} className="text-blue-700 font-medium cursor-pointer hover:text-blue-900">{record.main_product_name}</Link>
                                        </div>}
                                        {record.show_in_listing ? <Link to={record.url} className="text-xs" target="_blank">{record.url}</Link> : <span className="text-xs text-red-700 italic">Not Shown on website</span>}

                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className='flex flex-row gap-1 text-xs flex-wrap items-center'>
                                        {record.tree.map((item: CategoryTree, index: number) => {
                                            return <>
                                                <span key={item.id} className={cn(
                                                    'flex cursor-pointer border border-transparent hover:bg-gray-100 rounded-lg hover:border-gray-400 px-1 text-xs',
                                                    item.id == record.product_category_id && " bg-sky-50 border-sky-400 font-medium "
                                                )}  >{item.name}</span>
                                                {index !== record.tree.length - 1 && <LuArrowRight />}
                                            </>
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell><span className="text-xs">{getProductTypeName(record.product_type)}</span></TableCell>

                                <TableCell>
                                    <div className="flex flex-col">
                                        {record.prices.map((price: any) => {
                                            return <span className="text-xs" key={price.id}>
                                                {price.country_name} - {price.currency_symbol}{price.sp} / {record.unit_name} {record.product_type === ProductType.Service ? `(${formatDays(price.duration_days)})` : ''}
                                            </span>
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell>{record.is_draft ? 'Draft' : 'Published'}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-end">
                                        <Btn size={'sm'} variant={'outline'} onClick={() => openCloner(record)}>Clone <LuCopy /></Btn>
                                        <Link to={'/product-management/products/' + record.id}>
                                            <Btn variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                        </Link>
                                        <Btn onClick={() => {
                                            msg.confirm(
                                                `Archive ${record.name}`,
                                                `Are you sure you want to archive ${record.name}? Once archived, it will no longer be visible anywhere.`,
                                                {
                                                    onConfirm: async () => {
                                                        const r = await ProductService.delete(record.id);
                                                        if (r.success) search();
                                                        return r.success;
                                                    }
                                                }
                                            );

                                        }} variant="destructive" size="sm">
                                            Archive
                                            <LuArchive className="h-4 w-4" />
                                        </Btn>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
                {searching && <CenterLoading className='h-[400px] relative' />}
                {!searching && paginated.records.length == 0 && <NoRecords title="No Products Found" />}
                <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
            </div>

        </AppPage>
    );
};

export default Products;
