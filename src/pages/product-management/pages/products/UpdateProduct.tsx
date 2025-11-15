import AppPage from '@/components/app/AppPage';
import { useNavigate, useParams } from 'react-router-dom';
import ProductEditorForm, { ProductState } from './components/ProductEditorForm';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LuArrowRight } from 'react-icons/lu';

export default function UpdateProduct() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [state, setState] = useState<ProductState>();


    return (<AppPage
        enableBack={true}
        backRoute={'/product-management/products'}
        title={state?.product?.name ?? "Update Product"}
        subtitle={state?.tree ? <div className='flex flex-row gap-1 text-xs flex-wrap items-center'>
            {state.tree.map((item, index: number) => {
                return <>
                    <span key={item.id} className={cn(
                        'flex    px-1 text-xs',
                        item.id == state.product.product_category_id && "   font-medium "
                    )}  >{item.name}</span>
                    {index !== state.tree.length - 1 && <LuArrowRight />}
                </>
            })}
        </div> : undefined}
        containerClassName='p-0 md:p-0 md:ps-6'
    >
        <ProductEditorForm id={Number(id)} onLoad={setState} onSuccess={() => { }} onCancel={() => {
            navigate('/product-management/products');
        }} />
    </AppPage>)
}
