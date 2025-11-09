import { LuCreditCard, LuWrench } from "react-icons/lu";
import { LucideXCircle } from "lucide-react";
import { UserQuotaCodeEnum } from "./Subscription";
import { User } from "./user";

export type TicketState = {
    ticket: Ticket,
    items: {
        id: string,
        name: string,
        quantity: string,
        valid_from: string,
        valid_to: string,
        user_order_item_type: UserQuotaCodeEnum,
        description: string,
        total: number
    }[],
    teams: {
        id: number,
        name: string,
        managers: User[],
        active: number
    }[],
    user: User,
    users: User[]
}

export interface Ticket {
    id: number;
    user_id: number;
    ticket_category_id: number;
    ticket_category_name: string,
    user_order_id: number;
    ticket_category_type: number;
    remarks: string;
    internal_reference_number: string;
    created_at: string;
    updated_at: string;
    status: number;
    priority: number;
    order?: any
}

export enum TicketCategoryTypeEnum {
    Other = 0,
    Billing = 1,
    Technical = 2,
    Cancellation = 3,
}
export const TicketCategoryTypeArray = [
    { id: TicketCategoryTypeEnum.Other, name: 'Other' },
    { id: TicketCategoryTypeEnum.Billing, name: 'Billing' },
    { id: TicketCategoryTypeEnum.Technical, name: 'Technical' },
    { id: TicketCategoryTypeEnum.Cancellation, name: 'Cancellation' },
];

export function getTicketCategoryTypeName(type: TicketCategoryTypeEnum) {
    return TicketCategoryTypeArray.find(s => s.id === type)?.name ?? 'Other';
}
export const TicketCategoryTypeOptions = [
    { type: TicketCategoryTypeEnum.Billing, title: 'Billing or Payment Issue', icon: LuCreditCard, description: 'Incorrect charge, failed payment, or refund request.' },
    { type: TicketCategoryTypeEnum.Technical, title: 'Technical Problem', icon: LuWrench, description: 'Service is down, feature not working, or login issues.' },
    { type: TicketCategoryTypeEnum.Cancellation, title: 'Cancel Subscription', icon: LucideXCircle, description: 'Stop recurring payments and terminate service access.' },
];


export const enum TicketStatusEnum {
    Pending = 0,
    Active = 1,
    Solved = 2,
    Closed = 3
}

export const TicketStatusArray = [
    { id: TicketStatusEnum.Pending, name: "Pending", bg: 'bg-yellow-100', fg: 'text-yellow-800' },
    { id: TicketStatusEnum.Active, name: "Active", bg: 'bg-blue-100', fg: 'text-blue-800' },
    { id: TicketStatusEnum.Solved, name: "Solved", bg: 'bg-green-100', fg: 'text-green-800' },
    { id: TicketStatusEnum.Closed, name: "Closed", bg: 'bg-gray-100', fg: 'text-gray-800' },
];





export const getTicketStatusName = (status: number) =>
    TicketStatusArray.find(s => s.id === status)?.name ?? "";


export const enum TicketPriorityEnum {
    Low = 0,
    Medium = 1,
    High = 2,
}

export const TicketPriorityArray = [
    { id: TicketPriorityEnum.Low, name: "Low", bg: 'bg-green-100', fg: 'text-green-800' },
    { id: TicketPriorityEnum.Medium, name: "Medium", bg: 'bg-yellow-100', fg: 'text-yellow-800' },
    { id: TicketPriorityEnum.High, name: "High", bg: 'bg-red-100', fg: 'text-red-800' },
];


export const getTicketPriorityName = (priority: number) =>
    TicketPriorityArray.find(p => p.id === priority)?.name ?? "";
