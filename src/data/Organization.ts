export interface Organization {
    id: number;
    name: string;
    gst_number: string;
    billing_address: string;
    code: string;
    logo_short: string;
    logo_full: string;
}

export const enum StoreOnboardingStep {
    BasicDetails = 1,
    BillingInformation = 2,
    ProductCategories = 3,
    Employees = 4,
    Domain = 5,
    Settings = 6,
    Navigation = 7,
    ConfirmSubmition = 8
}



export const enum OrganizationOnboardingStep {
    BasicDetails = 1,
    AdditionalInformation = 2,
    Qualifications = 3,
    AchievementsAndMeritDetails = 4,
    SiblingDetails = 5,
    Address = 6,
    ParentDetails = 7,
    MedicalDetails = 8,
    UploadDocuments = 9,
    ConfirmSubmition = 10,
    TrackApplication = 11
}


export const enum OrganizationType {
    School = 0,
    College = 1,
    University = 2,
    Institute = 3,
    TrainingCenter = 4,
    CoachingCenter = 5,
    ResearchInstitute = 6,
}

export const OrganizationTypeArray = [
    { id: OrganizationType.School, name: "School", description: "Basic education (primary to secondary)." },
    { id: OrganizationType.College, name: "College", description: "Undergraduate or pre-university education." },
    { id: OrganizationType.University, name: "University", description: "Degree-granting and research institution." },
    { id: OrganizationType.Institute, name: "Institute", description: "Specialized field-focused education." },
    { id: OrganizationType.TrainingCenter, name: "Training Center", description: "Practical or job-oriented skill training." },
    { id: OrganizationType.CoachingCenter, name: "Coaching Center", description: "Exam or test preparation center." },
    { id: OrganizationType.ResearchInstitute, name: "Research Institute", description: "Advanced studies and scientific research." },
];

export function getOrganizationTypeName(id: OrganizationType): string {
    return OrganizationTypeArray.find(t => t.id === id)?.name || "Unknown";
}

export const enum CurriculumType {
    Domestic = 0,
    International = 1,
}

export const CurriculumTypeArray = [
    { id: CurriculumType.Domestic, name: "Domestic", description: "Follows the country’s national curriculum." },
    { id: CurriculumType.International, name: "International", description: "Follows an international curriculum (IB, Cambridge, etc.)." },
];

export function getCurriculumTypeName(id: CurriculumType): string {
    return CurriculumTypeArray.find(t => t.id === id)?.name || "Unknown";
}
