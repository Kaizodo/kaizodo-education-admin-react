import { FileText, MessageSquare, Users, Video } from "lucide-react";
import { LuUser } from "react-icons/lu";
import { User } from "./user";
import { CampaignType } from "./campaign";


export type InterviewDetailState = {
    is_scheduled?: number,
    is_completed?: number,
    is_selected?: number,
    is_waiting?: number,
    is_shortlisted_for_next_round?: number,
    is_joined?: number,
    status?: ApplicationStatus,
    campaign_id: number,
    interview_round_id?: number,
    record: any,
    rounds: InterviewRound[],
    cutoff_requests: ApplicationCutoffRequest[]
}
export const enum ApplicationCutoffRequestStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}
export function getCutoffRequestStatusName(value: number): keyof typeof ApplicationCutoffRequestStatus {
    switch (value) {
        case ApplicationCutoffRequestStatus.Pending:
            return "Pending";
        case ApplicationCutoffRequestStatus.Approved:
            return "Approved";
        case ApplicationCutoffRequestStatus.Rejected:
            return "Rejected";
        default:
            throw new Error("Invalid status value");
    }
}

export type ApplicationCutoffRequest = {
    id: number,
    status: ApplicationCutoffRequestStatus,
    status_remarks: string,
    status_datetime: string,
    filters_snapshot: {
        id: number,
        min_points: number
    }[],
    created_at: string,
    internal_reference_number: string,
    interview_round_id: number,
    application_count: number,
    created_by_user_id: number,
    processed_by_user_id: number,
    remarks: string,
    is_active: number,
    users: User[],
    rounds: number[]
};

export type InterviewBoard = {
    id: number,
    campaign_id: number,
    interview_round_id: number,
    career_id: number,
    career_interview_round_id: number,
    name: string,
}

export type InterviewGroup = {
    id: number,
    campaign_id: number,
    interview_round_id: number,
    career_id: number,
    career_interview_round_id: number,
    name: string,
    capacity: number,
    location_name: string,
    location_id: number
}

export type InterviewLocation = {
    id: number,
    name: string,
    capacity: number,
    location: string
}

export type InterviewSlot = {
    id: number,
    campaign_id: number,
    interview_round_id: number,
    career_id: number,
    career_interview_round_id: number,
    name: string,
    time_start: string,
    time_end: string
}

export const enum ApplicationStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Cancelled = 3,
    Reviewing = 4,
    Waiting = 5,
    Shortlisted = 6,
    Selected = 7,
    Abandoned = 8,
}

export const ApplicationStatusArray = [
    { id: ApplicationStatus.Pending, name: 'Pending', color: 'bg-yellow-100 text-yellow-800 border border-yellow-300' },
    { id: ApplicationStatus.Approved, name: 'Approved', color: 'bg-blue-100 text-blue-800 border border-blue-300' },
    { id: ApplicationStatus.Rejected, name: 'Rejected', color: 'bg-red-100 text-red-800 border border-red-300' },
    { id: ApplicationStatus.Cancelled, name: 'Cancelled', color: 'bg-gray-100 text-gray-800 border border-gray-300' },
    { id: ApplicationStatus.Reviewing, name: 'Under Review', color: 'bg-purple-100 text-purple-800 border border-purple-300' },
    { id: ApplicationStatus.Waiting, name: 'Waiting', color: 'bg-indigo-100 text-indigo-800 border border-indigo-300' },
    { id: ApplicationStatus.Shortlisted, name: 'Shortlisted', color: 'bg-green-100 text-green-800 border border-green-300' },
    { id: ApplicationStatus.Selected, name: 'Selected', color: 'bg-green-200 text-green-900 border border-green-400' },
    { id: ApplicationStatus.Abandoned, name: 'Abandoned', color: 'bg-orange-100 text-orange-800 border border-orange-300' },
];

export function getApplicationStatusName(status: ApplicationStatus) {
    return ApplicationStatusArray.find(s => s.id == status)?.name ?? 'Pending Approval';
}

export const enum InterviewRoundFor {
    Admission = 0,
    Career = 1
}

// Enum
export enum InterviewRoundType {
    Phone = 1,
    Video = 2,
    InPerson = 3,
    Technical = 4,
    Presentation = 5,
    Panel = 6,
    HR = 7,
    GroupDiscussion = 8,
    CaseStudy = 9,
    Coding = 10,
    Behavioral = 11,
    Managerial = 12,
    Final = 13,
    WrittenTest = 14,
}

// Array
export const InterviewRoundTypes = [
    { id: InterviewRoundType.Phone, name: 'Phone Call', icon: MessageSquare, color: 'bg-blue-500' },
    { id: InterviewRoundType.Video, name: 'Video Call', icon: Video, color: 'bg-green-500' },
    { id: InterviewRoundType.InPerson, name: 'In-Person', icon: LuUser, color: 'bg-purple-500' },
    { id: InterviewRoundType.Technical, name: 'Technical Assessment', icon: FileText, color: 'bg-orange-500' },
    { id: InterviewRoundType.Presentation, name: 'Presentation', icon: FileText, color: 'bg-pink-500' },
    { id: InterviewRoundType.Panel, name: 'Panel Interview', icon: Users, color: 'bg-indigo-500' },
    { id: InterviewRoundType.HR, name: 'HR Interview', icon: LuUser, color: 'bg-teal-500' },
    { id: InterviewRoundType.GroupDiscussion, name: 'Group Discussion', icon: Users, color: 'bg-yellow-500' },
    { id: InterviewRoundType.CaseStudy, name: 'Case Study', icon: FileText, color: 'bg-red-500' },
    { id: InterviewRoundType.Coding, name: 'Coding Test', icon: FileText, color: 'bg-cyan-500' },
    { id: InterviewRoundType.Behavioral, name: 'Behavioral Interview', icon: LuUser, color: 'bg-gray-500' },
    { id: InterviewRoundType.Managerial, name: 'Managerial Interview', icon: LuUser, color: 'bg-lime-500' },
    { id: InterviewRoundType.Final, name: 'Final Round', icon: Users, color: 'bg-rose-500' },
    { id: InterviewRoundType.WrittenTest, name: 'Written Test', icon: FileText, color: 'bg-amber-500' }
];

export const getInterviewRoundType = (id: number) =>
    InterviewRoundTypes.find(type => type.id === id) ?? {
        id: 0,
        name: 'Select Round Type',
        icon: MessageSquare,
        color: 'bg-blue-500'
    };



export interface InterviewRound {
    id: number;
    applications_count: number;
    campaign_id: number;
    campaign_type: CampaignType,
    application_count: number;
    completed_count: number;
    pending_count: number;
    rejected_count: number;
    scheduled_count: number;
    is_completed: number;
    completed_by_user_id: number;
    completed_remarks: string;
    completed_datetime: string;
    shortlisted_count: number;
    name: string;
    max_points: number;
    min_points: number;
    max_auto_points: number;
    final_min_points: number;
    final_max_points: number;
    round_for: InterviewRoundFor,
    round_type: InterviewRoundType;
    interview_round_point_slabs: InterviewRoundPointSlab[],
    interview_slots: InterviewSlot[],
    interview_boards: InterviewBoard[],
    interview_groups: InterviewGroup[],
    interview_locations: InterviewLocation[],
    duration: number;
    content: string;
    date_start: string;
    date_end: string;
    time_start: string;
    time_end: string;
    processed_by_user?: User,
    users: User[];
    sort_order: number;
    removing: boolean,
    admit_card_required: number,
    shortlisting_required: number,
    collect_offer_information: number,
    updated?: number,
    scheduling?: boolean,
    status_remarks: string
}

export type InterviewRoundValue = {
    campaign_id: number,
    interview_round_id: number,
    campaign_application_id: number,
    user_id: number,
    points: number,
    remarks: number
}

export type InterviewRoundPointSlabValue = {
    campaign_id: number,
    interview_round_id: number,
    campaign_application_id: number,
    interview_round_point_slab_item_id: number,
    interview_round_point_slab_option_id: number,
    interview_round_point_slab_id: number,
    user_id: number,
    points: number,
    slab_value: number,
    remarks: number
}


export interface InterviewRoundProgress {
    id: number
    is_completed: number
    date: string
    organization_id: number
    application_status: number
    application_section: number
    application_progress_group_id: any
    application_progress_remark_id: any
    interview_board_id: number
    interview_slot_id: number
    processed_by_user_id: number
    interview_group_id: number
    career_application_id: any
    career_id: any
    career_interview_round_id: any
    admission_id: number
    interview_round_id: number
    campaign_id: number
    created_at: string
    updated_at: string
    interview_board_name: string
    points_remarks: string
    points: number,
    manual_points: number,
    auto_points: number,
    points_datetime: string,
    processed_by_user: User,
    slot?: {
        id: number,
        name: string,
        time_start: string,
        time_end: string
    }
}



export function getDefaultInterviewRound(): InterviewRound {
    return {
        id: 0,
        campaign_id: 0,
        campaign_type: CampaignType.Admission,
        application_count: 0,
        applications_count: 0,
        completed_count: 0,
        is_completed: 0,
        completed_by_user_id: 0,
        completed_remarks: '',
        completed_datetime: '',
        pending_count: 0,
        rejected_count: 0,
        scheduled_count: 0,
        shortlisted_count: 0,
        name: '',
        admit_card_required: 0,
        shortlisting_required: 0,
        collect_offer_information: 0,
        max_points: 0,
        min_points: 0,
        max_auto_points: 0,
        final_min_points: 0,
        final_max_points: 0,
        round_for: InterviewRoundFor.Admission,
        round_type: InterviewRoundType.InPerson,
        interview_round_point_slabs: [],
        interview_slots: [],
        interview_boards: [],
        interview_groups: [],
        interview_locations: [],
        duration: 0,
        content: '',
        date_start: '',
        date_end: '',
        time_start: '',
        time_end: '',
        users: [],
        sort_order: 0,
        removing: false,
        status_remarks: '',
        updated: undefined
    }
}

export const enum InterviewRoundPointSlabType {
    Custom = 0,
    Experience = 1,
    SalaryExpectation = 2,
}

export const enum InterviewRoundPointType {
    NumberRange = 0,
    CustomOptions = 1
}

export type InterviewRoundPointValue = {
    id: number,
    points: number,
    slab_value: any
}


export type InterviewRoundPointSlab = {
    id: number,
    name: string,
    slab_type: InterviewRoundPointSlabType,
    points_type: InterviewRoundPointType,
    items: InterviewRoundPointSlabItem[],
    options: InterviewRoundPointSlabOption[],
    value?: InterviewRoundPointValue
}

export const getDefaultInterviewRoundPointSlab = (): InterviewRoundPointSlab => {
    return {
        id: new Date().getTime(),
        name: 'New Slab',
        slab_type: InterviewRoundPointSlabType.Custom,
        points_type: InterviewRoundPointType.NumberRange,
        items: [],
        options: []
    };
}

export type InterviewRoundPointSlabItem = {
    id: number,
    min_value: number,
    max_value: number,
    interview_round_point_slab_id: number,
    points: number
}

export const getDefaultInterviewRoundPointSlabItem = (): InterviewRoundPointSlabItem => {
    return {
        id: new Date().getTime(),
        min_value: 0,
        max_value: 0,
        interview_round_point_slab_id: 0,
        points: 0
    };
}

export type InterviewRoundPointSlabOption = {
    id: number,
    name: string,
    points: number,
    interview_round_point_slab_id: number
}

export const getDefaultInterviewRoundPointSlabOption = (): InterviewRoundPointSlabOption => {
    return {
        id: new Date().getTime(),
        name: '',
        interview_round_point_slab_id: 0,
        points: 0
    };
}


export type InterviewSchedule = {
    id: number,
    start_datetime: string,
    end_datetime: string,
    user: User
}   