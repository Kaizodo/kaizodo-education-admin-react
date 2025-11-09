
export const enum DocumentProviderEnum {
    Organization = 0,
    User = 1
}


export const DocumentProviderArray = [
    { id: DocumentProviderEnum.Organization, name: 'Organization' },
    { id: DocumentProviderEnum.User, name: 'Candidate' }
]

export function getDocumentProviderName(provider: DocumentProviderEnum) {
    return DocumentProviderArray.find(i => i.id == provider)?.name ?? '--';
}

export const enum EmployeeOnBoardingStepEnum {
    JobOffer = 0,
    Documents = 1,
    BackgroundCheck = 2,
    AccountSetup = 3,
    Orientation = 4,
    RoleTraining = 5,
    WorkspaceSetup = 6,
    PolicyAcknowledgment = 7,
    AssignMentor = 8,
    ProbationReview = 9,
    FullIntegration = 10
}

export const EmployeeOnBoardingStepArray = [
    { id: EmployeeOnBoardingStepEnum.JobOffer, name: 'Job Offer', description: 'Offer letter shared with the candidate' },
    { id: EmployeeOnBoardingStepEnum.Documents, name: 'Documents', description: 'Collection of ID, certificates, proofs' },
    { id: EmployeeOnBoardingStepEnum.BackgroundCheck, name: 'Background Check', description: 'Verification of employment, police, references' },
    { id: EmployeeOnBoardingStepEnum.AccountSetup, name: 'Account Setup', description: 'Payroll, email, HR portal account creation' },
    { id: EmployeeOnBoardingStepEnum.Orientation, name: 'Orientation', description: 'Introduction to school, culture, policies' },
    { id: EmployeeOnBoardingStepEnum.RoleTraining, name: 'Role Training', description: 'Training for job-specific duties' },
    { id: EmployeeOnBoardingStepEnum.WorkspaceSetup, name: 'Workspace Setup', description: 'Providing workstation, tools, resources' },
    { id: EmployeeOnBoardingStepEnum.PolicyAcknowledgment, name: 'Policy Acknowledgment', description: 'Acknowledging HR, safety, compliance policies' },
    { id: EmployeeOnBoardingStepEnum.AssignMentor, name: 'Assign Mentor', description: 'Assigning buddy/mentor for guidance' },
    { id: EmployeeOnBoardingStepEnum.ProbationReview, name: 'Probation Review', description: 'Performance review after probation period' },
    { id: EmployeeOnBoardingStepEnum.FullIntegration, name: 'Full Integration', description: 'Employee fully integrated into school operations' }
];

export function getEmployeeOnBoardingStepName(step: EmployeeOnBoardingStepEnum) {
    return EmployeeOnBoardingStepArray.find(i => i.id === step)?.name ?? '--';
}

export const enum EmployeeOffBoardingStepEnum {
    Notice = 0,
    KnowledgeHandover = 1,
    AssetRecovery = 2,
    Clearances = 3,
    ExitInterview = 4,
    FinalSettlement = 5,
    Documentation = 6,
    UpdateRecords = 7
}

export const EmployeeOffBoardingStepArray = [
    { id: EmployeeOffBoardingStepEnum.Notice, name: 'Notice', description: 'Resignation or termination notice submitted/issued' },
    { id: EmployeeOffBoardingStepEnum.KnowledgeHandover, name: 'Knowledge Handover', description: 'Transfer of duties, class notes, reports, logs' },
    { id: EmployeeOffBoardingStepEnum.AssetRecovery, name: 'Asset Recovery', description: 'Return of ID cards, keys, laptops, uniforms, devices' },
    { id: EmployeeOffBoardingStepEnum.Clearances, name: 'Clearances', description: 'Settling library, IT, accounts, and inventory dues' },
    { id: EmployeeOffBoardingStepEnum.ExitInterview, name: 'Exit Interview', description: 'HR session to capture feedback from employee' },
    { id: EmployeeOffBoardingStepEnum.FinalSettlement, name: 'Final Settlement', description: 'Salary dues, PF/ESI, gratuity, leave encashment' },
    { id: EmployeeOffBoardingStepEnum.Documentation, name: 'Documentation', description: 'Relieving letter, experience certificate, clearance forms' },
    { id: EmployeeOffBoardingStepEnum.UpdateRecords, name: 'Update Records', description: 'Update HR, payroll, disable accounts, remove access' }
];

export function getOffBoardingStepName(step: EmployeeOffBoardingStepEnum) {
    return EmployeeOffBoardingStepArray.find(i => i.id === step)?.name ?? '--';
}

export function getOffBoardingStepDescription(step: EmployeeOffBoardingStepEnum) {
    return EmployeeOffBoardingStepArray.find(i => i.id === step)?.description ?? '--';
}
