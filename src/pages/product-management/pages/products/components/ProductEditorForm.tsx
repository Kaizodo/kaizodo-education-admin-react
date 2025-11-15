import { useEffect, useState } from "react";
import HighlightInput from "./HighlightInput";
import SectionNavigator, { NavigatorSection } from "@/components/common/SectionNavigator";
import { BsImages, BsInfo, BsListStars } from "react-icons/bs";
import { ProductService } from "@/services/ProductService";
import CenterLoading from "@/components/common/CenterLoading";
import { useForm } from "@/hooks/use-form";
import { SetValueType } from "@/hooks/use-set-value";
import ProductBasicInformation from "./ProductBasicInformation";
import { CategoryTree } from "../../product-categories/ProductCategoryListing";
import ProductPricingInformation from "./ProductPricingInformation";
import { TbTransactionRupee } from "react-icons/tb";
import ProductMediaInformation from "./ProductMediaInformation";
import { MediaType } from "@/components/common/media-manager/media";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import ProductFeatureInformation from "./ProductFeatureInformation";
interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
    onLoad?: (state: ProductState) => void
}

export type ProductPrice = {
    id: number,
    product_id: number,
    tax_code_id: number,
    tax_code_name: string,
    country_id: number,
    country_name: string,
    mrp: number,
    sp: number,
    cp: number,
    duration_days: number
}

export type ProductMedia = {
    id: number,
    product_id: number,
    media_path: string,
    media_name: string,
    media_type: MediaType,
    featured: number,
    featuring?: boolean,
    deleting?: boolean
}

export type FeatureInputType = 'text' | 'number' | 'boolean' | 'richtext' | 'image';

export type FeatureGroup = {
    id: number,
    name: string,
    description: string
}

export type Feature = {
    id: number,
    feature_group_id: number,
    name: string,
    description: string,
    input_type: FeatureInputType
}

export type ProductState = {
    product: any,
    media: ProductMedia[],
    prices: ProductPrice[],
    tree: CategoryTree[],
    features: Feature[],
    feature_groups: FeatureGroup[],
    product_features: {
        feature_id: number,
        feature_value: any
    }[],
    country_id: number,
    country_name: string,
    state_id: number,
    state_name: string
}

export type CommonProductStateProps = {
    state: ProductState,
    setState: (state: ProductState) => void
    setStateValue: SetValueType
}

export default function ProductEditorForm({ id, onLoad, onCancel }: Props) {

    const [loading, setLoading] = useState(true);
    const [state, setValue, setState] = useForm<ProductState>()



    const load = async () => {
        if (!id) {
            onCancel();
            return;
        }
        var r = await ProductService.detail(Number(id));
        if (r.success) {
            setState(r.data);
            setLoading(false);
            onLoad?.(r.data);
        } else {
            onCancel();
        }
    }

    useEffect(() => {
        if (state) {
            onLoad?.(state);
        }
    }, [state])

    useEffect(() => {
        load();
    }, [id])



    if (loading || !state) {
        return <CenterLoading className="relative h-[500px]" />;
    }

    return (<SectionNavigator menuItems={[
        { id: 'basic', title: 'Basic Information', subtitle: 'Enter basic information', icon: BsInfo },
        { id: 'pricing', title: 'Pricing', subtitle: 'Provide procing', icon: TbTransactionRupee },
        { id: 'media', title: 'Images & Media', subtitle: 'Provide images', icon: BsImages },
        { id: 'highlights', title: 'Highlights', subtitle: 'Provide images', icon: BsListStars },
        { id: 'features', title: 'Features & Attributes', subtitle: 'Features & Attributes', icon: IoExtensionPuzzleOutline }
    ]}>
        <NavigatorSection
            id="basic"
            icon={BsInfo}
            title="Product Information"
            subtitle="Easily input essential details like name, price, and more to showcase your product."
        >
            <ProductBasicInformation state={state} setState={setState} setStateValue={setValue} />


        </NavigatorSection>
        <NavigatorSection
            id="pricing"
            icon={TbTransactionRupee}
            title="Product Pricing & Variants"
            subtitle="Upload attractive photos of produts"
            className="p-0"
        >
            <ProductPricingInformation state={state} setState={setState} setStateValue={setValue} />
        </NavigatorSection>

        <NavigatorSection
            id="media"
            icon={BsImages}
            title="Product Images"
            subtitle="Upload attractive photos of produts"
        >

            <ProductMediaInformation state={state} setState={setState} setStateValue={setValue} />



        </NavigatorSection>
        <NavigatorSection
            id="highlights"
            icon={BsListStars}
            title="Product Highlights"
            subtitle="Upload attractive photos of produts"
        >
            <div className="px-3">
                <HighlightInput features={state.product.features ?? []} setValue={setValue} product_id={state.product.id} />
            </div>
        </NavigatorSection>
        <NavigatorSection
            id="features"
            icon={IoExtensionPuzzleOutline}
            title="Features & Attributes"
            subtitle="Upload attractive photos of produts"
        >
            <ProductFeatureInformation state={state} setState={setState} setStateValue={setValue} />
        </NavigatorSection>

    </SectionNavigator>)
}
