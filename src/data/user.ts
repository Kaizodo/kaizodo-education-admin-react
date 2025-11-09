
export const enum EarningWithdrawalStatus {
    Pending = 0,
    Processing = 1,
    Completed = 2,
    Rejected = 3,
    CancelledByUser = 4,
    CancelledByPlatform = 5
}

export const EarningWithdrawalStatusArray = [
    { id: EarningWithdrawalStatus.Pending, name: 'Pending' },
    { id: EarningWithdrawalStatus.Processing, name: 'Processing' },
    { id: EarningWithdrawalStatus.Completed, name: 'Completed' },
    { id: EarningWithdrawalStatus.Rejected, name: 'Rejected' },
    { id: EarningWithdrawalStatus.CancelledByUser, name: 'Cancelled By User' },
    { id: EarningWithdrawalStatus.CancelledByPlatform, name: 'Cancelled By Platform' }
];

export function getEarningWithdrawalStatusName(id: EarningWithdrawalStatus) {
    return EarningWithdrawalStatusArray.find(x => x.id === id)?.name || '';
}

export enum AttendanceStatus {
    Absent = 0,
    Present = 1,
    HalfDay = 2
}

export enum UserLeaveStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}
export const UserLeaveStatusArray = [
    { id: UserLeaveStatus.Pending, name: 'Pending' },
    { id: UserLeaveStatus.Approved, name: 'Approved' },
    { id: UserLeaveStatus.Rejected, name: 'Rejected' },
];


export enum GradeScaleEnum {
    InternalExam = 0,
    MockExam = 1,
}

export const GradeScaleEnumArray = [
    { id: GradeScaleEnum.InternalExam, name: 'Internal Exam' },
    { id: GradeScaleEnum.MockExam, name: 'Mock Exam' },
];



export enum NotificationType {
    circular = 1,
    notice = 2,
    announcement = 3
}

export enum QuestionType {
    MultipleChoice = 0,
    TrueFalse = 1,
    Descriptive = 2,
    NumericInput = 3
}

export enum TreatmentEnum {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Completed = 3
}

export enum MedicineStatusEnum {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export enum ExamStatus {
    Draft = 0,
    Publish = 1,
    Complete = 2,
}

export enum ExamMode {
    Simple = 0,
    Advance = 1,
}





export enum IntentType {
    Procurement = 0,
    Service = 1,
    Communication = 2,
    Maintenance = 3,
    Training = 4,
}

export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
}

export enum IntentStatus {
    Pending = 0,
    InReview = 1,
    Approved = 2,
    Rejected = 3,
    Completed = 4,
}

export enum Unit {
    Piece = 0,
    Kg = 1,
    Bottle = 2,
    Box = 3,
    Liter = 4,
    Pack = 5,
}

export enum DifficultyLevel {
    Easy = 1,
    Moderate = 2,
    Challenging = 3,
    Hard = 4,
    VeryHard = 5
}

export enum VendorEnum {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export enum UserItemIssueStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Cancelled = 4,
    Issued = 5,
    Submitted = 6,
    ReIssue = 7,
    NotSubmitted = 8
}

export function getUserItemIssueStatusName(status: UserItemIssueStatus): string {
    switch (status) {
        case UserItemIssueStatus.Pending:
            return "Pending";
        case UserItemIssueStatus.Approved:
            return "Approved";
        case UserItemIssueStatus.Rejected:
            return "Rejected";
        case UserItemIssueStatus.Cancelled:
            return "Cancelled";
        case UserItemIssueStatus.Issued:
            return "Issued";
        case UserItemIssueStatus.Submitted:
            return "Submitted";
        case UserItemIssueStatus.ReIssue:
            return "Re-Issue";
        case UserItemIssueStatus.NotSubmitted:
            return "Not Submitted";
        default:
            return "Unknown";
    }
}



export enum UserNocRequestStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export const UserNocRequestStatusArray = [
    { id: UserNocRequestStatus.Pending, name: 'Pending' },
    { id: UserNocRequestStatus.Approved, name: 'Approved' },
    { id: UserNocRequestStatus.Rejected, name: 'Rejected' },
];

export function getUserNocRequestStatusName(id: number): string {
    const match = UserNocRequestStatusArray.find(s => s.id === id);
    return match ? match.name : 'Unknown';
}

export enum SubjectExamType {
    Written = 1,
    Viva = 2,
    LabTest = 3,
    Descriptive = 4,
    Subjective = 5,
}

export enum MeetingStatus {
    Pending = 0,
    Scheduled = 1,
    Completed = 2,
    Cancelled = 3,

}

export const MeetingStatusTypeOptions = [
    { id: MeetingStatus.Pending, name: 'Pending' },
    { id: MeetingStatus.Scheduled, name: 'Scheduled' },
    { id: MeetingStatus.Completed, name: 'Completed' },
    { id: MeetingStatus.Cancelled, name: 'Cancelled' },
]


export const paymentType = [
    { id: 0, name: 'Advance' },
    { id: 1, name: 'Pay Later' },
];

export enum UserItemIssueCondition {
    Damaged = 0,
    Good = 1
}

export const UserItemIssueConditionArray = [
    { id: 0, name: "Damage" },
    { id: 1, name: "Good" },
]

export const SubjectExamTypeOptions = [
    { id: SubjectExamType.Written, name: 'Written' },
    { id: SubjectExamType.Viva, name: 'Viva' },
    { id: SubjectExamType.LabTest, name: 'Lab Test' },
    { id: SubjectExamType.Descriptive, name: 'Descriptive' },
    { id: SubjectExamType.Subjective, name: 'Subjective' },
]

export const UserItemIssueStatusArray = [
    { id: UserItemIssueStatus.Submitted, name: 'Submitted' },
    { id: UserItemIssueStatus.ReIssue, name: 'Re-Issue' },
    { id: UserItemIssueStatus.NotSubmitted, name: 'Not Submitted' },
];

export enum ExamType {
    Quarter = 0,
    HalfEarly = 1,
    Final = 2,
}

export const examTypeOptions = [
    { id: ExamType.Quarter, name: 'Quarter Exam' },
    { id: ExamType.HalfEarly, name: 'Half Early Exam' },
    { id: ExamType.Final, name: 'Final Exam' },
];






export enum OrderEnum {
    Pending = 0,
    Approved = 1,
    Completed = 2,
    Rejected = 3,
}

export enum OrderLabelEnum {
    Pending = 'Pending',
    Approved = 'Approved',
    Completed = 'Completed',
    Rejected = 'Rejected',
}


export type UserClassPromotion = {
    id: number,
    promotion_type: UserClassPromotionType;
    organization_id: number;
    user_id: number;
    from_class_id?: number;
    to_class_id: number;
    from_section_id?: number;
    to_section_id: number;
    from_roll_no?: number;
    to_roll_no?: number;
    from_session_id?: number;
    to_session_id: number;
    processed_by_user_id: number;
    promotion_date: string;
    remarks?: string;
};

export enum UserClassPromotionType {
    Enter = 0,
    Promotion = 1,
    Exit = 2
}

export function getUserLeaveStatusName(status: UserLeaveStatus): string {
    const item = UserLeaveStatusArray.find(s => s.id === status);
    return item ? item.name : 'Unknown';
}
export const AttendanceStatusArray = [
    { id: AttendanceStatus.Absent, name: 'Absent' },
    { id: AttendanceStatus.Present, name: 'Present' },
    { id: AttendanceStatus.HalfDay, name: 'HalfDay' }
];

export function getAttendanceStatusName(id: AttendanceStatus): string {
    const status = AttendanceStatusArray.find(s => s.id === id);
    return status ? status.name : '';
}


export enum UserType {
    User = 0,
    Admin = 1,
    Client = 2,
    Lead = 3,
    Employee = 4,
}

export const UserTypeArray = [
    { id: UserType.Lead, name: "Lead" },
    { id: UserType.Client, name: "Client" },
    { id: UserType.Admin, name: "Administrator" },
    { id: UserType.Employee, name: "Other Employees" },
];




export enum VisitorStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    CheckedIn = 3,
    CheckedOut = 4,
    Cancelled = 5,
}

export const VisitorStatusOptions = [
    { id: VisitorStatus.Pending, name: "Pending" },
    { id: VisitorStatus.Approved, name: "Approved" },
    { id: VisitorStatus.Rejected, name: "Rejected" },
    { id: VisitorStatus.CheckedIn, name: "Checked In" },
    { id: VisitorStatus.CheckedOut, name: "Checked Out" },
    { id: VisitorStatus.Cancelled, name: "Cancelled" },
];
export enum VisiTypeEnum {
    Treatment = 1,
    Checkup = 2,
}

export const VisiTypeEnumOption = [
    { id: VisiTypeEnum.Treatment, name: "Treatment" },
    { id: VisiTypeEnum.Checkup, name: "Checkup" },
];


export enum VisitEnum {
    Open = 0,
    Close = 1,
    Pending = 2,
}

export const VisitEnumOption = [
    { id: VisitEnum.Open, name: "Open" },
    { id: VisitEnum.Close, name: "Close" },
    { id: VisitEnum.Pending, name: "Pending" },
];



export function getUserTypeName(tag: UserType) {
    switch (tag) {
        case UserType.Admin:
            return "Administrator"
        case UserType.User:
            return "User"
        case UserType.Employee:
            return "Employee"
        case UserType.Client:
            return "Client"
        case UserType.Lead:
            return "Lead"

        default:
            return ""
    }
}

export type ModuleModifier = 'admin' | 'employee' | 'student' | 'parent';

export function getModuleModifierMeta(m: ModuleModifier) {
    var name = '';
    var user_type: UserType = UserType.User;


    return {
        name,
        user_type,
        create_title: `Add New ${name}`,
        update_title: `Update ${name}`
    }
}


export type UserSearchFilters = {
    debounce?: boolean,
    page: number,
    keyword: string,
    boarding_type?: BoardingType,
    boarding_step?: number,
    user_type?: UserType,
    user_types?: UserType[],
    designation_id?: number,
    class_id?: number,
    department_id?: number,
    section_id?: number,
    gender?: Gender,
    session_id?: number,
    active?: boolean
}

export function getDefaultUserSearchFilters(): UserSearchFilters {
    return {
        page: 1,
        keyword: '',
        user_types: [UserType.User]
    };
}


export enum Gender {
    None,
    Male,
    Female,
    Other
}

export const GenderArray = [
    { id: Gender.Male, name: 'Male' },
    { id: Gender.Female, name: 'Female' },
    { id: Gender.Other, name: 'Other' }
]

export function getGenderName(g: Gender) {
    return GenderArray.find(i => i.id == g)?.name || '--';
}


export enum BloodGroup {
    None = 0,
    APositive = 1,
    ANegative = 2,
    BPositive = 3,
    BNegative = 4,
    ABPositive = 5,
    ABNegative = 6,
    OPositive = 7,
    ONegative = 8
}

export const BloodGroupArray = [
    { id: BloodGroup.APositive, name: 'A+' },
    { id: BloodGroup.ANegative, name: 'A-' },
    { id: BloodGroup.BPositive, name: 'B+' },
    { id: BloodGroup.BNegative, name: 'B-' },
    { id: BloodGroup.ABPositive, name: 'AB+' },
    { id: BloodGroup.ABNegative, name: 'AB-' },
    { id: BloodGroup.OPositive, name: 'O+' },
    { id: BloodGroup.ONegative, name: 'O-' }
]

export const getBloodGroupName = (bg: BloodGroup) => {
    return BloodGroupArray.find(i => i.id == bg)?.name || '--';
}


export enum Relation {
    None,
    Father,
    Mother,
    Brother,
    Sister,
    Husband,
    Wife,
    Son,
    Daughter,
    Uncle,
    Aunt,
    Cousin,
    Nephew,
    Niece,
    Grandfather,
    Grandmother,
    Grandson,
    Granddaughter,
    Friend,
    Other
}

export const RelationArray = [
    { id: Relation.Father, name: 'Father' },
    { id: Relation.Mother, name: 'Mother' },
    { id: Relation.Brother, name: 'Brother' },
    { id: Relation.Sister, name: 'Sister' },
    { id: Relation.Husband, name: 'Husband' },
    { id: Relation.Wife, name: 'Wife' },
    { id: Relation.Son, name: 'Son' },
    { id: Relation.Daughter, name: 'Daughter' },
    { id: Relation.Uncle, name: 'Uncle' },
    { id: Relation.Aunt, name: 'Aunt' },
    { id: Relation.Cousin, name: 'Cousin' },
    { id: Relation.Nephew, name: 'Nephew' },
    { id: Relation.Niece, name: 'Niece' },
    { id: Relation.Grandfather, name: 'Grandfather' },
    { id: Relation.Grandmother, name: 'Grandmother' },
    { id: Relation.Grandson, name: 'Grandson' },
    { id: Relation.Granddaughter, name: 'Granddaughter' },
    { id: Relation.Friend, name: 'Friend' },
    { id: Relation.Other, name: 'Other' }
];

export function getRelationName(relation: Relation) {
    return RelationArray.find(r => r.id == relation)?.name || '--';
}

export type User = {
    id: number;
    shift_id: number,
    organization_id: number;
    designation_id?: number;
    user_role_id: number,
    class_id: number;
    session_id: number;
    promotion_type: UserClassPromotionType,
    daily_work_hour?: number,
    interview_board_id?: number,
    interview_group_id?: number,
    ancestor_user_id: number,
    descendant_user_id: number,
    depth: number,
    is_pass: boolean,
    exam_results: {
        subject_name: string,
        user_id: number,
        total_marks: number,
        marks: number,
        status: number,
        is_attend: number
    }[],
    section_id: number;
    user_type: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    weekly_hour_limit: number;
    weekly_work_limit: number;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    mobile: string;
    image: string;
    image_file?: any;
    dob: string;
    blood_group: number;
    country_id: number;
    reserved_category_id: number;
    caste_id: number;
    religion_id: number;
    present_address: string;
    gender: number;
    occupation: string;
    guardian_type: string;
    relation: Relation,
    relationship: string;
    roll_no: string;
    code: string;
    joining_date: string;
    previous_organization_name: string;
    previous_class: string;
    aadhar_number: string;
    permanent_address: string;
    pincode: number;
    city_id: number;
    state_id: number;
    district_id: number;
    locality_id: number;
    medical_conditions: string;
    allergies: string;
    medications: string;
    birth_certificate: string;
    transfer_certificate: string;
    id_proof: string;
    enrollment_id: number;
    country_name: string;
    state_name: string;
    city_name: string;
    district_name: string;
    locality_name: string;
    religion_name: string;
    caste_name: string;
    boarding_step: number;
    designation_name: string;
    user_role_name: string,
    class_name: string;
    section_name: string;
    reserved_category_name: string;
    relatives: User[];
    subjects: any[];
    classes: any[];
    interview_round_value?: {
        id: number,
        points: number,
        remarks: number,
        created_at: string,
        updated_at: string
    },
    promoting?: boolean
}


export function getDefaultUser(): User {
    return {
        id: 0,
        shift_id: 0,
        organization_id: 0,
        user_role_id: 0,
        class_id: 0,
        promotion_type: UserClassPromotionType.Enter,
        session_id: 0,
        is_pass: false,
        section_id: 0,
        user_type: 0,
        ancestor_user_id: 0,
        descendant_user_id: 0,
        depth: 0,
        exam_results: [],
        first_name: '',
        middle_name: '',
        last_name: '',
        weekly_hour_limit: 0,
        weekly_work_limit: 0,
        email: '',
        email_verified_at: '',
        created_at: '',
        updated_at: '',
        mobile: '',
        image: '',
        dob: '',
        blood_group: 0,
        country_id: 0,
        reserved_category_id: 0,
        relation: Relation.Other,
        caste_id: 0,
        religion_id: 0,
        present_address: '',
        gender: 0,
        occupation: '',
        guardian_type: '',
        relationship: '',
        roll_no: '',
        code: '',
        joining_date: '',
        previous_organization_name: '',
        previous_class: '',
        aadhar_number: '',
        permanent_address: '',
        pincode: 0,
        city_id: 0,
        state_id: 0,
        district_id: 0,
        locality_id: 0,
        medical_conditions: '',
        allergies: '',
        medications: '',
        birth_certificate: '',
        transfer_certificate: '',
        id_proof: '',
        enrollment_id: 0,
        country_name: '',
        state_name: '',
        city_name: '',
        district_name: '',
        locality_name: '',
        religion_name: '',
        caste_name: '',
        designation_name: '',
        user_role_name: '',
        class_name: '',
        section_name: '',
        reserved_category_name: '',
        boarding_step: 0,
        relatives: [],
        subjects: [],
        classes: []
    }
}

export enum CredentialTypeEnum {
    User = 0,
    Admin = 1,
    Employee = 2,
    Student = 3,
    Parent = 4,
    Exam = 5,
}

export enum ItemTypeEnum {
    Consumable = 0,
    NonConsumable = 1,
}

export const ExamCode = [
    { id: 0, name: "Fail" },
    { id: 1, name: "Pass" },
];

export const StudentStatus = [
    { id: 0, name: "Absent" },
    { id: 1, name: "Present" },
]

export const ItemTypeEnumOptions = [
    { id: ItemTypeEnum.Consumable, "name": "Consumable" },
    { id: ItemTypeEnum.NonConsumable, "name": "Non-Consumable" },
]

export const intentTypeOptions = [
    { id: IntentType.Procurement, name: '🛒 Procurement' },
    { id: IntentType.Service, name: '🔧 Service' },
    { id: IntentType.Communication, name: '📢 Communication' },
    { id: IntentType.Maintenance, name: '⚙️ Maintenance' },
    { id: IntentType.Training, name: '📚 Training' },
];

export const priorityOptions = [
    { id: Priority.Low, name: '🟢 Low' },
    { id: Priority.Medium, name: '🟡 Medium' },
    { id: Priority.High, name: '🔴 High' },
];

export const statusOptions = [
    { id: IntentStatus.Pending, name: 'Pending' },
    { id: IntentStatus.InReview, name: 'In Review' },
    { id: IntentStatus.Approved, name: 'Approved' },
    { id: IntentStatus.Rejected, name: 'Rejected' },
    { id: IntentStatus.Completed, name: 'Completed' },
];


export const commonStatus = [
    { id: UserLeaveStatus.Pending, name: 'Pending' },
    { id: UserLeaveStatus.Approved, name: 'Approved' },
    { id: UserLeaveStatus.Rejected, name: 'Rejected' },
]


export const UnitLabels = [
    { id: Unit.Piece, name: "Piece" },
    { id: Unit.Kg, name: "Kilogram" },
    { id: Unit.Bottle, name: "Bottle" },
    { id: Unit.Box, name: "Box" },
    { id: Unit.Liter, name: "Liter" },
    { id: Unit.Pack, name: "Pack" },
];


export const DifficultLabel = [
    { id: DifficultyLevel.Easy, name: "Easy" },
    { id: DifficultyLevel.Moderate, name: "Moderate" },
    { id: DifficultyLevel.Challenging, name: "Challenging" },
    { id: DifficultyLevel.Hard, name: "Hard" },
    { id: DifficultyLevel.VeryHard, name: "Very Hard" },

]

export enum HostelStatus {
    Active = 0,
    Deactive = 1,
    UnderMaintenance = 2,
}

export const HostelStatusLabel = [
    { id: HostelStatus.Active, name: "Active" },
    { id: HostelStatus.Deactive, name: "Deactive" },
    { id: HostelStatus.UnderMaintenance, name: "Under Maintenance" },
]


export enum DisciplineStatus {
    Pending = 0,
    Investigating = 1,
    Resolved = 2,
    Closed = 3,
}

export const DisciplineStatusLabel = [
    { id: DisciplineStatus.Pending, name: "Pending" },
    { id: DisciplineStatus.Investigating, name: "Investigating" },
    { id: DisciplineStatus.Resolved, name: "Resolved" },
    { id: DisciplineStatus.Closed, name: "Closed" },
]

export enum HostelType {
    Boys = 0,
    Girls = 1,
    CoLiving = 2,
}

export const HostelTypeLabel = [
    { id: HostelType.Boys, name: "Boys" },
    { id: HostelType.Girls, name: "Girls" },
    { id: HostelType.CoLiving, name: "Co-Living" },
]

export enum RoomType {
    Single = 0,
    Double = 1,
    Triple = 2,
}

export const RoomTypeLabel = [
    { id: RoomType.Single, name: "Single" },
    { id: RoomType.Double, name: "Double" },
    { id: RoomType.Triple, name: "Triple" },
]

export enum LifecycleEvent {
    Onboarding = 0,
    Offboarding = 1
}

export const LifecycleEventArray = [
    { id: LifecycleEvent.Onboarding, name: "Onboarding" },
    { id: LifecycleEvent.Offboarding, name: "Off Boarding" },
]

export function getLifecycleEventName(id: number): string {
    return LifecycleEventArray.find(e => e.id === id)?.name || "Unknown";
}

export enum RoomChangeStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export const closeArray = [
    { id: 0, name: 'Draft' },
    { id: 1, name: 'Close' }
];


export const RoomChangeStatusArray = [
    { id: RoomChangeStatus.Pending, name: "Pending" },
    { id: RoomChangeStatus.Approved, name: "Approved" },
    { id: RoomChangeStatus.Rejected, name: "Rejected" },
]

export const enum LeaveTypeFor {
    Employee = 0,
    Student = 1,
    Both = 2
}

export const LeaveTypeForArray = [
    { id: LeaveTypeFor.Employee, name: "Employee" },
    { id: LeaveTypeFor.Student, name: "Student" },
    { id: LeaveTypeFor.Both, name: "Both Employee & Student" },
]

export function getLeaveTypeForName(id: number): string {
    return LeaveTypeForArray.find(e => e.id === id)?.name || "No One";
}

export enum AppointmentEnum {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Completed = 3,
}

export const AppointmentEnumOption = [
    { id: AppointmentEnum.Pending, name: "Pending" },
    { id: AppointmentEnum.Approved, name: "Approved" },
    { id: AppointmentEnum.Rejected, name: "Rejected" },
    { id: AppointmentEnum.Completed, name: "Completed" },
];


export enum PTMStatusEnum {
    Pending = 0,
    Scheduled = 1,
    Ongoing = 2,
    Completed = 3,
    Cancelled = 4,
}

export const PTMStatusEnumOption = [
    { id: PTMStatusEnum.Pending, name: "Pending" },
    { id: PTMStatusEnum.Scheduled, name: "Scheduled" },
    { id: PTMStatusEnum.Ongoing, name: "Ongoing" },
    { id: PTMStatusEnum.Completed, name: "Completed" },
    { id: PTMStatusEnum.Cancelled, name: "Cancelled" },
];


export const enum BoardingType {
    EmployeeOnboarding = 0,
    EmployeeOffboarding = 1,
    StudentOnboarding = 2,
    StudentOffboarding = 3
}



export type OnboardingState = {
    user: User,
    boarding: {
        boarding_type: BoardingType;
        boarding_step: number;
        is_offer_sent?: number;
        is_offer_accepted?: number;
        is_documents_submitted?: number;
        is_background_checked?: number;
        is_account_setup?: number;
        is_orientation_done?: number;
        is_role_training_done?: number;
        is_workspace_setup?: number;
        is_policy_acknowledged?: number;
        is_mentor_assigned?: number;
        is_probation_reviewed?: number;
        is_fully_integrated?: number;
    },
    boarding_logs: {
        id: number,
        step: number,
        created_at: string
    }[]
}

export const DefaultOnboardingState: OnboardingState = {
    user: getDefaultUser(),
    boarding: {
        boarding_type: BoardingType.EmployeeOnboarding,
        boarding_step: 0,
        is_offer_sent: 0,
        is_offer_accepted: 0,
        is_documents_submitted: 0,
        is_background_checked: 0,
        is_account_setup: 0,
        is_orientation_done: 0,
        is_role_training_done: 0,
        is_workspace_setup: 0,
        is_mentor_assigned: 0,
        is_probation_reviewed: 0,
        is_fully_integrated: 0,
    },
    boarding_logs: []
};

export const OnboardingSteps: string[] = [
    'Job Offer',
    'Documents',
    'Background Check',
    'Accounts Setup',
    'Orientation',
    'Role Training',
    'Workspace Setup',
    'Assign Mentor',
    'Probation Review',
    'Completed'
];

export const StudentOnboardingSteps: string[] = [
    'Admission Offer',
    'Document Submission',
    'Profile Setup',
    'Academic Setup',
    'Fee Setup',
    'Fee Payment',
    'Orientation',
    'Completed'
];


export type UserSchedule = {
    id: number;
    organization_id: number;
    user_id: number;
    datetime_start: string;
    datetime_end: string;
    schedule_type: UserScheduleType;
    admission_id?: number;
    admission_window_round_id?: number;
    career_interview_round_id?: number;
    career_application_id?: number;
    class_id?: number;
    section_id?: number;
}


export const enum UserScheduleType {
    Lecture = 0,
    AdmissionInterview = 1,
    CareerInterview = 2
}

export const UserScheduleTypeArray = [
    { id: UserScheduleType.Lecture, name: "Lecture" },
    { id: UserScheduleType.AdmissionInterview, name: "Admission Interview" },
    { id: UserScheduleType.CareerInterview, name: "Career Interview" },
];

export function getUserScheduleTypeName(id: number): string {
    return UserScheduleTypeArray.find(e => e.id === id)?.name || "Unknown";
}

export enum TeacherRecommendation {
    HighlyRecommend = 0,
    Recommend = 1,
    Neutral = 2,
    NotRecommend = 3,
}

export const TeacherRecommendationArray = [
    { id: TeacherRecommendation.HighlyRecommend, name: "Highly Recommend" },
    { id: TeacherRecommendation.Recommend, name: "Recommend" },
    { id: TeacherRecommendation.Neutral, name: "Neutral" },
    { id: TeacherRecommendation.NotRecommend, name: "Would Not Recommend" },
];


export const TreatmentEnumOption = [
    { id: TreatmentEnum.Pending, name: "Pending" },
    { id: TreatmentEnum.Approved, name: "Approved" },
    { id: TreatmentEnum.Rejected, name: "Rejected" },
    { id: TreatmentEnum.Completed, name: "Completed" },
];