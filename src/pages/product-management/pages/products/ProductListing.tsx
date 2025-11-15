import { useEffect, useState } from "react";
import { StatsCard } from "./components/StatsCard";
import { Package, DollarSign, TrendingUp, AlertCircle, Edit, Trash2 } from "lucide-react";
import AppPage from "@/components/app/AppPage";
import Btn from "@/components/common/Btn";
import { LuArrowRight, LuCamera, LuPlus } from "react-icons/lu";
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
import { getProductTypeName } from "@/data/Product";
import { cn } from "@/lib/utils";



const Products = () => {

    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
        product_category_id?: number,
        is_service?: number,
        sort_by?: string,
        publish?: number
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });

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

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);




    return (
        <AppPage
            title="Products & Services"
            subtitle="Manage your product catalog"
            actions={<Link to={'/product-management/products/create'}><Btn><LuPlus /> Add Product</Btn></Link>}
            containerClassName="space-y-6"
        >
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Products"
                    value="156"
                    change="+12% from last month"
                    icon={Package}
                    trend="up"
                />
                <StatsCard
                    title="Total Revenue"
                    value="$45,231"
                    change="+8% from last month"
                    icon={DollarSign}
                    trend="up"
                />
                <StatsCard
                    title="Active Products"
                    value="142"
                    change="+4% from last month"
                    icon={TrendingUp}
                    trend="up"
                />
                <StatsCard
                    title="Low Stock"
                    value="8"
                    change="-2 from last week"
                    icon={AlertCircle}
                    trend="down"
                />
            </div>

            {/* Filters */}


            {/* Products Table */}
            <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
                <div className="   p-4 grid grid-cols-5 gap-4 border-b">
                    <TextField value={filters.keyword} onChange={v => setFilter('keyword', 'debounce')(v, true)} placeholder="Search by name">Keyword</TextField>
                    <SuggestProductCategory value={filters.product_category_id} onChange={setFilter('product_category_id', 'debounce')} />
                    <Dropdown searchable={false} value={filters.is_service} onChange={setFilter('is_service', 'debounce')} getOptions={async () => [{ id: undefined, name: "All" }, { id: 1, name: 'Service' }, { id: 0, name: 'Goods' }]}>Product Type</Dropdown>
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
                        value={filters.publish}
                        onChange={setFilter('publish', 'debounce')}
                        getOptions={async () => [
                            { id: undefined, name: 'All' },
                            { id: 1, name: 'Public' },
                            { id: 0, name: 'Not Public' }
                        ]}
                    >
                        Status
                    </Dropdown>
                </div>
                {!searching && <Table>
                    <TableHeader>
                        <TableRow>
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
                                <TableCell>

                                    <SafeImage src={record.image} className="h-12 w-12 rounded-md border object-cover">
                                        <div className="text-2xl flex items-center justify-center flex-1  h-full w-full text-gray-400">
                                            <LuCamera />
                                        </div>
                                    </SafeImage>
                                </TableCell>
                                <TableCell>{record.name}</TableCell>
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
                                        <span className="text-xs">₹0.0</span>
                                    </div>
                                </TableCell>
                                <TableCell>{record.is_draft ? 'Draft' : 'Published'}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-end">
                                        <Link to={'/product-management/products/' + record.id}>
                                            <Btn variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                        </Link>
                                        <Btn onClick={() => {
                                            msg.confirm('Delete ' + record.name, 'Are you sure you want to delete ' + record.name + '? this action cannot be undone.', {
                                                onConfirm: async () => {
                                                    var r = await ProductService.delete(record.id);
                                                    if (r.success) {
                                                        search();
                                                    }
                                                    return r.success;
                                                }
                                            })
                                        }} variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4" />
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
