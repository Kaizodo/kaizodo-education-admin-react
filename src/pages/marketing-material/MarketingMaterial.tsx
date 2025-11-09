import { useState, useEffect, useRef } from 'react';
import AppPage from '@/components/app/AppPage';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import { MarketingMaterialService } from '@/services/MarketingMaterialService';
import CenterLoading from '@/components/common/CenterLoading';
import { MarketingMaterialCategoryService } from '@/services/MarketingMaterialCategoryService';
import FileDrop from '@/components/common/FileDrop';
import Pagination from '@/components/common/Pagination';
import NoRecords from '@/components/common/NoRecords';
import MarketingMaterialItem from './components/MarketingMaterialItem';
import { Progress } from '@/components/ui/progress';



export default function MarketingMaterial() {
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [categories, setCategories] = useState<{
        id: number,
        name: string
    }[]>([])
    const uploadingRef = useRef(false);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
        marketing_material_category_id?: number,
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });

    const [uploads, setUploads] = useState<{
        id: number,
        file: File,
        progress: number,
        uploading: boolean,
        uploaded: boolean
    }[]>([]);


    const beginUpload = async (upload_index: number) => {
        if (uploadingRef.current) return;

        const upload = uploads[upload_index];
        if (!upload || upload.uploaded || upload.uploading) return;

        uploadingRef.current = true;

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = { ...updated[upload_index], uploading: true, progress: 0 };
            return updated;
        });

        const r = await MarketingMaterialService.upload({
            file: upload.file,
            marketing_material_category_id: filters.marketing_material_category_id,
        }, (progress: number) => {
            setUploads(prev => {
                const updated = [...prev];
                updated[upload_index] = { ...updated[upload_index], progress };
                return updated;
            });
        });

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = {
                ...updated[upload_index],
                uploading: false,
                uploaded: !!r.success,
                progress: r.success ? 100 : updated[upload_index].progress
            };
            return updated;
        });

        uploadingRef.current = false;

        // check if any remaining uploads
        const latestUploads = [...uploads]; // read stale-free snapshot
        const nextIndex = latestUploads.findIndex((u, idx) => idx > upload_index && !u.uploaded && !u.uploading);

        if (nextIndex !== -1) {
            beginUpload(nextIndex);
        } else {
            // all uploads done
            setUploads([]);
            search(); // call after all uploads done
        }
    };

    useEffect(() => {
        if (!uploadingRef.current) {
            const nextIndex = uploads.findIndex(u => !u.uploaded && !u.uploading);
            if (nextIndex !== -1) beginUpload(nextIndex);
        }
    }, [uploads]);

    const load = async () => {
        setLoading(true);
        var r = await MarketingMaterialCategoryService.all();
        if (r.success) {
            setCategories(r.data);
            setFilter('marketing_material_category_id')(r.data?.[0]?.id);
            setLoading(false);
        }

    }

    const setFilter = useSetValue(setFilters);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await MarketingMaterialService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {

        if (categories.length > 0) {
            if (filters.debounce) {
                debounceSearch();
            } else {
                search();
            }
        } else {
            load();
        }

    }, [filters]);












    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }
    return (
        <AppPage
            title='Marketing Material'
            subtitle='Marketing Material for referers'
        >
            <div className="w-full">



                <div className="mb-8">
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                        Marketing Material Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setFilter('marketing_material_category_id', 'debounce')(category.id)}
                                className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md ${filters.marketing_material_category_id === category.id
                                    ? 'bg-primary text-white ring-4 ring-indigo-300'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                            >
                                <span className="ml-2">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <FileDrop onChange={(files) => setUploads(ups => ([...ups, ...files.map((f, fi) => ({
                    id: new Date().getTime() + fi,
                    file: f,
                    progress: 0,
                    uploading: false,
                    uploaded: false
                }))]))} />
                {uploads.map((upload, upload_index) => <div key={'upload_' + upload_index} className="border rounded-lg p-1">
                    <div>{upload.file.name}</div>
                    <div className="flex flex-row items-center">
                        <Progress value={upload.progress} className="h-2 flex-1" />
                        <div className="w-6 text-xs text-center">{upload.progress}%</div>
                    </div>
                </div>)}



                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-5">
                        Existing Materials ({categories.find(c => c.id == filters.marketing_material_category_id)?.name})
                    </h2>
                    {searching && <CenterLoading className='h-[400px] relative' />}

                    {!searching && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginated.records.map((material) => {
                            return <MarketingMaterialItem key={material.id} material={material} onDelete={() => {
                                setPaginated(p => ({ ...p, records: p.records.filter(px => px.id !== material.id) }))
                            }} />
                        })}
                    </div>}
                </div>

            </div>
            {!searching && paginated.records.length == 0 && <NoRecords />}
            <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
        </AppPage>
    );
};
