export type SalaryComponentType = {
    id: number;
    name: string;
    selected?: number;
    amount?: number;
    calculated_amount?: number;
    is_deduction_type: number;
    taxable: number;
    sort_order: number;
    percentage: number;
    updated_percentage?: number;
    component_ids: number[]
}


