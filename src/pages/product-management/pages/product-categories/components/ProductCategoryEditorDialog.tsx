
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { ProductCategoryService } from '@/services/ProductCategoryService';
import Radio from '@/components/common/Radio';
import SuggestProductCategory from '@/components/common/suggest/SuggestProductCategory';
import { FeatureGroupService } from '@/services/FeatureGroupService';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { FeatureService } from '@/services/FeatureService';
import { Search } from '@/components/ui/search';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Checkbox } from '@/components/ui/checkbox';
import Chip from '@/components/common/Chip';
import { useForm } from '@/hooks/use-form';
import { Label } from '@/components/ui/label';

type FeatureGroup = {
    id: number,
    name: string,
    description: string,
    feature_count: number
}

type Feature = {
    id: number,
    name: string,
    description: string,
    feature_group_id: number,
    code: string,
    input_type: 'text' | 'number' | 'boolean' | 'richtext' | 'image'
}

interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function ProductCategoryEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({
        features: []
    });
    const setValue = useSetValue(setForm);
    const [searching, setSearching] = useState(true);
    const [searchingGroups, setSearchingGroups] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [groupsPaginated, setGroupsPaginated] = useState<PaginationType<FeatureGroup>>(getDefaultPaginated());
    const [groupfilters, setGroupFilter] = useForm<{
        debounce?: boolean,
        page: number,
        keyword: string,
        feature_group_id?: string
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });

    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
        feature_group_id?: string
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
        var r = await FeatureService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {

        if (!!filters.feature_group_id) {
            if (filters.debounce) {
                debounceSearch();
            } else {
                search();
            }
        }

    }, [filters]);



    const debounceGroupSearch = useDebounce(() => {
        groupSearch();
    }, 300, 1);

    const groupSearch = async () => {
        setSearchingGroups(true);
        var r = await FeatureGroupService.search(groupfilters);
        if (r.success) {
            setGroupsPaginated(r.data);
        }
        setSearchingGroups(false);
    }

    useEffect(() => {
        if (groupfilters.debounce) {
            debounceGroupSearch();
        } else {
            groupSearch();
        }
    }, [groupfilters]);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await ProductCategoryService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        } else {
            onCancel();
        }
    }


    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        var { features, ...rest } = form;
        if (features) {
            rest.feature_ids = features.map((f: Feature) => f.id);
        } else {
            rest.feature_ids = [];
        }
        if (id) {
            r = await ProductCategoryService.update(rest);
        } else {
            r = await ProductCategoryService.create(rest);
        }
        if (r.success) {
            msg.success(id ? 'Record updated successfully' : 'Record created successfully');
            onSuccess(r.data);
        }
        setSaving(false);
    }

    useEffect(() => {
        if (id) {
            getDetail();
        } else {
            setLoading(false);
        }
    }, [id])




    return (
        <>
            <ModalBody className='relative'>
                {!!loading && <CenterLoading className='absolute z-[50]' />}
                <Radio value={form.is_service} onChange={setValue('is_service')} options={[{ id: 1, name: 'Service' }, { id: 0, name: 'Goods' }]}>Category Type</Radio>
                <SuggestProductCategory
                    value={form.product_category_id}
                    onChange={setValue('product_category_id')}
                    disabled={form.is_service == undefined}
                    is_service={form.is_service}
                    selected={{ id: form.product_category_id, name: form.product_category_name }}
                    exclude_ids={[form.id]}
                />
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField value={form.description} onChange={setValue('description')} placeholder='Enter description' multiline>Description</TextField>
                {(form?.features ?? []).length > 0 && <div className='space-y-2'>
                    <Label>Selected Features</Label>
                    <div className='flex flex-row flex-wrap gap-2'>
                        {(form?.features ?? []).map((feature: Feature) => {
                            return <Chip key={feature.id} label={feature.name} onRemove={() => setValue('features')((form?.features ?? []).filter((f: Feature) => f.id !== feature.id))} />
                        })}
                    </div>
                </div>}

                <hr />
                <Search placeholder='Search by group...' value={groupfilters.keyword} onChange={v => setGroupFilter('keyword', 'debounce')(v.target.value, true)} />
                {!searchingGroups && groupsPaginated.records.length > 0 && <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-3"
                    value={filters.feature_group_id}
                    onValueChange={setFilter('feature_group_id')}
                >
                    {groupsPaginated.records.map(group => {
                        var features: Feature[] = (form?.features ?? [])?.filter?.((f: any) => f.feature_group_id == group.id) ?? [];
                        return <AccordionItem value={`${group.id}`} key={group.id} className='bg-white border rounded-lg shadow-sm'>
                            <AccordionTrigger className='p-2 hover:no-underline' onClick={() => setSearching(true)}>
                                <div className='w-full text-start flex flex-col items-start flex-1 me-2'>
                                    <span>{group.name}</span>
                                    <span className='font-normal text-xs'>{group.description}</span>
                                </div>
                                <Badge className='me-2' variant={features.length > 0 ? 'default' : 'outline'}>{features.length}/{group.feature_count}</Badge>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col   text-balance">
                                <div className='p-3'>
                                    <Search placeholder='Search by feature...' value={filters.keyword} onChange={v => setFilter('keyword', 'debounce')(v.target.value, true)} />
                                </div>
                                <div className='flex flex-row flex-wrap gap-2 p-2'>
                                    {features.map(feature => {
                                        return <Chip key={feature.id} label={feature.name} onRemove={() => setValue('features')((form?.features ?? []).filter((f: Feature) => f.id !== feature.id))} />
                                    })}
                                </div>
                                <div className='flex flex-col gap-2 px-3'>
                                    {!searching && paginated.records.map((record: Feature) => {
                                        return <label key={record.id} className='p-1 rounded-lg border flex items-center gap-1 hover:bg-sky-50' >
                                            <Checkbox
                                                checked={!!features.find(f => f.id == record.id)}
                                                onCheckedChange={checked => setValue('features')(checked ? [...(form?.features ?? []), record] : (form?.features ?? []).filter((f: Feature) => f.id !== record.id))}
                                            />
                                            <span>{record.name}</span>
                                        </label>
                                    })}
                                </div>
                                {searching && <CenterLoading className='h-[150px] relative' />}
                                {!searching && paginated.records.length == 0 && <NoRecords />}
                                <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
                            </AccordionContent>
                        </AccordionItem>
                    })}

                </Accordion>}
                {searchingGroups && <CenterLoading className='h-[150px] relative' />}
                {!searchingGroups && groupsPaginated.records.length == 0 && <NoRecords title='No Groups Found' />}
                <Pagination showCount={false} className="p-3" paginated={groupsPaginated} onChange={(page) => setGroupFilter('page', 'debounce')(page, false)} />
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

