export interface KPIData {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  suffix?: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface Activity {
  id: string;
  type: 'student' | 'teacher' | 'fee' | 'event' | 'announcement';
  title: string;
  description: string;
  time: string;
  status?: 'completed' | 'pending' | 'overdue';
}

export interface Student {
  id: string;
  name: string;
  class: string;
  attendance: number;
  grade: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  experience: number;
  classes: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
}

export interface LibraryStats {
  totalBooks: number;
  issuedBooks: number;
  returnedToday: number;
  newArrivals: number;
  popularBooks: Array<{
    title: string;
    issued: number;
  }>;
}

export interface TransportData {
  totalBuses: number;
  activeRoutes: number;
  studentsUsingTransport: number;
  maintenanceScheduled: number;
}
export const kpiData: KPIData[] = [
  {
    id: '1',
    title: 'Total Students',
    value: 1284,
    change: 12.5,
    changeType: 'increase',
    icon: 'Users',
    color: 'blue'
  },
  {
    id: '2',
    title: 'Total Teachers',
    value: 89,
    change: 5.2,
    changeType: 'increase',
    icon: 'UserCheck',
    color: 'green'
  },
  {
    id: '3',
    title: 'Average Attendance',
    value: '94.2',
    change: 2.1,
    changeType: 'increase',
    icon: 'Calendar',
    color: 'purple',
    suffix: '%'
  },
  {
    id: '4',
    title: 'Fee Collection',
    value: 6750000,
    change: -3.2,
    changeType: 'decrease',
    icon: 'DollarSign',
    color: 'orange',
    suffix: ''
  },
  {
    id: '5',
    title: 'Pending Fees',
    value: 345000,
    change: -8.5,
    changeType: 'decrease',
    icon: 'AlertCircle',
    color: 'red',
    suffix: ''
  },
  {
    id: '6',
    title: 'Active Classes',
    value: 42,
    change: 0,
    changeType: 'neutral',
    icon: 'BookOpen',
    color: 'blue'
  },
  {
    id: '7',
    title: 'Pass Percentage',
    value: '96.8',
    change: 4.2,
    changeType: 'increase',
    icon: 'Award',
    color: 'green',
    suffix: '%'
  },
  {
    id: '8',
    title: 'Library Books',
    value: 15420,
    change: 8.3,
    changeType: 'increase',
    icon: 'Book',
    color: 'purple'
  }
];

export const attendanceData: ChartData[] = [
  { name: 'Mon', value: 92 },
  { name: 'Tue', value: 95 },
  { name: 'Wed', value: 89 },
  { name: 'Thu', value: 97 },
  { name: 'Fri', value: 91 },
  { name: 'Sat', value: 88 },
  { name: 'Sun', value: 0 }
];

export const monthlyAttendanceData: ChartData[] = [
  { name: 'Apr', value: 94.2 },
  { name: 'May', value: 96.1 },
  { name: 'Jun', value: 93.8 },
  { name: 'Jul', value: 95.4 },
  { name: 'Aug', value: 97.2 },
  { name: 'Sep', value: 94.7 },
  { name: 'Oct', value: 96.3 },
  { name: 'Nov', value: 95.8 }
];

export const revenueData: ChartData[] = [
  { name: 'Apr', value: 6400000 },
  { name: 'May', value: 6950000 },
  { name: 'Jun', value: 6720000 },
  { name: 'Jul', value: 7180000 },
  { name: 'Aug', value: 7700000 },
  { name: 'Sep', value: 7400000 },
  { name: 'Oct', value: 7850000 },
  { name: 'Nov', value: 7650000 }
];

export const gradeDistribution: ChartData[] = [
  { name: 'A+ (90-100%)', value: 156 },
  { name: 'A (80-89%)', value: 298 },
  { name: 'B+ (70-79%)', value: 345 },
  { name: 'B (60-69%)', value: 289 },
  { name: 'C+ (50-59%)', value: 134 },
  { name: 'C (40-49%)', value: 62 }
];

export const classWiseData: ChartData[] = [
  { name: 'Class I', value: 120 },
  { name: 'Class II', value: 115 },
  { name: 'Class III', value: 108 },
  { name: 'Class IV', value: 112 },
  { name: 'Class V', value: 105 },
  { name: 'Class VI', value: 98 },
  { name: 'Class VII', value: 95 },
  { name: 'Class VIII', value: 92 },
  { name: 'Class IX', value: 88 },
  { name: 'Class X', value: 85 },
  { name: 'Class XI', value: 82 },
  { name: 'Class XII', value: 78 }
];

export const subjectPerformance: ChartData[] = [
  { name: 'Mathematics', value: 87.5 },
  { name: 'Science', value: 89.2 },
  { name: 'English', value: 91.8 },
  { name: 'Hindi', value: 93.4 },
  { name: 'Social Studies', value: 88.7 },
  { name: 'Computer Science', value: 85.3 }
];

export const examResults: ChartData[] = [
  { name: 'First Term', value: 94.2 },
  { name: 'Mid Term', value: 91.8 },
  { name: 'Pre-Board', value: 89.5 },
  { name: 'Final', value: 96.8 }
];

export const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'student',
    title: 'New Student Admission',
    description: 'Priya Sharma admitted to Class X-A',
    time: '2 minutes ago',
    status: 'completed'
  },
  {
    id: '2',
    type: 'fee',
    title: 'Fee Payment Received',
    description: 'Rahul Kumar - Class VIII-B paid quarterly fees ₹15,000',
    time: '15 minutes ago',
    status: 'completed'
  },
  {
    id: '3',
    type: 'teacher',
    title: 'Teacher Leave Application',
    description: 'Mrs. Sunita Devi applied for medical leave',
    time: '1 hour ago',
    status: 'pending'
  },
  {
    id: '4',
    type: 'event',
    title: 'Parent-Teacher Meeting',
    description: 'Scheduled for Saturday at 10:00 AM',
    time: '3 hours ago',
    status: 'pending'
  },
  {
    id: '5',
    type: 'announcement',
    title: 'Diwali Holiday Notice',
    description: 'School closed from 12th to 16th November',
    time: '5 hours ago',
    status: 'completed'
  },
  {
    id: '6',
    type: 'event',
    title: 'Annual Sports Day',
    description: 'Sports day preparations completed',
    time: '1 day ago',
    status: 'completed'
  },
  {
    id: '7',
    type: 'fee',
    title: 'Fee Reminder Sent',
    description: 'Quarterly fee reminders sent to 45 parents',
    time: '2 days ago',
    status: 'completed'
  }
];

export const topStudents: Student[] = [
  { id: '1', name: 'Aarav Patel', class: 'XII-A', attendance: 98.5, grade: 'A+' },
  { id: '2', name: 'Diya Sharma', class: 'XI-B', attendance: 97.2, grade: 'A+' },
  { id: '3', name: 'Arjun Singh', class: 'X-A', attendance: 96.8, grade: 'A' },
  { id: '4', name: 'Kavya Reddy', class: 'XII-C', attendance: 95.9, grade: 'A' },
  { id: '5', name: 'Rohan Gupta', class: 'XI-A', attendance: 95.4, grade: 'A' },
  { id: '6', name: 'Ananya Joshi', class: 'X-B', attendance: 94.8, grade: 'A' },
  { id: '7', name: 'Karan Mehta', class: 'IX-A', attendance: 94.2, grade: 'A' }
];

export const teachers: Teacher[] = [
  { id: '1', name: 'Dr. Rajesh Kumar', subject: 'Mathematics', experience: 15, classes: 6 },
  { id: '2', name: 'Mrs. Sunita Devi', subject: 'English', experience: 12, classes: 5 },
  { id: '3', name: 'Mr. Amit Sharma', subject: 'Physics', experience: 8, classes: 4 },
  { id: '4', name: 'Ms. Priya Singh', subject: 'Chemistry', experience: 10, classes: 5 },
  { id: '5', name: 'Mrs. Kavita Jain', subject: 'Biology', experience: 14, classes: 4 },
  { id: '6', name: 'Mr. Suresh Yadav', subject: 'Hindi', experience: 18, classes: 6 }
];

export const upcomingEvents = [
  { id: '1', title: 'Annual Function', date: '2024-12-15', type: 'Cultural' },
  { id: '2', title: 'Parent-Teacher Meeting', date: '2024-11-25', type: 'Academic' },
  { id: '3', title: 'Science Exhibition', date: '2024-12-05', type: 'Academic' },
  { id: '4', title: 'Sports Day', date: '2024-12-20', type: 'Sports' },
  { id: '5', title: 'Winter Break Begins', date: '2024-12-22', type: 'Holiday' }
];

export const libraryStats = {
  totalBooks: 15420,
  issuedBooks: 3240,
  returnedToday: 45,
  newArrivals: 120,
  popularBooks: [
    { title: 'NCERT Mathematics Class X', issued: 45 },
    { title: 'RD Sharma Physics', issued: 38 },
    { title: 'English Grammar & Composition', issued: 32 },
    { title: 'Indian History Textbook', issued: 28 }
  ]
};

export const transportData = {
  totalBuses: 25,
  activeRoutes: 18,
  studentsUsingTransport: 856,
  maintenanceScheduled: 3
};