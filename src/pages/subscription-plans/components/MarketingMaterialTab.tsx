import { useState, useEffect } from 'react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import { MarketingMaterialService } from '@/services/MarketingMaterialService';
import CenterLoading from '@/components/common/CenterLoading';
import { MarketingMaterialCategoryService } from '@/services/MarketingMaterialCategoryService';
import Pagination from '@/components/common/Pagination';
import NoRecords from '@/components/common/NoRecords';
import { SubscriptionPlanEditorState } from '../SubscriptionPlanEditor';
import { Checkbox } from '@/components/ui/checkbox';



export const MarketingMaterialTab = ({ state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) => {
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [categories, setCategories] = useState<{
        id: number,
        name: string
    }[]>([])
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
        <div className='grid grid-cols-2 gap-3'>
            <div className=' border p-3 rounded-lg'>

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




                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-5">
                        Existing Materials ({categories.find(c => c.id == filters.marketing_material_category_id)?.name})
                    </h2>
                    {searching && <CenterLoading className='h-[400px] relative' />}

                    {!searching && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginated.records.map((material) => {
                            var checked = !!(state.marketing_materials ?? []).find(m => m.id == material.id);
                            return <label className='aspect-square relative border p-4'>
                                <div className='absolute bottom-0 bg-black/20 w-full left-0 p-2  font-medium flex items-center gap-2'>
                                    <Checkbox checked={checked} onCheckedChange={chk =>
                                        setValue('marketing_materials')(chk ? [...(state.marketing_materials ?? []), material] : (state.marketing_materials ?? []).filter(x => x.id !== material.id))} />
                                    <span>{material.media_name}</span>
                                </div>
                                <img src={material.media_path} className='max-w-full max-h-full' />
                            </label>;
                        })}
                    </div>}
                </div>
                {!searching && paginated.records.length == 0 && <NoRecords />}
                <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
            </div>
            <div className='border p-3 rounded-lg'>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                    Selected Marketing Material
                </label>
                <div className='flex flex-col gap-3'>
                    {categories.filter(c => state.marketing_materials.map(mm => mm.marketing_material_category_id).includes(c.id)).map(category => {
                        return <div className=''>
                            <span className='font-medium text-2xl flex mb-1'>{category.name}</span>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>

                                {state.marketing_materials.filter(mm => mm.marketing_material_category_id == category.id).map((material) => {
                                    var checked = !!(state.marketing_materials ?? []).find(m => m.id == material.id);
                                    return <label className='aspect-square relative border p-4'>
                                        <div className='absolute bottom-0 bg-black/20 w-full left-0 p-2  font-medium flex items-center gap-2'>
                                            <Checkbox checked={checked} onCheckedChange={chk =>
                                                setValue('marketing_materials')(chk ? [...(state.marketing_materials ?? []), material] : (state.marketing_materials ?? []).filter(x => x.id !== material.id))} />
                                            <span>{material.media_name}</span>
                                        </div>
                                        <img src={material.media_path} className='max-w-full max-h-full' />
                                    </label>;
                                })}
                            </div>

                        </div>
                    })}
                </div>
            </div>
        </div>
    );
};
