import { ProductService } from '@/services/ProductService';
import Dropdown from '../Dropdown';
import { SuggestProp } from './Suggest';
import { Product } from '@/data/Product';
import SafeImage from '../SafeImage';
import { LuCamera } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';


export default function SuggestProduct({
    children = 'Product',
    value,
    selected,
    onChange,
    placeholder = 'Select product',
    onSelect,
    includedValues,
    disabled,
    exclude_ids
}: SuggestProp & {
    exclude_ids?: number[]
}) {
    return (
        <Dropdown
            disabled={disabled}
            searchable={true}
            selected={selected}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect}
            getOptions={async ({ page, keyword }) => {
                const r = await ProductService.search({
                    page,
                    keyword,
                    exclude_ids
                });
                if (r.success) {
                    return r.data.records.map((record: Product) => {
                        return {
                            ...record,
                            widget: () => {
                                return <div className='flex flex-row gap-2'>
                                    <span>#{record.id}</span>
                                    <SafeImage src={record?.media?.media_path} className="h-12 w-12 rounded-md border object-cover">
                                        <div className="text-2xl flex items-center justify-center flex-1  h-full w-full text-gray-400">
                                            <LuCamera />
                                        </div>
                                    </SafeImage>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center gap-1">
                                            <span>{record.name}</span>
                                            {!!record.product_id && <Badge>Cloned</Badge>}
                                        </div>
                                        {!!record.product_id && <div className="text-xs text-gray-500">
                                            <span>Clone of </span>
                                            <span className="text-blue-700 font-medium cursor-pointer hover:text-blue-900">{record.main_product_name}</span>
                                        </div>}
                                    </div>
                                </div>
                            }
                        };
                    });
                }
                return [];
            }}
        >
            {children}
        </Dropdown>
    );
}
