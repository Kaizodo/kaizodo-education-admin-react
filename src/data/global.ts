import { createContext } from "react";
import { getDefaultUser, User } from "./user";



export enum Panel {
    Student = 0,
    Parent = 1,
    Employee = 2,
    Admin = 3
}

export type PosSession = {
    id: number;
    is_closed: number;
    user_id: number;
    organization_id: number;
    opening_balance: number;
    opening_remarks: string;
    closing_balance: number;
    closing_remarks: string;
    total_sale: string;
    created_at: string;
    updated_at: string;
};

export type ContextOrganiation = {
    id?: number,
    name: string,
    logo_full: string,
    logo_short: string
}

export const defaultContextOrganization = {
    id: undefined,
    name: '',
    logo_full: '',
    logo_short: ''
}

export interface GlobalContextType {
    user: User,
    pos_session?: PosSession,
    settings: any,
    organization: ContextOrganiation
}


export function getDefaultGlobalContext(): GlobalContextType {
    return {
        user: getDefaultUser(),
        settings: {},
        organization: defaultContextOrganization
    }
}


export const defaultContext: GlobalContextType = getDefaultGlobalContext();

export const GlobalContext = createContext<{
    context: GlobalContextType,
    setContext: React.Dispatch<React.SetStateAction<GlobalContextType>>
}>({
    context: defaultContext,
    setContext: () => { }
})
