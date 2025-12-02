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
    Service = 1,
    Both = 2
}
export const ProductTypeArray = [
    { id: ProductType.Goods, name: "Goods" },
    { id: ProductType.Service, name: "Service" },
    { id: ProductType.Both, name: 'Goods & Services' }
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
    expiry_date: string,
    country_name: string,
    image: string,
    mrp: number,
    sp: number,
    cp: number,
    duration_days: number,
    popular: number,
    quantity: number,
    sku: string
    barcode: string
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
    product_warranties: ProductWarranty[],
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


export const enum ProductWarrantyType {
    Manufacturer = 0,
    Seller = 1
}

export const ProductWarrantyTypeArray = [
    { id: ProductWarrantyType.Manufacturer, name: "Manufacturer", description: "Warranty provided by manufacturer" },
    { id: ProductWarrantyType.Seller, name: "Seller", description: "Warranty provided by seller" },
]



export const enum ProductWarrantyServiceType {
    OnSite = 0,
    ServiceCenter = 1,
    PickupAndDrop = 2
}

export const ProductWarrantyServiceTypeArray = [
    { id: ProductWarrantyServiceType.OnSite, name: "Onsite", description: "Technician visits customer location" },
    { id: ProductWarrantyServiceType.ServiceCenter, name: "Service Center", description: "Customer must visit service center" },
    { id: ProductWarrantyServiceType.PickupAndDrop, name: "Pickup & Drop", description: "Product will be picked up and returned" },
]



export const enum ProductWarrantyStartType {
    InvoiceDate = 0,
    DeliveryDate = 1,
    InstallationDate = 2,
    Register = 3
}


export const ProductWarrantyStartTypeArray = [
    { id: ProductWarrantyStartType.InvoiceDate, name: "Invoice Date", description: "Warranty starts on invoice date" },
    { id: ProductWarrantyStartType.DeliveryDate, name: "Delivery Date", description: "Warranty starts on delivery" },
    { id: ProductWarrantyStartType.InstallationDate, name: "Installation Date", description: "Warranty starts on installation" },
    { id: ProductWarrantyStartType.Register, name: "On Registration", description: "Customer will register product to start warrenty" },
]


export function getProductWarrantyTypeName(type: ProductWarrantyType) {
    const item = ProductWarrantyTypeArray.find(x => x.id === type)
    return item?.name ?? ""
}

export type ProductWarranty = {
    id: number,
    product_id: number,
    name: string
    duration_days: number
    coverage: string
    warranty_type: ProductWarrantyType
    service_type: ProductWarrantyServiceType
    start_type: ProductWarrantyStartType
}