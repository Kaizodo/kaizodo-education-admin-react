import { InterviewBoard, InterviewRound, InterviewRoundPointSlab, InterviewRoundType, InterviewSlot } from "./Interview"
import { Gender, User, UserSchedule } from "./user";

export type AdmissionWindowRound = {
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


export enum AdmissionStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const AdmissionStatusArray = [
    { id: AdmissionStatus.Pending, name: 'Pending' },
    { id: AdmissionStatus.Approved, name: 'Approved' },
    { id: AdmissionStatus.Rejected, name: 'Rejected' }
]

export function getDefaultAdmissionStatusName(status: AdmissionStatus) {
    return AdmissionStatusArray.find(s => s.id == status)?.name ?? 'Pending';
}


export const getDefaultAdmissionState = (): AdmissionState => {
    return {
        required_documents: [],
        admission: {
            siblings: [],
            relatives: [],
            documents: [],
        } as any,
        rounds: [],
        schedules: []
    };
}

export interface AdmissionState {
    processed_by_user?: User,
    required_documents: AdmissionRequiredDocument[]
    admission: Admission
    rounds: InterviewRound[]
    schedules: UserSchedule[]
}

export interface AdmissionRequiredDocument {
    document_type_id: number
    mandatory: number
}

export interface Admission {
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
    status: AdmissionStatus,
    status_remarks: string,
    status_datetime: string,
    created_at: string
    updated_at: string
    deleted: any
    class_name: string
    state_name: string
    city_name: string
    siblings: AdmissionSibling[]
    relatives: AdmissionRelatives[]
    documents: any[]
}

export interface AdmissionSibling {
    name: string
    class_name: string
    roll_no: number
}

export interface AdmissionRelatives {
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

