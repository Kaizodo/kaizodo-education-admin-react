import { createContext } from "react";
import { getDefaultUser, User } from "./user";
import { FeeCollectionFrequency } from "./Fee";

export enum OrganizationSettingEnum {
    LogoFull = 0,
    LogoShort = 1,
    Name = 2,
    Tagline = 3,
    Address = 4,
    ContactNumber = 5,
    EmailAddress = 6,
    Website = 7,
    FacebookPageUrl = 8,
    XPageUrl = 9,
    InstagramPageUrl = 10,
    LinkedinPageUrl = 11,
    YoutubePageUrl = 12,
    AdminTheme = 13,
    StudentTheme = 14,
    ParentTheme = 15,
    EmployeeTheme = 16,
    WebsiteTheme = 17,
    BookFine = 18,
    BookLostFine = 19,
    BookDamageFine = 20,
    InterviewTips = 21,
    IndustryType = 22,
    Founded = 23,
}


export enum Panel {
    Student = 0,
    Parent = 1,
    Employee = 2,
    Admin = 3
}




export interface Session {
    id: number
    name: string
    start_date: string
    end_date: string
}

export interface ClassType {
    id: number
    organization_id: number
    name: string
    location_id: number
    code: string
    description: string
    max_student: number
    has_sections?: number
    created_at: string
    updated_at: string
    deleted: number
}

export interface ClassSection {
    id: number
    organization_id: number
    class_id?: number
    section_id: number
    max_student: number
    created_at: string
    updated_at: any
    deleted: any
    location_id: number
}

export interface Section {
    id: number
    name: string
    code?: string
    organization_id: number
    created_at: string
    updated_at: string
    deleted: any
}

export interface Batch {
    id: number
    name: string
    batch_date: string
}

export interface Subject {
    id: number
    organization_id: number
    name: string
    code: string
    type: number
    difficulty_level: number
    weekly_period: number
    publish: number
    created_at: string
    updated_at: string
    deleted?: number
}

export interface FeeCategory {
    id: number
    category_type: number
    name: string
    frequency: FeeCollectionFrequency
    mandatory: number
}

export interface DocumentType {
    id: number,
    name: string,
    description: string,
    code: string
}


export interface GlobalContextType {
    organization_onboarding_progress?: number,
    user: User,
    sessions: Session[],
    shifts: {
        id: number,
        name: string,
        start_time: string,
        end_time: string,
        bg_color: string,
        fg_color: string
    }[],
    batches: Batch[],
    classes: ClassType[],
    class_sections: ClassSection[],
    sections: Section[],
    subjects: Subject[],
    fee_categories: FeeCategory[],
    document_types: DocumentType[],
    trigger_update: number,
    stores: any[],
    students: any[],
}


export function getDefaultGlobalContext(): GlobalContextType {
    return {
        organization_onboarding_progress: 0,
        user: getDefaultUser(),
        trigger_update: 0,
        sections: [],
        batches: [],
        classes: [],
        shifts: [],
        class_sections: [],
        subjects: [],
        fee_categories: [],
        document_types: [],
        sessions: [],
        stores: [],
        students: [],
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
