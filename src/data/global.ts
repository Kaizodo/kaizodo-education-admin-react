import { createContext } from "react";
import { getDefaultUser, User } from "./user";



export enum Panel {
    Student = 0,
    Parent = 1,
    Employee = 2,
    Admin = 3
}


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
