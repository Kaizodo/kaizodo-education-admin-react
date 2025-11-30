import { UserOrderIssueSource, UserOrderIssueType } from "./order";
import { Shipment } from "./Shipment";
import { Party } from "./UserOrder";

export interface OrderIssueDetailState {
    user_order_issue: UserOrderIssue;
    user_order_issue_items: UserOrderIssueItem[];
    user_order_issue_item_taxes: UserOrderIssueItemTax[],
    buyer_party: Party,
    seller_party: Party,
    shipments: Shipment[]
}

interface UserOrderIssue {
    id: number;
    package_type: number;
    user_id: string;
    delivery_agent_user_id: string;
    cancellation_universal_category_id: number;
    organization_id: number;
    internal_reference_number: string;
    is_approved: number;
    is_pickup_scheduled: number;
    organization_order_id: number | null;
    issue_type: UserOrderIssueType,
    issue_source: UserOrderIssueSource,
    user_order_id: number;
    status: number;
    tracking_number: string;
    pickup_datetime: string;
    dispatch_datetime: string;
    remarks: string;
    pickup_remarks: string;
    approval_remarks: string;
    is_items_received: number;
    receiving_remarks: string;
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

interface UserOrderIssueItem {
    id: number;
    organization_id: number;
    shipment_id: number;
    user_order_item_id: number;
    image: string;
    exchange_product_image: string;
    exchange_product_name: string;
    exchange_product_sku: string;
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



export type UserOrderIssueItemTax = {
    id: number;
    user_order_issue_id: number;
    user_order_issue_item_id: number;
    tax_component_id: number;
    user_id: number;
    name: string;
    percentage: number;
    amount: number;
}