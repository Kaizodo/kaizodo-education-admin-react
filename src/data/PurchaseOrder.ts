import { Party } from "./UserOrder";

export interface PurchaseOrderDetailState {
    receiving_remarks: string;
    receiving_number: string;
    purchase_order: PurchaseOrder;
    purchase_order_items: PurchaseOrderItem[];
    seller_party: Party
}

interface PurchaseOrder {
    id: number;
    package_type: number;
    is_received: boolean,
    user_id: string;
    delivery_agent_user_id: string;
    cancellation_universal_category_id: number;
    organization_id: number;
    internal_reference_number: string;
    received_at: string;
    receiving_number: string;
    receiving_remarks: string;
    organization_order_id: number | null;
    user_order_id: number;
    status: number;
    tracking_number: string;
    pickup_datetime: string;
    dispatch_datetime: string;
    remarks: string;
    reference_number: string;
    currency_symbol: string;
    amount: string;
    base: string;
    taxable: string;
    tax: string;
    discount: string;
    shipping: string;
    package_weight: string;
    package_length: string;
    package_width: string;
    package_height: string;
    created_at: string;
    updated_at: string;
    order_internal_reference_number: string;
    order_created_at: string;
}

interface PurchaseOrderItem {
    id: number;
    organization_id: number;
    shipment_id: number;
    country_id: number;
    tax_code_id: number;
    user_order_item_id: number;
    name: string;
    barcode: string;
    code: string;
    sku: string;
    sku_received: string;
    ean: string;
    is_received: boolean;

    product_type: number;
    product_payment_type: number;
    product_category_id: number;
    product_category_name: string;
    description: string;
    user_order_id: number;
    product_id: number;
    product_price_id: number;
    user_id: string;
    quantity: number;
    received_quantity: number;
    unit_id: number;
    unit_name: string;
    mrp: string;
    sp: string;
    cp: number;
    mrp_received: string;
    sp_received: string;
    cp_received: number;
    base: string;
    total_amount: string;
    discount_amount: number;
    discount_percentage: string;
    discount_plan_id: number | null;
    taxable: string;
    tax: string;
    sac: string;
    hsn: string;
    package_weight: string;
    package_length: string;
    package_width: string;
    package_height: string;
    is_fragile: number;
    shipping_charge: string;
    currency_id: number;
    currency_name: string;
    currency_symbol: string;
    currency_code: string;
}

