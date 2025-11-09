

export enum JobApplicationStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export const JobApplicationStatusArray = [
    { id: JobApplicationStatus.Pending, name: 'Pending' },
    { id: JobApplicationStatus.Approved, name: 'Approved' },
    { id: JobApplicationStatus.Rejected, name: 'Rejected' }
];

export function getJobApplicationStatusName(status: JobApplicationStatus) {
    return JobApplicationStatusArray.find(s => s.id == status)?.name ?? 'Pending';
}


export enum JobType {
    Fulltime = 0,
    Parttime = 1,
    Contract = 2,
    Temporary = 3,
    Internship = 4,
    Volunteer = 5,
    Freelance = 6,
    Consultant = 7,
    OnCall = 8,
    VisitingFaculty = 9
}

export const JobTypeArray = [
    { id: JobType.Fulltime, name: 'Full-time' },
    { id: JobType.Parttime, name: 'Part-time' },
    { id: JobType.Contract, name: 'Contract' },
    { id: JobType.Temporary, name: 'Temporary' },
    { id: JobType.Internship, name: 'Internship' },
    { id: JobType.Volunteer, name: 'Volunteer' },
    { id: JobType.Freelance, name: 'Freelance' },
    { id: JobType.Consultant, name: 'Consultant' },
    { id: JobType.OnCall, name: 'On-call' },
    { id: JobType.VisitingFaculty, name: 'Visiting Faculty' }
];

export const getJobTypeName = (id: number): string => {
    const type = JobTypeArray.find(t => Number(t.id) === Number(id));
    return type ? type.name : 'Unknown';
};

import { Type, Edit3, List, Circle, CheckSquare, MessageSquare, Video, User, FileText, Users } from "lucide-react";

export enum CareerCustomFieldType {
    Text = 0,
    Textarea = 1,
    Number = 2,
    Select = 3,
    Radio = 4,
    Checkbox = 5
}

export const CareerCustomFieldTypeArray = [
    { id: CareerCustomFieldType.Text, name: 'Text Input', icon: Type },
    { id: CareerCustomFieldType.Textarea, name: 'Text Area', icon: Edit3 },
    { id: CareerCustomFieldType.Number, name: 'Number', icon: Type },
    { id: CareerCustomFieldType.Select, name: 'Dropdown', icon: List },
    { id: CareerCustomFieldType.Radio, name: 'Radio Buttons', icon: Circle },
    { id: CareerCustomFieldType.Checkbox, name: 'Checkboxes', icon: CheckSquare }
];

export const getCareerCustomFieldTypeLabel = (value: number): string => {
    const type = CareerCustomFieldTypeArray.find(f => f.id === value);
    return type ? type.name : 'Unknown';
};



// Enum
export enum CareerInterviewRoundType {
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
    Final = 13
}

// Array
export const CareerInterviewRoundTypes = [
    { id: CareerInterviewRoundType.Phone, name: 'Phone Call', icon: MessageSquare, color: 'bg-blue-500' },
    { id: CareerInterviewRoundType.Video, name: 'Video Call', icon: Video, color: 'bg-green-500' },
    { id: CareerInterviewRoundType.InPerson, name: 'In-Person', icon: User, color: 'bg-purple-500' },
    { id: CareerInterviewRoundType.Technical, name: 'Technical Assessment', icon: FileText, color: 'bg-orange-500' },
    { id: CareerInterviewRoundType.Presentation, name: 'Presentation', icon: FileText, color: 'bg-pink-500' },
    { id: CareerInterviewRoundType.Panel, name: 'Panel Interview', icon: Users, color: 'bg-indigo-500' },
    { id: CareerInterviewRoundType.HR, name: 'HR Interview', icon: User, color: 'bg-teal-500' },
    { id: CareerInterviewRoundType.GroupDiscussion, name: 'Group Discussion', icon: Users, color: 'bg-yellow-500' },
    { id: CareerInterviewRoundType.CaseStudy, name: 'Case Study', icon: FileText, color: 'bg-red-500' },
    { id: CareerInterviewRoundType.Coding, name: 'Coding Test', icon: FileText, color: 'bg-cyan-500' },
    { id: CareerInterviewRoundType.Behavioral, name: 'Behavioral Interview', icon: User, color: 'bg-gray-500' },
    { id: CareerInterviewRoundType.Managerial, name: 'Managerial Interview', icon: User, color: 'bg-lime-500' },
    { id: CareerInterviewRoundType.Final, name: 'Final Round', icon: Users, color: 'bg-rose-500' }
];


export const getCareerInterviewRoundType = (id: number) =>
    CareerInterviewRoundTypes.find(type => type.id === id) ?? {
        id: 0,
        name: 'Select Round Type',
        icon: MessageSquare,
        color: 'bg-blue-500'
    };
