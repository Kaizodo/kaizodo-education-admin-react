
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
import { FeatureCardService } from '@/services/FeatureCardService';
import { Search } from '@/components/ui/search';
import { LuPencil } from 'react-icons/lu';

const LazyEditorDialog = lazy(() => import('./components/FeatureCardEditorDailog'));
const LazyFeatureCardContentEditor = lazy(() => import('./components/FeatureCardContentEditor'));

export default function FeatureCards() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string
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
        var r = await FeatureCardService.search(filters);
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
            title: id ? 'Update Feature Card' : 'Add Feature Card',
            maxWidth: 500,
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


    const openContentEditor = async (record: any) => {
        Modal.show({
            title: record.name,
            subtitle: record.description,
            maxWidth: '95%',
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyFeatureCardContentEditor id={record.id} />
            </Suspense>
        });
    }




    return (
        <AppPage title='Feature Card Management' subtitle='Manage Feature Card which will shown on website' actions={<Btn onClick={() => openEditor()}><FaPlus />Add New</Btn>}>
            <AppCard>
                <div className="p-3 border-b">
                    <Search
                        placeholder="Search..."
                        value={filters.keyword}
                        onChange={(e) => setFilter('keyword', 'debounce')(e.target.value, true)}
                    />

                </div>
                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Url</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">
                                        {!!record.image && <img src={record.image} className='border rounded-sm' style={{
                                            height: 50
                                        }} />}
                                    </TableCell>
                                    <TableCell className="font-medium">{record.name}</TableCell>
                                    <TableCell className='text-xs italic'>{record.description}</TableCell>
                                    <TableCell className='text-xs italic'>{'/feature/' + record.slug}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Btn variant="outline" size="sm" onClick={() => openContentEditor(record)}>
                                                <LuPencil className="h-4 w-4" /> Edit Content
                                            </Btn>
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" /> Edit Details
                                            </Btn>
                                            <Btn onClick={() => {
                                                msg.confirm('Delete ' + record.name, 'Are you sure you want to delete ' + record.name + '? this action cannot be undone.', {
                                                    onConfirm: async () => {
                                                        var r = await FeatureCardService.delete(record.id);
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

