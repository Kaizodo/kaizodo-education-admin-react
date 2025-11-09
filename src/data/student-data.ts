export interface Student {
    id: string;
    studentId: string;
    name: string;
    class: string;
    overallGrade: number;
    attendance: number;
    parentName: string;
    email: string;
    avatar?: string;
}

export const studentData: Student[] = [
    {
        id: '1',
        studentId: 'STU001',
        name: 'Emma Johnson',
        class: 'grade-10',
        overallGrade: 94,
        attendance: 96,
        parentName: 'Sarah Johnson',
        email: 'emma.johnson@school.edu',
        avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '2',
        studentId: 'STU002',
        name: 'Michael Chen',
        class: 'grade-10',
        overallGrade: 87,
        attendance: 94,
        parentName: 'David Chen',
        email: 'michael.chen@school.edu',
        avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '3',
        studentId: 'STU003',
        name: 'Sofia Rodriguez',
        class: 'grade-11',
        overallGrade: 91,
        attendance: 98,
        parentName: 'Maria Rodriguez',
        email: 'sofia.rodriguez@school.edu',
        avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '4',
        studentId: 'STU004',
        name: 'James Wilson',
        class: 'grade-9',
        overallGrade: 78,
        attendance: 89,
        parentName: 'Robert Wilson',
        email: 'james.wilson@school.edu',
        avatar: 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '5',
        studentId: 'STU005',
        name: 'Aisha Patel',
        class: 'grade-12',
        overallGrade: 96,
        attendance: 97,
        parentName: 'Raj Patel',
        email: 'aisha.patel@school.edu',
        avatar: 'https://images.pexels.com/photos/3771690/pexels-photo-3771690.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '6',
        studentId: 'STU006',
        name: 'Daniel Kim',
        class: 'grade-11',
        overallGrade: 82,
        attendance: 91,
        parentName: 'Jennifer Kim',
        email: 'daniel.kim@school.edu',
        avatar: 'https://images.pexels.com/photos/3771703/pexels-photo-3771703.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '7',
        studentId: 'STU007',
        name: 'Isabella Martinez',
        class: 'grade-10',
        overallGrade: 89,
        attendance: 95,
        parentName: 'Carlos Martinez',
        email: 'isabella.martinez@school.edu',
        avatar: 'https://images.pexels.com/photos/3768997/pexels-photo-3768997.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '8',
        studentId: 'STU008',
        name: 'Ryan Thompson',
        class: 'grade-12',
        overallGrade: 85,
        attendance: 92,
        parentName: 'Michelle Thompson',
        email: 'ryan.thompson@school.edu',
        avatar: 'https://images.pexels.com/photos/3771121/pexels-photo-3771121.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '9',
        studentId: 'STU009',
        name: 'Zara Ahmed',
        class: 'grade-9',
        overallGrade: 92,
        attendance: 99,
        parentName: 'Fatima Ahmed',
        email: 'zara.ahmed@school.edu',
        avatar: 'https://images.pexels.com/photos/3771045/pexels-photo-3771045.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '10',
        studentId: 'STU010',
        name: 'Lucas Brown',
        class: 'grade-11',
        overallGrade: 74,
        attendance: 87,
        parentName: 'Amanda Brown',
        email: 'lucas.brown@school.edu',
        avatar: 'https://images.pexels.com/photos/3771077/pexels-photo-3771077.jpeg?w=150&h=150&fit=crop&crop=face'
    }
];

export const attendanceData = [
    { date: '1', present: 95, absent: 8, late: 3 },
    { date: '2', present: 92, absent: 11, late: 2 },
    { date: '3', present: 98, absent: 5, late: 1 },
    { date: '4', present: 94, absent: 9, late: 4 },
    { date: '5', present: 96, absent: 7, late: 2 },
    { date: '6', present: 93, absent: 10, late: 3 },
    { date: '7', present: 97, absent: 6, late: 1 },
    { date: '8', present: 91, absent: 12, late: 5 },
    { date: '9', present: 99, absent: 4, late: 2 },
    { date: '10', present: 95, absent: 8, late: 3 },
    { date: '11', present: 94, absent: 9, late: 2 },
    { date: '12', present: 96, absent: 7, late: 1 },
    { date: '13', present: 98, absent: 5, late: 2 },
    { date: '14', present: 93, absent: 10, late: 4 },
    { date: '15', present: 97, absent: 6, late: 1 },
];

export const monthlyAttendance = [
    { month: 'September', rate: 94.2 },
    { month: 'October', rate: 95.8 },
    { month: 'November', rate: 92.1 },
    { month: 'December', rate: 96.5 },
    { month: 'January', rate: 93.7 },
    { month: 'February', rate: 97.2 },
    { month: 'March', rate: 95.4 },
];

export const academicData = [
    { month: 'Sep', mathematics: 82, english: 78, science: 85 },
    { month: 'Oct', mathematics: 84, english: 81, science: 87 },
    { month: 'Nov', mathematics: 86, english: 83, science: 89 },
    { month: 'Dec', mathematics: 88, english: 85, science: 91 },
    { month: 'Jan', mathematics: 87, english: 87, science: 90 },
    { month: 'Feb', mathematics: 89, english: 88, science: 92 },
    { month: 'Mar', mathematics: 91, english: 90, science: 94 },
];

export const gradeDistribution = [
    { grade: 'A+ (90-100)', students: 23 },
    { grade: 'A (80-89)', students: 35 },
    { grade: 'B (70-79)', students: 28 },
    { grade: 'C (60-69)', students: 12 },
    { grade: 'D (50-59)', students: 4 },
    { grade: 'F (<50)', students: 2 },
];

export const subjectPerformance = [
    { name: 'Mathematics', value: 87 },
    { name: 'English', value: 84 },
    { name: 'Science', value: 89 },
    { name: 'History', value: 82 },
    { name: 'Art', value: 91 },
];


export const mockData = {
    '2024': {
        'January': {
            attendance: 92,
            tardiness: 5,
            absence: 3,
            monthlyTrend: [
                { name: 'Week 1', present: 90, absent: 10 },
                { name: 'Week 2', present: 95, absent: 5 },
                { name: 'Week 3', present: 92, absent: 8 },
                { name: 'Week 4', present: 91, absent: 9 },
            ],
            studentDetails: [
                { id: 1, name: 'John Doe', present: 20, absent: 2, tardy: 1 },
                { id: 2, name: 'Jane Smith', present: 22, absent: 0, tardy: 0 },
                { id: 3, name: 'Peter Jones', present: 18, absent: 4, tardy: 2 },
                { id: 4, name: 'Mary Williams', present: 21, absent: 1, tardy: 0 },
            ],
        },
        'February': {
            attendance: 95,
            tardiness: 3,
            absence: 2,
            monthlyTrend: [
                { name: 'Week 1', present: 94, absent: 6 },
                { name: 'Week 2', present: 96, absent: 4 },
                { name: 'Week 3', present: 93, absent: 7 },
                { name: 'Week 4', present: 97, absent: 3 },
            ],
            studentDetails: [
                { id: 1, name: 'John Doe', present: 19, absent: 1, tardy: 0 },
                { id: 2, name: 'Jane Smith', present: 20, absent: 0, tardy: 0 },
                { id: 3, name: 'Peter Jones', present: 17, absent: 3, tardy: 1 },
                { id: 4, name: 'Mary Williams', present: 20, absent: 0, tardy: 0 },
            ],
        },
        'March': {
            attendance: 88,
            tardiness: 8,
            absence: 4,
            monthlyTrend: [
                { name: 'Week 1', present: 85, absent: 15 },
                { name: 'Week 2', present: 89, absent: 11 },
                { name: 'Week 3', present: 87, absent: 13 },
                { name: 'Week 4', present: 91, absent: 9 },
            ],
            studentDetails: [
                { id: 1, name: 'John Doe', present: 18, absent: 2, tardy: 2 },
                { id: 2, name: 'Jane Smith', present: 20, absent: 0, tardy: 0 },
                { id: 3, name: 'Peter Jones', present: 16, absent: 4, tardy: 2 },
                { id: 4, name: 'Mary Williams', present: 19, absent: 1, tardy: 0 },
            ],
        },
        // Add more months for 2024...
    },
    '2023': {
        'January': {
            attendance: 85,
            tardiness: 10,
            absence: 5,
            monthlyTrend: [
                { name: 'Week 1', present: 82, absent: 18 },
                { name: 'Week 2', present: 86, absent: 14 },
                { name: 'Week 3', present: 84, absent: 16 },
                { name: 'Week 4', present: 88, absent: 12 },
            ],
            studentDetails: [
                { id: 1, name: 'John Doe', present: 18, absent: 4, tardy: 2 },
                { id: 2, name: 'Jane Smith', present: 20, absent: 2, tardy: 1 },
                { id: 3, name: 'Peter Jones', present: 15, absent: 7, tardy: 3 },
                { id: 4, name: 'Mary Williams', present: 19, absent: 3, tardy: 1 },
            ],
        },
        // Add more months for 2023...
    },
};