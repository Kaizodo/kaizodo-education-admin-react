import { PaymentMode } from "./Payment";

export enum FeeCategoryType {
    General = 0,
    Lumpsum = 1,
    Installment = 2
}

export const FeeCategoryTypeArray = [
    { id: FeeCategoryType.General, name: 'General' },
    { id: FeeCategoryType.Lumpsum, name: 'Lumpsum' },
    { id: FeeCategoryType.Installment, name: 'Installment' }
];

export function getFeeCategoryTypeName(type: FeeCategoryType): string {
    return FeeCategoryTypeArray.find(item => item.id === type)?.name ?? '';
}

export enum FeeCollectionFrequency {
    Monthly = 0,
    Quarterly = 1,
    Yearly = 2,
    OneTime = 3
}

export const FeeCollectionFrequencyArray = [
    { id: FeeCollectionFrequency.Monthly, name: 'Monthly' },
    { id: FeeCollectionFrequency.Quarterly, name: 'Quarterly' },
    { id: FeeCollectionFrequency.Yearly, name: 'Yearly' },
    { id: FeeCollectionFrequency.OneTime, name: 'One Time' },
];


export function getFeeCollectionFrequencyName(value: FeeCollectionFrequency): string {
    return FeeCollectionFrequencyArray.find(f => f.id === value)?.name || 'None';
}


export enum FeeCollectionStatus {
    Unpaid = 0,
    Partial = 1,
    Paid = 2
}


export function getFeeCollectionStatusName(status: FeeCollectionStatus) {
    switch (status) {
        case FeeCollectionStatus.Paid:
            return 'Paid'
        case FeeCollectionStatus.Partial:
            return 'Partial'
        case FeeCollectionStatus.Unpaid:
            return 'Unpaid'

        default:
            return 'Unknown'
    }
}

export type FeeCollection = {
    id: number;
    user_id: number;
    organization_id: number;
    fee_structure_id: number;
    fee_category_id: number;
    pickup_point_id: number;
    installment: number;
    user_item_issue_id: number;
    fee_special_id: number;
    collected_by_user_id: number;
    session_id: number;
    fee_invoice_id: number;
    amount: number;
    due_date: string;
    payment_mode: PaymentMode;
    payment_date: string;
    remarks: string;
    reference_number: string;
    internal_reference_number: string;
    balance: string;
}


export type PickupPointFee = {
    id: number;
    organization_id: number;
    name: string;
    route_id: number;
    distance: string;
    vehicle_id: number;
    amount: string;
    created_by_user_id: number;
    created_at: string;
    updated_at: string;
    deleted: string | null;
};

export type UserFeeCategory = {
    id: number;
    user_id: number;
    created_by_user_id: number;
    fee_category_id: number;
    frequency: number;
    collect: number;
}

export enum FeeScheduleTypeEnum {
    MonthlyFee = 0,
    SpecialFee = 1,
    Installment = 2,
    Library = 3,
    Fine = 4,
}

export const getFeeScheduleTypeName = (type: FeeScheduleTypeEnum): string => {
    switch (type) {
        case FeeScheduleTypeEnum.MonthlyFee: return 'Monthly Fee';
        case FeeScheduleTypeEnum.SpecialFee: return 'Special Fee';
        case FeeScheduleTypeEnum.Installment: return 'Installment';
        case FeeScheduleTypeEnum.Library: return 'Library Fine';
        case FeeScheduleTypeEnum.Fine: return 'Fine';
        default: return 'Unknown';
    }
};

export type UserFeeSchedule = {
    id: number;
    fee_schedule_type: FeeScheduleTypeEnum;
    user_id: number;
    fine_id: number;
    start_date: string;
    due_date: string;
    amount: number;
    fine_amount: number;
    paid_amount: number;
    discount_amount: number;
    balance: number;
    is_transport: number;
    fee_category_id: number;
    user_issue_item_id: number;
    session_id: number;
    organization_id: number;
    class_id: number;
    installment: number;
    date_from: string;
    date_to: string;
    fee_special_id: number;
    fee_structure_id: number;
    route_id: number;
    pickup_point_id: number;
    status: FeeCollectionStatus;
    user_item_issue_id: number,
    created_at: string;
    updated_at: string;
};

export interface FeeStructure {
    id: number;
    session_id: number;
    name: string;
    code: string;
    due_date: string;
    class_id: number;
    organization_id: number;
    deleted: number;
    total_amount: string;
    publish: number;
    created_at: string;
    updated_at: string;
    class_name: string;
    session_name: string;
    categories: FeeStructureCategory[]
}

export interface FeeStructureCategory {
    id: number;
    organization_id: number;
    fee_category_id: number;
    fee_structure_id: number;
    amount: number;
    due_date: string;
    created_at: string;
    updated_at: string;
}

export interface FeeCategory {
    id: number;
    organization_id: number;
    deleted: number;
    name: string;
    description: string;
    frequency: number;
    mandatory: number;
    amount: string;
    created_at: string;
    updated_at: string;
}

export interface Session {
    id: number;
    organization_id: number;
    name: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    deleted: number;
}

export interface FeeData {
    fee_structures: FeeStructure[];
    fee_structure_categories: FeeStructureCategory[];
    fee_categories: FeeCategory[];
    sessions: Session[];
}


export type FineSlabType = {
    id: number,
    overdue_count: number,
    amount: number
}

export type FeeFine = {
    id: number,
    name: string,
    session_id: number,
    amount: number,
    fine_type: FineType,
    slabs: FineSlabType[]
};

export function getDefaultFeeFine(): FeeFine {
    return {
        id: new Date().getTime(),
        name: '',
        session_id: 0,
        amount: 0,
        fine_type: FineType.None,
        slabs: []
    }
}

export enum FineType {
    None = 0,
    Amount = 1,
    Percentage = 2,
    Slab = 3,
    PerDay = 4
}

export const FineTypeArray = [
    { id: FineType.None, name: 'No Fine' },
    { id: FineType.Amount, name: 'Fixed Amount' },
    { id: FineType.Percentage, name: 'Percentage' },
    { id: FineType.Slab, name: 'Slab Based' },
    { id: FineType.PerDay, name: 'Per Day' }
];

export function getFineTypeName(type?: FineType): string {
    return FineTypeArray.find(f => f.id === type)?.name || 'No Fine';
}


export enum FeeWaiverTypeEnum {
    Amount = 0,
    Fine = 1
}

export enum FeeWaiverStatusEnum {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export type Waiver = {
    id: number,
    fee_schedule_type: FeeScheduleTypeEnum,
    user_item_issue_id: number,
    collect_fine: number,
    due_date: string,
    amount: number,
}

export const FeeWaiverStatusArray = [
    { id: FeeWaiverStatusEnum.Pending, name: 'Pending' },
    { id: FeeWaiverStatusEnum.Approved, name: 'Approved' },
    { id: FeeWaiverStatusEnum.Rejected, name: 'Rejected' },
];

export function getFeeWaiverStatusName(id: number): string {
    const status = FeeWaiverStatusArray.find(s => s.id === id);
    return status ? status.name : 'Pending';
}



export enum UserDiscountStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const UserDiscountStatusArray = [
    { id: UserDiscountStatus.Pending, name: 'Pending' },
    { id: UserDiscountStatus.Approved, name: 'Approved' },
    { id: UserDiscountStatus.Rejected, name: 'Rejected' },
];

export function getUserDiscountStatusName(id: number): string {
    const status = UserDiscountStatusArray.find(s => s.id === id);
    return status ? status.name : 'Pending';
}

export enum UserFeeServiceType {
    FeeCategory = 0,
    FeeSpecial = 1,
}

export function getUserFeeServiceTypeName(type: UserFeeServiceType): string {
    return UserFeeServiceTypeArray.find(i => i.id == type)?.name ?? '--'
}

export const UserFeeServiceTypeArray = [
    { id: UserFeeServiceType.FeeCategory, name: "Recurring Fee" },
    { id: UserFeeServiceType.FeeSpecial, name: "Special Fee" },
];


export enum UserServiceOptStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const UserServiceOptStatusArray = [
    { id: UserServiceOptStatus.Pending, name: 'Pending' },
    { id: UserServiceOptStatus.Approved, name: 'Approved' },
    { id: UserServiceOptStatus.Rejected, name: 'Rejected' },
];

export function getUserServiceOptStatusName(id: number): string {
    const status = UserServiceOptStatusArray.find(s => s.id === id);
    return status ? status.name : 'Pending';
}


export enum UserServiceOpt {
    Out = 0,
    In = 1
}

export const UserServiceOptArray = [
    { id: UserServiceOpt.In, name: 'Opt In' },
    { id: UserServiceOpt.Out, name: 'Opt Out' }
];

export function getUserServiceOptName(id: number): string {
    const status = UserServiceOptArray.find(s => s.id === id);
    return status ? status.name : '--';
}

