import { MediaType } from "@/components/common/media-manager/media";
import { SetValueType } from "@/hooks/use-set-value";

export const enum ProductPaymentType {
    OneTime = 0,
    Recurring = 1
}

export const ProductPaymentTypeArray = [
    { id: ProductPaymentType.OneTime, name: "One Time" },
    { id: ProductPaymentType.Recurring, name: "Recurring" },
];

export function getProductPaymentTypeName(id: number) {
    return ProductPaymentTypeArray.find(x => x.id === id)?.name || "";
}


export const enum ProductType {
    Goods = 0,
    Service = 1
}
export const ProductTypeArray = [
    { id: ProductType.Goods, name: "Goods" },
    { id: ProductType.Service, name: "Service" }
];

export function getProductTypeName(id: ProductType): string {
    const item = ProductTypeArray.find(x => x.id === id);
    return item ? item.name : "Not Specificed";
}


export const enum VariantType {
    Custom = 0,
    Color = 1,
    Image = 2
}


export type Product = any & {
    prices: ProductPrice[]
}

export type ProductVariant = {
    id: number,
    product_variant_group_id: number,
    product_variant_group_name: string,
    new_group_mode?: string,
    product_id: number,
    product_name: string,
    media: ProductMedia,
    variant_value: any
}

export type ProductVariantGroup = {
    id: number,
    variant_type: VariantType,
    name: string
}

export type ProductPrice = {
    id: number,
    product_id: number,
    tax_code_id: number,
    tax_code_name: string,
    country_id: number,
    country_name: string,
    image: string,
    mrp: number,
    sp: number,
    cp: number,
    duration_days: number,
    popular: number
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

export type Module = {
    id: number,
    name: string,
    description: string
}

export type ModuleFeature = {
    id: number,
    module_id: number,
    name: string,
    description: string
}

export type ProductModuleFeature = {
    product_id: number,
    module_id: number,
    module_feature_id: number
}

export type CategoryTree = {
    id: number,
    name: string,
    product_category_id: number,
    root_id: number
}

export type ProductPhase = {
    id: number,
    name: string,
    description: string
}

export type ProductMarketingMaterial = {
    id: number,
    marketing_material_category_id: number,
    media_path: string,
    media_name: string,
    message: string,
}

export type ProductState = {
    product: Product,
    media: ProductMedia[],
    prices: ProductPrice[],
    tree: CategoryTree[],
    features: Feature[],
    feature_groups: FeatureGroup[],
    product_features: {
        feature_id: number,
        feature_value: any
    }[],
    modules: Module[],
    module_features: ModuleFeature[],
    product_module_features: ProductModuleFeature[],
    product_variants: ProductVariant[],
    product_variant_groups: ProductVariantGroup[],
    product_marketing_materials: ProductMarketingMaterial[],
    product_addons: Product[],
    product_phases: ProductPhase[],
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