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