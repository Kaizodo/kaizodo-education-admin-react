import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { Modal, ModalBody, ModalFooter } from '@/components/common/Modal'
import NoRecords from '@/components/common/NoRecords';
import SafeImage from '@/components/common/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from '@/components/ui/search';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { Product, ProductPrice, ProductType } from '@/data/Product';
import { useDebounce } from '@/hooks/use-debounce';
import { useForm } from '@/hooks/use-form';
import { formatDays } from '@/lib/utils';
import { ProductService } from '@/services/ProductService';
import { useEffect, useState } from 'react';
import { LuCamera } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const ProductThumbnail = ({ record, selected, onSelectedChange }: {
    record: any, index: number,
    selected: any[],
    onSelectedChange: (selected: any[]) => void
}) => {


    return (
        <div
            key={record.id}
            className="bg-white border p-2 flex flex-col items-center rounded-lg shadow-sm gap-3 "
        >
            <div className='flex flex-row items-center w-full gap-3'>
                <SafeImage src={record?.media?.media_path} className="h-12 w-12 shrink-0 grow-0 rounded-md border object-cover">
                    <div className="text-2xl flex items-center justify-center flex-1  h-full w-full text-gray-400">
                        <LuCamera />
                    </div>
                </SafeImage>
                <div className="flex flex-col w-full items-start">
                    <div className="flex flex-col text-sm">
                        <div className="flex flex-row items-center gap-1">
                            <span className='font-medium'>{record.name}</span>
                            {!!record.product_id && <Badge>Cloned</Badge>}
                        </div>
                        {!!record.product_id && <div className="text-xs text-gray-500">
                            <span>Clone of </span>
                            <Link to={"/product-management/products/" + record.product_id} target='_blank' className="text-blue-700 font-medium cursor-pointer hover:text-blue-900">{record.main_product_name}</Link>
                        </div>}
                    </div>
                    <p className="text-muted-foreground text-xs italic">{record.description}</p>
                </div>
            </div>



            <div className='grid grid-cols-2 gap-3 w-full'>
                {record.prices.map((price: any) => {
                    var found = !!selected.find(s => !!s.prices.find((p: ProductPrice) => p.id == price.id));
                    var product_wp = { ...record, prices: [price] };
                    return <label className='flex flex-row items-center gap-2 hover:bg-sky-50 border rounded-lg p-1 hover:border-sky-400 cursor-pointer transition-all'>
                        <Checkbox checked={found} onCheckedChange={checked => onSelectedChange(checked ? [...selected, product_wp] : selected.find(s => !!s.prices.find((p: ProductPrice) => p.id != price.id)))} />
                        <span className="text-xs" key={price.id}>
                            {price.country_name} - {price.currency_symbol}{price.sp} / {record.unit_name} {record.product_type === ProductType.Service ? `(${formatDays(price.duration_days)})` : ''}
                        </span>
                    </label>
                })}
            </div>





        </div>
    );
};

function MultiProductCategoryPicker({ products, onSelect, filterOptions }: { products: Product[], onSelect: (products: Product[]) => void, filterOptions: any }) {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<Product>>(getDefaultPaginated())
    const [filters, setFilter] = useForm<{
        debounce?: boolean,
        page: number,
        keyword: string,
    }>({
        debounce: true,
        page: 1,
        keyword: '',
        ...filterOptions
    });
    const [state, setValue] = useForm({
        products: products
    });


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
    return (<>
        <ModalBody>
            <Search placeholder='Search products' value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
            {searching && <CenterLoading className="relative h-[150px]" />}
            {!searching && paginated.records.map((record, record_index) => {
                return <ProductThumbnail record={record} index={record_index} selected={state.products} onSelectedChange={setValue('products')} />
            })}
            {!searching && paginated.records.length == 0 && <NoRecords />}
        </ModalBody>
        <ModalFooter>
            <Btn disabled={state.products.length == 0} onClick={() => onSelect(state.products)}>Select {state.products.length > 0 && <Badge>{state.products.length}</Badge>}</Btn>
        </ModalFooter>
    </>);
}


export function pickMultiProductCategories({ title = 'Pick Products', products, subtitle, ...rest }: {
    title?: string,
    subtitle?: string,
    product_category_id?: number,
    exclude_ids?: number[],
    products?: Product[]
}) {
    return new Promise((resolve) => {
        const modal_id = Modal.show({
            title,
            subtitle,
            maxWidth: 600,
            onClose: () => resolve([]),
            content: () => <MultiProductCategoryPicker
                products={products ?? []}
                onSelect={(p) => {
                    resolve(p)

                    Modal.close(modal_id);
                }} filterOptions={rest} />
        })
    })
}