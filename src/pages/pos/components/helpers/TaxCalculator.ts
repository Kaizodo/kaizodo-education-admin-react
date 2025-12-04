import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Set vfs
pdfMake.vfs = pdfFonts.vfs;

export type TaxRate = {
    id: number;
    tax_code_id: number;
    tax_component_id: number;
    percentage: string;
    state_id: number | null;
    tax_group: number;
    tax_component_name: string;
};

export type PriceType = {
    mrp: string;
    sp: string;
    cp: string;
};

export type ProductItem = {
    id?: number;
    name?: string;
    product_id?: number;
    product_price_id?: number;
    quantity?: number;
    price?: PriceType | null;
    tax_code?: { tax_code_rates?: TaxRate[] | null } | null;
    product?: { product_category_id?: number | null, name: string, sac: string, hsn: string };
};

export type DiscountPlanApplication = {
    id: number;
    discount_plan_id: number;
    product_price_id: number | null;
    product_category_id: number | null;
    discount_type: number;
    created_at: string;
    updated_at: string | null;
};

export type DiscountPlan = {
    id: number;
    min_amount: string;
    max_amount: string;
    discount_percentage: string;
    discount_amount: string;
    discount_by: number;
    discount_type: number;
    discount_plan_applications: DiscountPlanApplication[];
};

export type OrderInput = {
    state_id?: number | null;
    products?: ProductItem[] | null;
    discount_plan?: DiscountPlan | null;
};

export type TaxBreakout = {
    tax_component_id: number;
    tax_component_name: string;
    percentage: number;
    amount: number;
};

export type ProductCalc = {
    id: number;
    name: string,
    sac: string,
    hsn: string,
    product_id: number;
    product_price_id: number;
    base: number;
    original_base: number;
    tax: number;
    taxable: number;
    total: number;
    original_total: number;
    discount: number;
    taxable_discount: number;
    mrp_discount: number;
    savings: number;
    discount_percentage: number;
    quantity: number;
    taxes: TaxBreakout[];
};

export type GroupedTaxItem = {
    tax_component_id: number;
    tax_component_name: string;
    percentage: number;
    value: number;
};

export type OrderTotals = {
    base: number;
    original_base: number;
    tax: number;
    taxable: number;
    total: number;
    original_total: number;
    discount: number;
    taxable_discount: number;
    mrp_discount: number;
    savings: number;
    discount_percentage: number;
};

// HELPERS
const to_num = (v: any) => Number(v || 0);

const reverse_tax = (price: number, rates: TaxRate[]) => {
    const total_percentage = rates.reduce(
        (s, r) => s + to_num(r.percentage),
        0
    );
    const base = price / (1 + total_percentage / 100);
    const taxes = rates.map(r => ({
        tax_component_id: r.tax_component_id,
        tax_component_name: r.tax_component_name,
        percentage: to_num(r.percentage),
        amount: base * (to_num(r.percentage) / 100)
    }));
    const tax = taxes.reduce((s, t) => s + t.amount, 0);
    return { base, taxes, tax };
};

// MAIN
export function calculateOrder(order: OrderInput) {
    const state_id = order.state_id ?? null;
    const unique_tax_components: {
        tax_component_id: number;
        tax_component_name: string;
    }[] = [];
    const unique_map: Record<number, boolean> = {};
    const product_calcs: ProductCalc[] = [];
    const grouped_tax_map: Record<string, GroupedTaxItem> = {};
    const order_totals: OrderTotals = {
        base: 0,
        original_base: 0,
        tax: 0,
        taxable: 0,
        total: 0,
        original_total: 0,
        discount: 0,
        taxable_discount: 0,
        mrp_discount: 0,
        savings: 0,
        discount_percentage: 0
    };
    const product_list = order.products ?? [];
    for (let i = 0; i < product_list.length; i++) {
        const p = product_list[i];
        const quantity = to_num(p.quantity);
        const sp_value = p.price?.sp ?? "0";
        const price = to_num(sp_value);
        const mrp_value = to_num(p.price?.mrp ?? "0");
        const original_mrp_total = mrp_value * quantity;
        const original_sp_total = price * quantity;
        const mrp_discount_amount = original_mrp_total - original_sp_total;
        const all_rates = p.tax_code?.tax_code_rates ?? [];
        // STATE / COMMON TAX LOGIC
        const state_rates = all_rates.filter(
            r => r.tax_group === 1 && r.state_id === state_id
        );
        const final_rates =
            state_rates.length > 0
                ? state_rates
                : all_rates.filter(r => r.tax_group === 0);
        // Unique components tracking
        for (const r of final_rates) {
            if (!unique_map[r.tax_component_id]) {
                unique_map[r.tax_component_id] = true;
                unique_tax_components.push({
                    tax_component_id: r.tax_component_id,
                    tax_component_name: r.tax_component_name
                });
            }
        }
        const rev = reverse_tax(price, final_rates);
        const base = rev.base * quantity;
        const tax = rev.tax * quantity;
        const total = price * quantity;
        const taxable = base;
        // GROUPED TAX AGGREGATION
        for (const t of rev.taxes) {
            const key = `${t.tax_component_id}-${t.percentage}`;
            if (!grouped_tax_map[key]) {
                grouped_tax_map[key] = {
                    tax_component_id: t.tax_component_id,
                    tax_component_name: t.tax_component_name,
                    percentage: t.percentage,
                    value: 0
                };
            }
            grouped_tax_map[key].value += t.amount * quantity;
        }
        order_totals.base += base;
        order_totals.tax += tax;
        order_totals.taxable += taxable;
        order_totals.total += total;
        order_totals.mrp_discount += mrp_discount_amount;
        order_totals.savings += mrp_discount_amount;
        // PRODUCT CALC PER UNIQUE ROW (p.id)
        product_calcs.push({
            id: p.id ?? 0,
            name: p?.name ?? p?.product?.name ?? '',
            sac: p?.product?.sac ?? '',
            hsn: p?.product?.hsn ?? '',
            quantity: p.quantity ?? 1,
            product_id: p.product_id ?? 0,
            product_price_id: p.product_price_id ?? 0,
            base,
            original_base: base,
            discount: 0,
            taxable_discount: 0,
            mrp_discount: mrp_discount_amount,
            savings: mrp_discount_amount,
            discount_percentage: 0,
            tax,
            taxable,
            total,
            original_total: original_sp_total,
            taxes: rev.taxes.map(t => ({
                tax_component_id: t.tax_component_id,
                tax_component_name: t.tax_component_name,
                percentage: t.percentage,
                amount: t.amount * quantity
            }))
        });
    }
    order_totals.original_base = order_totals.base;
    order_totals.original_total = order_totals.total;
    if (order.discount_plan) {
        const dp = order.discount_plan;
        const discount_by = dp.discount_by;
        const disc_perc = to_num(dp.discount_percentage);
        const disc_amt = to_num(dp.discount_amount);
        const dtype = dp.discount_type;
        const original_total_base = order_totals.original_base;
        if (dtype === 0) {
            // OrderValue
            const min_a = to_num(dp.min_amount);
            const max_a = to_num(dp.max_amount);
            if (original_total_base >= min_a && original_total_base <= max_a) {
                let total_disc = 0;
                if (discount_by === 0) {
                    total_disc = Math.min(disc_amt, original_total_base);
                } else {
                    total_disc = original_total_base * disc_perc / 100;
                }
                for (const pc of product_calcs) {
                    if (pc.original_base === 0) continue;
                    const disc = (pc.original_base / original_total_base) * total_disc;
                    pc.taxable_discount = disc;
                    pc.discount_percentage = pc.original_base > 0 ? (disc / pc.original_base) * 100 : 0;
                    const discounted_base = Math.max(0, pc.original_base - disc);
                    const ratio = pc.original_base > 0 ? discounted_base / pc.original_base : 0;
                    pc.base = discounted_base;
                    pc.tax *= ratio;
                    pc.total = pc.base + pc.tax;
                    pc.discount = pc.original_total - pc.total;
                    pc.savings = pc.mrp_discount + pc.discount;
                    for (const t of pc.taxes) {
                        t.amount *= ratio;
                    }
                }
                order_totals.taxable_discount = total_disc;
                order_totals.discount_percentage = original_total_base > 0 ? (total_disc / original_total_base) * 100 : 0;
            }
        } else {
            // Product or ProductCategory
            const applicable_price_ids = new Set<number>();
            const applicable_cats = new Set<number>();
            for (const app of dp.discount_plan_applications) {
                if (app.product_category_id !== null) {
                    applicable_cats.add(app.product_category_id);
                } else if (app.product_price_id !== null) {
                    applicable_price_ids.add(app.product_price_id);
                }
            }
            for (let i = 0; i < product_calcs.length; i++) {
                const pc = product_calcs[i];
                const p = product_list[i];
                let matches = false;
                if (dtype === 1) {
                    if (p.product_price_id && applicable_price_ids.has(p.product_price_id)) {
                        matches = true;
                    }
                } else if (dtype === 2) {
                    const cat_id = p.product?.product_category_id ?? null;
                    if (cat_id !== null && applicable_cats.has(cat_id)) {
                        matches = true;
                    }
                }
                if (matches) {
                    const qty = to_num(p.quantity);
                    const base_per_unit = pc.base / qty;
                    let disc_per_unit = 0;
                    if (discount_by === 0) {
                        disc_per_unit = Math.min(disc_amt, base_per_unit);
                    } else {
                        disc_per_unit = base_per_unit * disc_perc / 100;
                    }
                    const disc_total = disc_per_unit * qty;
                    pc.taxable_discount = disc_total;
                    pc.discount_percentage = pc.original_base > 0 ? (disc_total / pc.original_base) * 100 : 0;
                    const discounted_base = Math.max(0, pc.base - disc_total);
                    const ratio = pc.base > 0 ? discounted_base / pc.base : 0;
                    pc.base = discounted_base;
                    pc.tax *= ratio;
                    pc.total = pc.base + pc.tax;
                    pc.discount = pc.original_total - pc.total;
                    pc.savings = pc.mrp_discount + pc.discount;
                    for (const t of pc.taxes) {
                        t.amount *= ratio;
                    }
                }
            }
            order_totals.taxable_discount = product_calcs.reduce((s, pc) => s + pc.taxable_discount, 0);
            order_totals.discount_percentage = original_total_base > 0 ? (order_totals.taxable_discount / original_total_base) * 100 : 0;
        }
        // Recompute totals
        order_totals.base = product_calcs.reduce((s, pc) => s + pc.base, 0);
        order_totals.tax = product_calcs.reduce((s, pc) => s + pc.tax, 0);
        order_totals.total = product_calcs.reduce((s, pc) => s + pc.total, 0);
        order_totals.taxable = order_totals.base;
        order_totals.discount = order_totals.original_total - order_totals.total;
        order_totals.savings = order_totals.mrp_discount + order_totals.discount;
        // Recompute grouped taxes
        const new_grouped_tax_map: Record<string, GroupedTaxItem> = {};
        for (const pc of product_calcs) {
            for (const t of pc.taxes) {
                const key = `${t.tax_component_id}-${t.percentage}`;
                if (!new_grouped_tax_map[key]) {
                    new_grouped_tax_map[key] = {
                        tax_component_id: t.tax_component_id,
                        tax_component_name: t.tax_component_name,
                        percentage: t.percentage,
                        value: 0
                    };
                }
                new_grouped_tax_map[key].value += t.amount;
            }
        }
        Object.assign(grouped_tax_map, new_grouped_tax_map);
    }
    return {
        unique_tax_components,
        product_calcs,
        grouped_taxes: Object.values(grouped_tax_map),
        order_totals
    };
}