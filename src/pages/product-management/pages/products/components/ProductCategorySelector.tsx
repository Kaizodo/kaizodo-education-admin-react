import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    ChevronRight,
} from 'lucide-react';
import CenterLoading from '@/components/common/CenterLoading';
import { ProductCategoryService } from '@/services/ProductCategoryService';
import { cn } from '@/lib/utils';
import Btn from '@/components/common/Btn';
import { LuArrowRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '@/services/ProductService';



export type ProductCategory = {
    id: number;
    product_category_id?: number | null; // Parent ID
    name: string;
    slug: string;
    description?: string | null;
    is_service: 0 | 1;
    created_at: string;
    updated_at: string;
};

interface CategoryNode extends ProductCategory {
    children: CategoryNode[];
}

const buildCategoryTree = (flatCategories: ProductCategory[]): CategoryNode[] => {
    const map: Record<number, CategoryNode> = {};
    const tree: CategoryNode[] = [];

    flatCategories.forEach(cat => {
        map[cat.id] = { ...cat, children: [] };
    });

    flatCategories.forEach(cat => {
        const node = map[cat.id];
        if (cat.product_category_id != null && map[cat.product_category_id]) {
            map[cat.product_category_id].children.push(node);
        } else {
            tree.push(node);
        }
    });

    return tree;
};






export default function ProductCategorySelector() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
    const [creating, setCreating] = useState(false);


    const [selectedPath, setSelectedPath] = useState<number[]>([]);

    const [finalSelection, setFinalSelection] = useState<ProductCategory | null>(null);

    const hasChildren = !!categories.find(c => c.product_category_id == finalSelection?.id);

    const load = async () => {
        setLoading(true);
        var r = await ProductCategoryService.all();
        if (r.success) {
            setCategories(r.data);
        }
        setLoading(false);
    }


    const create = async () => {
        setCreating(true);
        var r = await ProductService.create({ product_category_id: finalSelection?.id });
        if (r.success) {
            navigate(`/product-management/products/${r.data.record_id}`);
        }
        setCreating(false);
    }

    const handleSelect = useCallback((id: number, level: number, category: ProductCategory) => {
        const newPath = [...selectedPath.slice(0, level), id];
        setSelectedPath(newPath);
        setFinalSelection(category);
    }, [selectedPath]);


    const renderCategoryList = (nodes: CategoryNode[], level: number) => {
        const selectedId = selectedPath[level];

        return (
            <div
                key={`list-${level}`}
                className=" flex-shrink-0 border-r border-gray-200 p-1 bg-white shadow-lg rounded-sm mx-2"
                style={{ minHeight: '350px' }} // Ensure lists align vertically
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                    {level === 0 ? 'Main Categories' : `Level ${level + 1}`}
                </h3>
                <ul className="space-y-1 max-h-[500px] overflow-y-auto">
                    {nodes.map(node => {
                        const isSelected = node.id === selectedId;
                        const hasChildren = node.children.length > 0;

                        return (
                            <li key={node.id}>
                                <button
                                    onClick={() => handleSelect(node.id, level, node)}
                                    className={`
                    flex items-center justify-between w-full p-1 rounded-sm transition-colors duration-150
                    ${isSelected
                                            ? 'bg-indigo-100 text-indigo-800 font-medium shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                  `}
                                >
                                    <div className="flex items-center">
                                        <span className="truncate text-sm">{node.name}</span>
                                    </div>
                                    {hasChildren && (
                                        <ChevronRight
                                            className={`w-4 h-4 ml-2 transition-transform ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };


    let currentNodes = categoryTree;
    const listsToRender = [];

    listsToRender.push(renderCategoryList(currentNodes, 0));


    for (let i = 0; i < selectedPath.length; i++) {
        const selectedId = selectedPath[i];
        const selectedNode = currentNodes.find(node => node.id === selectedId);

        if (selectedNode && selectedNode.children.length > 0) {
            currentNodes = selectedNode.children;
            listsToRender.push(renderCategoryList(currentNodes, i + 1));
        } else if (selectedNode) {
            break;
        }
    }


    useEffect(() => {
        load();
    }, [])

    if (loading) {
        return <CenterLoading className="h-[400px] relative" />
    }

    return (
        <div className="flex overflow-x-auto pb-4 -mx-2">
            {listsToRender}
            <div className={cn(
                "bg-white rounded-lg p-3 shadow-xl self-center fixed  transition-all bottom-[-100px] opacity-0 border flex flex-row items-center gap-3   justify-between right-3  ",
                (!hasChildren) && "  bottom-[15px] opacity-100 "
            )}>
                <span className='text-2xl font-bold'>{finalSelection?.name}</span>
                <Btn variant={'outline'} loading={creating} onClick={create}>Create Product <LuArrowRight /></Btn>
            </div>
        </div>
    );
};

