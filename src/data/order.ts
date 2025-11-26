import { UserQuotaCodeEnum, UserQuotaTypeEnum } from "./Subscription";
import { User } from "./user";

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
    currency_symbol: string,
    currency_code: string,
    currency_name: string,
    country_image: string,
    country_name: string,
    status: UserOrderStatus;
    payment_datetime: string | null;
    internal_reference_number: string;
    created_at: string;
    updated_at: string;
    user: User,
    items_count: number,
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






export const enum UserOrderIssueSource {
    Customer = 0,
    Seller = 1,
    Delivery = 2
}



export const UserOrderIssueSourceArray = [
    { id: UserOrderIssueSource.Customer, name: "Customer", description: "Issue raised by customer" },
    { id: UserOrderIssueSource.Seller, name: "Seller", description: "Issue created by seller" },
    { id: UserOrderIssueSource.Delivery, name: "Delivery", description: "Issue caused during delivery" }
];

export function getUserOrderIssueSourceName(id: number) {
    const f = UserOrderIssueSourceArray.find(x => x.id === id);
    return f?.name || "";
}

export const enum UserOrderIssueType {
    Cancellation = 0,
    Return = 1,
    Replacement = 2
}


export const UserOrderIssueTypeArray = [
    { id: UserOrderIssueType.Cancellation, name: "Cancellation", description: "Order cancelled" },
    { id: UserOrderIssueType.Return, name: "Return", description: "Order returned" },
    { id: UserOrderIssueType.Replacement, name: "Replacement", description: "Order replacement requested" }
];



export function getUserOrderIssueTypeName(id: number) {
    const f = UserOrderIssueTypeArray.find(x => x.id === id);
    return f?.name || "";
}


export enum UserOrderIssueStatus {
    New = 0,
    PendingApproval = 1,
    Approved = 2,
    Rejected = 3,
    PickupScheduled = 4,
    PickedUp = 5,
    InInspection = 6,
    Refunded = 7,
    ReplacementShipped = 8,
    Completed = 9
}

export const UserOrderIssueStatusArray = [
    { id: UserOrderIssueStatus.New, name: "New", description: "Issue created" },
    { id: UserOrderIssueStatus.PendingApproval, name: "Pending Approval", description: "Awaiting approval" },
    { id: UserOrderIssueStatus.Approved, name: "Approved", description: "Issue approved" },
    { id: UserOrderIssueStatus.Rejected, name: "Rejected", description: "Issue rejected" },
    { id: UserOrderIssueStatus.PickupScheduled, name: "Pickup Scheduled", description: "Pickup arranged" },
    { id: UserOrderIssueStatus.PickedUp, name: "Picked Up", description: "Item collected" },
    { id: UserOrderIssueStatus.InInspection, name: "In Inspection", description: "Item under inspection" },
    { id: UserOrderIssueStatus.Refunded, name: "Refunded", description: "Refund processed" },
    { id: UserOrderIssueStatus.ReplacementShipped, name: "Replacement Shipped", description: "Replacement item shipped" },
    { id: UserOrderIssueStatus.Completed, name: "Completed", description: "Issue resolved" }
];


export enum UserOrderStatus {
    New = 0,
    Pending = 1,
    Purchased = 2,
    Failed = 3,

    Processing = 4,
    ProcessingCompleted = 5,
    MatchedStock = 6,
    Picked = 7,
    LabelAndInvoicePrinted = 8,
    Packaged = 9,

    ReadyForShipment = 10,
    Dispatched = 11,
    Transit = 12,
    Location = 13,
    ReachedNearestHub = 14,
    OutForDelivery = 15,
    DeliveryAttempted = 16,
    DeliveryFailed = 17,
    Delivered = 18,
    DeliveryRescheduled = 19,

    Cancelled = 20,
    CancelledByUser = 21,
    CancelledByPlatform = 22,
    CancelledItemsReturned = 23,

    PendingBillingSetup = 24,
    PendingOrganizationSetup = 25,
    ReadyForDeployment = 26,
    ManagerAssigned = 27,
    TeamAssigned = 28,
    DeploymentPhase = 29,
    Active = 30
}




export const UserOrderStatusArray = [
    { id: UserOrderStatus.New, name: "New", description: "Order created", bg: "bg-yellow-100", fg: "text-yellow-700" },
    { id: UserOrderStatus.Pending, name: "Pending", description: "Awaiting payment confirmation", bg: "bg-yellow-100", fg: "text-yellow-700" },

    { id: UserOrderStatus.Purchased, name: "Purchased", description: "Payment successful", bg: "bg-green-100", fg: "text-green-700" },
    { id: UserOrderStatus.Failed, name: "Failed", description: "Payment failed", bg: "bg-red-100", fg: "text-red-700" },

    { id: UserOrderStatus.Processing, name: "Processing", description: "Order processing started", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.ProcessingCompleted, name: "Processed", description: "Order processing completed", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.MatchedStock, name: "Matched Stock", description: "Stock matched", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.Picked, name: "Items Picked", description: "Items picked from warehouse", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.LabelAndInvoicePrinted, name: "Label & Invoice Printed", description: "Documents printed", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.Packaged, name: "Packaged", description: "Packed and sealed", bg: "bg-blue-100", fg: "text-blue-700" },

    { id: UserOrderStatus.ReadyForShipment, name: "Ready for Shipment", description: "Ready for courier pickup", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.Dispatched, name: "Dispatched", description: "Handed over to courier", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.Transit, name: "In Transit", description: "Moving through courier network", bg: "bg-indigo-100", fg: "text-indigo-700" },
    { id: UserOrderStatus.Location, name: "Location Scanned", description: "Arrived at facility", bg: "bg-indigo-100", fg: "text-indigo-700" },
    { id: UserOrderStatus.ReachedNearestHub, name: "Reached Nearest Hub", description: "Reached delivery city hub", bg: "bg-indigo-100", fg: "text-indigo-700" },
    { id: UserOrderStatus.OutForDelivery, name: "Out for Delivery", description: "Courier is delivering", bg: "bg-orange-100", fg: "text-orange-700" },
    { id: UserOrderStatus.DeliveryAttempted, name: "Delivery Attempted", description: "Courier attempted delivery", bg: "bg-orange-100", fg: "text-orange-700" },
    { id: UserOrderStatus.DeliveryFailed, name: "Delivery Failed", description: "Delivery unsuccessful", bg: "bg-red-100", fg: "text-red-700" },
    { id: UserOrderStatus.Delivered, name: "Delivered", description: "Order delivered", bg: "bg-green-100", fg: "text-green-700" },
    { id: UserOrderStatus.DeliveryRescheduled, name: "Delivery Rescheduled", description: "Delivery rescheduled", bg: "bg-yellow-100", fg: "text-yellow-700" },

    { id: UserOrderStatus.Cancelled, name: "Cancelled", description: "Order cancelled", bg: "bg-gray-200", fg: "text-gray-800" },
    { id: UserOrderStatus.CancelledByUser, name: "Cancelled by User", description: "Customer cancelled", bg: "bg-gray-200", fg: "text-gray-800" },
    { id: UserOrderStatus.CancelledByPlatform, name: "Cancelled by Platform", description: "System cancelled", bg: "bg-gray-200", fg: "text-gray-800" },
    { id: UserOrderStatus.CancelledItemsReturned, name: "Cancelled Items Returned", description: "Cancelled items returned to seller", bg: "bg-green-100", fg: "text-green-700" },

    { id: UserOrderStatus.PendingBillingSetup, name: "Pending Billing Setup", description: "Billing setup required", bg: "bg-purple-100", fg: "text-purple-700" },
    { id: UserOrderStatus.PendingOrganizationSetup, name: "Pending Org Setup", description: "Organization setup required", bg: "bg-purple-100", fg: "text-purple-700" },
    { id: UserOrderStatus.ReadyForDeployment, name: "Ready for Deployment", description: "Deployment ready", bg: "bg-green-100", fg: "text-green-700" },
    { id: UserOrderStatus.ManagerAssigned, name: "Manager Assigned", description: "Manager assigned", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.TeamAssigned, name: "Team Assigned", description: "Team allocated", bg: "bg-blue-100", fg: "text-blue-700" },
    { id: UserOrderStatus.DeploymentPhase, name: "Deployment Phase", description: "Deployment in progress", bg: "bg-indigo-100", fg: "text-indigo-700" },
    { id: UserOrderStatus.Active, name: "Active", description: "Project active", bg: "bg-green-100", fg: "text-green-700" }
];


export function getUserOrderStatusMeta(status: UserOrderStatus) {
    return UserOrderStatusArray.find(s => s.id === status)!;
}


export const enum ShipmentPackageType {
    Individual = 0,
    Consolidated = 1,
}

export const ShipmentPackageTypeArray = [
    { id: ShipmentPackageType.Individual, name: "Individual", bg: "bg-yellow-100", fg: "text-yellow-700" },
    { id: ShipmentPackageType.Consolidated, name: "Consolidated", bg: "bg-green-100", fg: "text-green-700" },
];

export function getShipmentPackageTypeName(id: ShipmentPackageType) {
    return ShipmentPackageTypeArray.find(s => s.id === id)!;
}