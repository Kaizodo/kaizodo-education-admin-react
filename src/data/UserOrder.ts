import { UserOrderStatus } from "./order";
import { Organization } from "./Organization";
import { User } from "./user";

export type UserOrderItemStatus = {
    user_order_item_id: number,
    id: number,
    status: UserOrderItemStatus
}


export interface OrderDetailState {
    order: Order;
    order_items: UserOrderItem[];
    organizations: Organization[];
    orders: Order[];
    projects: Project[];
    shipments: Shipment[];
    user_order_item_statuses: UserOrderItemStatus[]
}


interface Order {
    id: number;
    currency_id: number;
    currency_name: string;
    currency_symbol: string;
    currency_code: string;
    payment_method: number;
    can_renew: number;
    is_renewed: number;
    user_id: string;
    user_order_id: number | null;
    discount_plan_id: number | null;
    discount_plan_code: string | null;
    amount: string;
    base: string;
    taxable: string;
    tax: string;
    discount: string;
    shipping: string;
    pg_order_id: string;
    pg_payment_id: string;
    status: number;
    payment_datetime: string;
    internal_reference_number: string;
    created_at: string;
    updated_at: string;
    name: string;
    email: string;
    mobile: string;
    organization_name: string;
    gst_number: string;
    address: string;
    country_id: number;
    state_id: number;
    pincode: string;
    country_name: string;
    country_image: string;
    first_name: string;
    last_name: string;
    image: string | null;
    state_name: string;
    events: any[];
}

export interface UserOrderItem {
    id: number;
    status: UserOrderStatus,
    organization_id: number;
    project_id: number | null;
    referrer_user_id: number | null;
    name: string;
    barcode: string | null;
    code: string;
    sku: string | null;
    ean: string | null;
    product_type: number;
    product_payment_type: number;
    product_category_id: number;
    product_category_name: string;
    features: any[];
    quota: string;
    duration_days: string;
    valid_from: string | null;
    valid_to: string | null;
    description: string;
    user_order_id: number;
    user_order_item_type: number;
    product_id: number;
    product_price_id: number;
    user_id: string;
    quantity: number;
    quantity_unlocked: number;
    selected_quantity?: number;
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
    sac: string | null;
    hsn: string | null;
    has_shipping: number;
    package_weight: string;
    package_length: string;
    package_width: string;
    package_height: string;
    is_fragile: number;
    shipping_charge: string;
    complimentary: number;
    has_referral: number;
    commission_percentage: string;
    has_commission_on_renewal: number;
    renewal_commission_percentage: string;
    referral_content: string | null;
    currency_id: number;
    currency_name: string;
    currency_symbol: string;
    currency_code: string;
    image: string;
}



export interface Project {
    id: number,
    internal_reference_number: string,
    deployment_manager_user_id: number | null;
    relationship_manager_user_id: number | null;
    is_deployment_manager_assigned: number;
    is_relationship_manager_assigned: number;
    project_user_ids: number[],
    is_team_assigned: number;
    is_ready_deployment: number;
    is_deployment_phase: number;
    is_deployment_completed: number;
    deployment_manager_assigned_datetime: string;
    relationship_manager_assigned_datetime: string;
    team_assigned_datetime: string;
    deployment_ready_datetime: string;
    deployment_phase_datetime: string;
    deployment_complete_datetime: string;
    users: User[],
    updated_at: string,
    created_at: string
}

interface Shipment {
    id: number;
    package_type: number;
    user_id: string;
    delivery_agent_user_id: number | null;
    cancellation_universal_category_id: number | null;
    organization_id: number;
    internal_reference_number: string;
    organization_order_id: number | null;
    user_order_id: number;
    status: number;
    tracking_number: string;
    pickup_datetime: string | null;
    dispatch_datetime: string | null;
    remarks: string;
    reference_number: string | null;
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
    updated_at: string | null;
    items: ShipmentItem[];
}

interface ShipmentItem {
    id: number;
    organization_id: number;
    shipment_id: number;
    user_order_item_id: number;
    name: string;
    barcode: string | null;
    code: string;
    sku: string | null;
    ean: string | null;
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
    sac: string | null;
    hsn: string | null;
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