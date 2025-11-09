import { UserQuotaCodeEnum, UserQuotaTypeEnum } from "./Subscription";

export type UserOrderEvent = {
    id: number,
    user_order_id: number,
    status: UserOrderStatus,
    created_at: string
}

export type UserOrder = {
    id: number;
    user_id: string;
    user_order_id: number,
    is_renewed: number,
    can_renew: number,
    amount: string;
    status: UserOrderStatus;
    payment_datetime: string | null;
    internal_reference_number: string;
    created_at: string;
    updated_at: string;
    items: UserOrderItem[]
    events: UserOrderEvent[]
};

export type UserQuota = {
    id: number;
    active: number;
    user_id: number;
    user_order_id: number;
    code: UserQuotaCodeEnum;
    total: number;
    used: number;
    valid_from?: string;
    valid_to?: string;
    remaining: number;
    quota_type: UserQuotaTypeEnum;
    created_at: string;
    updated_at?: string;
}


export type UserOrderItem = {
    id: number;
    user_order_item_type: UserQuotaCodeEnum.IR_SubscriptionPlan | UserQuotaCodeEnum.IR_TopupPlan,
    internal_reference_number: string,
    topup_type: UserQuotaCodeEnum,
    name: string;
    description: string;
    subscription_plan_id: number;
    subscription_plan_price_id: number;
    discount_plan_id: number | null;
    discount_percentage: number;
    discount_amount: number;
    duration_days: number;
    price: number;
    subtotal: number;
    total: number;
    quantity: number;
    quota: number;
    valid_from: string;
    user_quota?: UserQuota,
    features: {
        id: number,
        text: string
    }[],
    valid_to: string;
}


export enum UserOrderStatus {
    Pending = 0,
    Purchased = 1,
    Failed = 2,
    CancelledByUser = 3,
    CancelledByPlatform = 4,
    PendingBillingSetup = 5,
    PendingOrganizationSetup = 6,
    ReadyForDeployment = 7,
    ManagerAssigned = 8,
    TeamAssigned = 9,
    DeploymentPhase = 10,
    Active = 11
}

export const UserOrderStatusArray = [
    { status: UserOrderStatus.Pending, name: "Pending", description: "Awaiting payment confirmation", bg: "bg-yellow-100", fg: "text-yellow-700" },
    { status: UserOrderStatus.Purchased, name: "Purchased", description: "Payment successful", bg: "bg-green-100", fg: "text-green-700" },
    { status: UserOrderStatus.Failed, name: "Failed", description: "Payment failed", bg: "bg-red-100", fg: "text-red-700" },
    { status: UserOrderStatus.CancelledByUser, name: "Cancelled by User", description: "User cancelled the order", bg: "bg-gray-200", fg: "text-gray-800" },
    { status: UserOrderStatus.CancelledByPlatform, name: "Cancelled by Platform", description: "Platform auto-cancelled / expired", bg: "bg-gray-200", fg: "text-gray-800" },
    { status: UserOrderStatus.PendingBillingSetup, name: "Pending Billing Setup", description: "Billing configuration pending", bg: "bg-blue-100", fg: "text-blue-700" },
    { status: UserOrderStatus.PendingOrganizationSetup, name: "Pending Org Setup", description: "Organization setup required", bg: "bg-blue-100", fg: "text-blue-700" },
    { status: UserOrderStatus.ReadyForDeployment, name: "Ready for Deployment", description: "Deployment can begin", bg: "bg-green-100", fg: "text-green-700" },
    { status: UserOrderStatus.ManagerAssigned, name: "Manager Assigned", description: "Deployment manager assigned", bg: "bg-indigo-100", fg: "text-indigo-700" },
    { status: UserOrderStatus.TeamAssigned, name: "Team Assigned", description: "Deployment team assigned", bg: "bg-indigo-100", fg: "text-indigo-700" },
    { status: UserOrderStatus.DeploymentPhase, name: "Deployment Phase", description: "Deployment in progress", bg: "bg-purple-100", fg: "text-purple-700" }
];

export function getUserOrderStatusMeta(status: UserOrderStatus) {
    return UserOrderStatusArray.find(s => s.status === status)!;
}