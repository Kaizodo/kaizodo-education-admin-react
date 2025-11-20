export const YesNoArray = [
    { id: 0, name: 'No' },
    { id: 1, name: 'Yes' }
];

export const PriorityArray = [
    { id: 0, name: 'Low' },
    { id: 1, name: 'Medium' },
    { id: 2, name: 'High' }
];

export const ModeArray = [
    { id: 0, name: 'Online' },
    { id: 1, name: 'In Person' },
];

export const AttendanceArray = [
    { id: 0, name: 'Absent' },
    { id: 1, name: 'Present' },
    { id: 2, name: 'Late' },
];

export const ExamAttendanceArray = [
    { id: 1, name: 'Present' },
    { id: 0, name: 'Absent' },
]

export enum DiscountBy {
    Amount = 0,
    Percentage = 1
}

export const DiscountByArray = [
    { id: DiscountBy.Amount, name: 'Fixed Amount' },
    { id: DiscountBy.Percentage, name: 'Percentage' }
];


export const getDiscountByName = (by: DiscountBy) => {
    return DiscountByArray.find(db => db.id == by)?.name ?? 'Unknown';
}


export enum DiscountType {
    OrderValue = 0,
    Product = 1,
    ProductCategory = 2
}
export const DiscountTypeArray = [
    { id: DiscountType.OrderValue, name: 'Order Value' },
    { id: DiscountType.Product, name: 'Specific Products' },
    { id: DiscountType.ProductCategory, name: 'Product Category' },
];


export const getDiscountTypeName = (type: DiscountType) => {
    return DiscountTypeArray.find(dt => dt.id == type)?.name ?? 'Unknown';
}


export function calculateDiscount(pricing: {
    id: number,
    price: number,
    duration_days: number,
    popular: number
}[]) {
    // Filter valid numeric pricing
    const validPricing = pricing
        .map(p => ({
            ...p,
            price: Number(p.price),
            duration_days: Number(p.duration_days)
        }))
        .filter(p => !isNaN(p.price) && !isNaN(p.duration_days) && p.price > 0 && p.duration_days > 0)
        .sort((a, b) => a.duration_days - b.duration_days);

    if (!validPricing.length) return [];

    const basePlan = validPricing[0];

    return validPricing.map(p => {
        let discount = 0;
        if (p.id !== basePlan.id) {
            const baseTotal = basePlan.price * (p.duration_days / basePlan.duration_days);
            discount = baseTotal > 0 ? ((baseTotal - p.price) / baseTotal) * 100 : 0;
        }
        return { ...p, discount: Number(discount.toFixed(1)) };
    });
}
