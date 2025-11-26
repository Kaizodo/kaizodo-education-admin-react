export interface ShipmentDetailState {
    shipment: Shipment;
    shipment_items: ShipmentItem[];
    shipment_logs: ShipmentLog[];
    delivery_agent: DeliveryAgent;
    user_order_issues: UserOrderIssue[];
}

interface Shipment {
    id: number;
    package_type: number;
    user_id: string;
    delivery_agent_user_id: string;
    cancellation_universal_category_id: number;
    organization_id: number;
    internal_reference_number: string;
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

interface ShipmentItem {
    id: number;
    organization_id: number;
    shipment_id: number;
    user_order_item_id: number;
    name: string;
    barcode: string;
    code: string;
    sku: string;
    ean: string;
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
    unit_id: number;
    unit_name: string;
    mrp: string;
    sp: string;
    cp: string;
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

interface ShipmentLog {
    id: number;
    created_user_id: string;
    shipment_id: number;
    status: number;
    remarks: string;
    location: string;
    failure_universal_category_id: number | null;
    next_datetime: string;
    seller_only: number;
    created_at: string;
    updated_at: string;
    universal_category_name: string;
    universal_category_description: string;
}

interface DeliveryAgent {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    image: string;
}

interface UserOrderIssue {
    id: number;
    organization_id: number;
    created_by_user_id: string;
    issue_source: number;
    issue_type: number;
    issue_universal_category_id: number;
    user_order_id: number;
    shipment_id: number;
    status: number;
    internal_reference_number: string;
    created_at: string;
    updated_at: string;
    universal_category_name: string;
    universal_category_description: string;
}