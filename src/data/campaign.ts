import { InterviewBoard, InterviewRound, InterviewRoundPointSlab, InterviewRoundPointSlabValue, InterviewRoundProgress, InterviewRoundType, InterviewRoundValue, InterviewSlot } from "./Interview"
import { Gender, User } from "./user";


export const enum CampaignType {
    Admission = 0,
    Hiring = 1
}

export const CampaignTypeArray = [
    { id: CampaignType.Admission, name: 'Admission' },
    { id: CampaignType.Hiring, name: 'Hiring' },
];

export function getCampaignTypeName(campaign_type: CampaignType) {
    return CampaignTypeArray.find(c => c.id == campaign_type)?.name;
}

export const enum CampaignAttendanceStatus {
    Pending = 0,
    Present = 1,
    Absent = 2
}



export function getCampaignAttendanceStatusName(status: CampaignAttendanceStatus): string {
    switch (status) {
        case CampaignAttendanceStatus.Pending:
            return 'Pending';
        case CampaignAttendanceStatus.Present:
            return 'Present';
        case CampaignAttendanceStatus.Absent:
            return 'Absent';
        default:
            return 'Unknown';
    }
}

export const enum CampaignSelectionStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const CampaignSelectionStatusArray = [
    { id: CampaignSelectionStatus.Pending, name: 'Pending' },
    { id: CampaignSelectionStatus.Approved, name: 'Approved' },
    { id: CampaignSelectionStatus.Rejected, name: 'Rejected' },
];

export function getCampaignSelectionStatusName(status: CampaignSelectionStatus): string {
    const statusItem = CampaignSelectionStatusArray.find(item => item.id === status);
    return statusItem ? statusItem.name : 'Unknown';
}


export const enum CampaignOfferStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const CampaignOfferStatusArray = [
    { id: CampaignOfferStatus.Pending, name: 'Respone Pending' },
    { id: CampaignOfferStatus.Approved, name: 'Accepted' },
    { id: CampaignOfferStatus.Rejected, name: 'Declined / Rejection' },
];

export function getCampaignOfferStatusName(status: CampaignOfferStatus): string {
    const statusItem = CampaignOfferStatusArray.find(item => item.id === status);
    return statusItem ? statusItem.name : 'Unknown';
}

export const enum CampaignJoiningStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const CampaignJoiningStatusArray = [
    { id: CampaignJoiningStatus.Pending, name: 'Respone Pending' },
    { id: CampaignJoiningStatus.Approved, name: 'Acknowledged' },
    { id: CampaignJoiningStatus.Rejected, name: 'Declined / Not Acknowledged' },
];

export function getCampaignJoiningStatusName(status: CampaignJoiningStatus): string {
    const statusItem = CampaignJoiningStatusArray.find(item => item.id === status);
    return statusItem ? statusItem.name : 'Unknown';
}

export function getCampaignTypeMeta(type: CampaignType): {
    route: string,
    name: string,
    title: string,
    subtitle: string,
    color: string
} {
    switch (type) {
        case CampaignType.Admission:
            return {
                route: 'admission-campaigns',
                name: 'Admission',
                title: 'Admission Campaign',
                subtitle: 'Manage admission campaign',
                color: 'blue'
            };
        case CampaignType.Hiring:
            return {
                route: 'hiring-campaigns',
                name: 'Job',
                title: 'Job Campaign',
                subtitle: 'Manage job campaign',
                color: 'green'
            };
        default:
            return {
                route: 'campaigns',
                name: 'Unknown',
                title: 'Unknown Campaign',
                subtitle: 'Manage unknown campaign',
                color: 'gray'
            };
    }
}

export type CampaignApplicationWindowRound = {
    id: number;
    admission_window_id: number;
    application_count: number;
    completed_count: number;
    pending_count: number;
    rejected_count: number;
    scheduled_count: number;
    name: string;
    max_points: number;
    min_points: number;
    final_min_points: number;
    final_max_points: number;
    round_type: InterviewRoundType;
    interview_round_point_slabs: InterviewRoundPointSlab[],
    interview_slots: InterviewSlot[],
    interview_boards: InterviewBoard[],
    duration: number;
    content: string;
    date_from: string;
    date_to: string;
    time_start: string;
    time_end: string;
    users: User[];
    sort_order: number;
    removing: boolean,
    updated?: number,
    status_remarks: string
}


export enum CampaignApplicationStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const CampaignApplicationStatusArray = [
    { id: CampaignApplicationStatus.Pending, name: 'Pending' },
    { id: CampaignApplicationStatus.Approved, name: 'Approved' },
    { id: CampaignApplicationStatus.Rejected, name: 'Rejected' }
]

export function getDefaultCampaignApplicationStatusName(status: CampaignApplicationStatus) {
    return CampaignApplicationStatusArray.find(s => s.id == status)?.name ?? 'Pending';
}


export const getDefaultCampaignApplicationState = (): CampaignApplicationState => {
    return {
        campaign: {
            id: 0,
            campaign_type: CampaignType.Admission,
            name: 'N/A',
            date_start: new Date().toDateString(),
            date_end: new Date().toDateString(),
            code: '',
            advertisement_number: '',
            designation_id: 0,
            designation_name: ''
        },
        required_documents: [],
        application: {
            class_name: "",
            designation_name: "",
            siblings: [],
            relatives: [],
            documents: [],
        } as any,
        rounds: [],
        progress: [],
        round_values: [],
        slab_values: []
    };
}

export type CampaignOffer = {
    id: number,
    internal_reference_number: string,
    status: CampaignOfferStatus,
    status_remarks: string,
    status_datetime: string,
    doj: string,
    dojl: string,
    offered_salary: number,
    offer_decline_reason_name: string,
    responded_by_candidate: number,
    created_at: string,
    updated_at: string
};

export function getDefaultCampaignJoining(): CampaignJoining {
    return {
        id: 0,
        internal_reference_number: '',
        status: CampaignJoiningStatus.Pending,
        status_remarks: '',
        status_datetime: '',
        doj: '',
        dojl: '',
        offered_salary: 0,
        offer_decline_reason_name: '',
        responded_by_candidate: 0,
        created_at: '',
        updated_at: ''
    };
}


export type CampaignJoining = {
    id: number,
    internal_reference_number: string,
    status: CampaignJoiningStatus,
    status_remarks: string,
    status_datetime: string,
    doj: string,
    dojl: string,
    offered_salary: number,
    offer_decline_reason_name: string,
    responded_by_candidate: number,
    created_at: string,
    updated_at: string
};

export function getDefaultCampaignOffer(): CampaignOffer {
    return {
        id: 0,
        internal_reference_number: '',
        status: CampaignOfferStatus.Pending,
        status_remarks: '',
        status_datetime: '',
        doj: '',
        dojl: '',
        offered_salary: 0,
        offer_decline_reason_name: '',
        responded_by_candidate: 0,
        created_at: '',
        updated_at: ''
    };
}

export interface CampaignApplicationState {
    campaign: {
        id: number,
        campaign_type: CampaignType,
        name: string,
        date_start: string,
        date_end: string,
        code: string,
        advertisement_number: string,
        designation_id: number,
        designation_name: string
    },
    processed_by_user?: User,
    required_documents: CampaignApplicationRequiredDocument[]
    application: CampaignApplication
    rounds: InterviewRound[]
    progress: InterviewRoundProgress[],
    round_values: InterviewRoundValue[],
    slab_values: InterviewRoundPointSlabValue[],
    offer?: CampaignOffer
}

export interface CampaignApplicationRequiredDocument {
    document_type_id: number
    mandatory: number
}

export interface CampaignApplication {
    id: number
    total_round: number
    cleared_round: any
    is_admited: any
    user_id: any
    admission_window_id: number
    allowed_edits: number
    internal_reference_number: string
    organization_id: number
    first_name: string
    middle_name: any
    last_name: string
    class_id: number
    state_id: number
    city_id: number
    pincode: any
    image: string
    password: string
    auth_token: string
    address: string
    dob: string
    gender: Gender
    blood_group: string
    allergies: any
    school_name: any
    year_completation: any
    high_qualification: any
    completion_class: any
    status: CampaignApplicationStatus,
    designation_name: string,
    status_remarks: string,
    status_datetime: string,
    created_at: string
    updated_at: string
    deleted: any
    class_name: string
    state_name: string
    city_name: string
    siblings: CampaignApplicationSibling[]
    relatives: CampaignApplicationRelatives[]
    documents: any[]
}

export interface CampaignApplicationSibling {
    name: string
    class_name: string
    roll_no: number
}

export interface CampaignApplicationRelatives {
    id: number
    relation: number
    first_name: string
    last_name: string
    admission_id: number
    occupation: string
    address: string
    email: string
    mobile: string
    created_at: string
    updated_at: string
}

export type FeedbackCriteria = {
    id: number,
    name: string,
    description: string,
    rating: number
}