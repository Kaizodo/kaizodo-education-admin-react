
import { lazy, Suspense, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import AppCard from '@/components/app/AppCard';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Modal } from '@/components/common/Modal';
import { ProductCategoryService } from '@/services/ProductCategoryService';
import { Search } from '@/components/ui/search';
import { formatDateTime } from '@/lib/utils';
import { LuArrowRight } from 'react-icons/lu';

export type CategoryTree = {
    id: number,
    name: string,
    product_category_id: number,
    root_id: number
}

const LazyEditorDialog = lazy(() => import('./components/ProductCategoryEditorDialog'));

export default function ProductCategoryListing() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
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
        var r = await ProductCategoryService.search(filters);
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

    const openEditor = async (id?: number) => {
        const modal_id = Modal.show({
            title: !id ? 'Add Product Category' : 'Update Product Category',
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDialog id={id} onSuccess={() => {
                    search();
                    Modal.close(modal_id);
                }} onCancel={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }





    return (
        <AppPage
            title='Product Categories'
            subtitle='Manage various product categories which will be used to sort products'
            actions={<div className='me-4'><Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn></div>}
            containerClassName="md:pt-0"
        >
            <AppCard contentClassName="p-0">

                <div className='p-3'>
                    <Search placeholder='Search by name...' value={filters.keyword} onChange={v => setFilter('keyword', 'debounce')(v.target.value, true)} />
                </div>

                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Parent Category</TableHead>
                                <TableHead>Category Type</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>{record.description}</TableCell>
                                    <TableCell>
                                        <div className='flex flex-row gap-1 text-xs flex-wrap items-center'>
                                            {record.tree.filter((t: CategoryTree) => t.id !== record.id).map((item: CategoryTree, index: number) => {
                                                return <>
                                                    <span key={item.id} className='flex cursor-pointer border border-transparent hover:bg-gray-100 rounded-lg hover:border-gray-400 px-1' onClick={() => openEditor(item.id)}>{item.name}</span>
                                                    {index !== record.tree.filter((t: CategoryTree) => t.id !== record.id).length - 1 && <LuArrowRight />}
                                                </>
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell>{record.is_service ? 'Service Category' : 'Goods Category'}</TableCell>
                                    <TableCell>{record.products_count}</TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='text-xs italic text-gray-500'>Created : {formatDateTime(record.created_at)}</span>
                                            <span className='text-xs italic text-gray-500'>Last Update : {formatDateTime(record.updated_at ?? record.created_at)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                            <Btn onClick={() => {
                                                msg.confirm('Delete ' + record.name, 'Are you sure you want to delete ' + record.name + '? this action cannot be undone.', {
                                                    onConfirm: async () => {
                                                        var r = await ProductCategoryService.delete(record.id);
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
                    {!searching && paginated.records.length == 0 && <NoRecords />}
                    <div className='p-3'>
                        <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />

                    </div>
                </div>
            </AppCard>
        </AppPage>
    );
};

