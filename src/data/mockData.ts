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



export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type LeadSource = "website" | "referral" | "social" | "email" | "cold-call" | "event";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: LeadStatus;
  source: LeadSource;
  priority: Priority;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  notes: string;
  tags: string[];
}

export interface Activity {
  id: string;
  leadId: string;
  type: "call" | "email" | "meeting" | "note" | "task";
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    position: "VP of Sales",
    status: "qualified",
    source: "website",
    priority: "high",
    value: 45000,
    assignedTo: "John Doe",
    createdAt: "2024-01-15",
    lastContact: "2024-01-20",
    notes: "Interested in enterprise plan. Follow up next week.",
    tags: ["Enterprise", "Hot Lead"],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@innovate.io",
    phone: "+1 (555) 234-5678",
    company: "Innovate Labs",
    position: "CTO",
    status: "proposal",
    source: "referral",
    priority: "urgent",
    value: 78000,
    assignedTo: "Jane Smith",
    createdAt: "2024-01-10",
    lastContact: "2024-01-22",
    notes: "Proposal sent. Waiting for board approval.",
    tags: ["Technical", "Decision Maker"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@startup.com",
    phone: "+1 (555) 345-6789",
    company: "StartupXYZ",
    position: "Founder",
    status: "contacted",
    source: "social",
    priority: "medium",
    value: 23000,
    assignedTo: "John Doe",
    createdAt: "2024-01-18",
    lastContact: "2024-01-19",
    notes: "Schedule demo for next week.",
    tags: ["Startup", "Fast Growing"],
  },
  {
    id: "4",
    name: "David Park",
    email: "d.park@megacorp.com",
    phone: "+1 (555) 456-7890",
    company: "MegaCorp Industries",
    position: "Director of Operations",
    status: "negotiation",
    source: "event",
    priority: "high",
    value: 125000,
    assignedTo: "Jane Smith",
    createdAt: "2024-01-05",
    lastContact: "2024-01-23",
    notes: "Negotiating contract terms. Price point agreed.",
    tags: ["Large Enterprise", "Multi-year"],
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.t@designco.com",
    phone: "+1 (555) 567-8901",
    company: "Design Co",
    position: "Creative Director",
    status: "new",
    source: "website",
    priority: "low",
    value: 15000,
    assignedTo: "Tom Wilson",
    createdAt: "2024-01-23",
    lastContact: "2024-01-23",
    notes: "Just signed up. Need to reach out.",
    tags: ["New", "Design Industry"],
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.w@finance.com",
    phone: "+1 (555) 678-9012",
    company: "Finance Plus",
    position: "CFO",
    status: "won",
    source: "referral",
    priority: "high",
    value: 95000,
    assignedTo: "John Doe",
    createdAt: "2024-01-01",
    lastContact: "2024-01-15",
    notes: "Contract signed. Onboarding scheduled.",
    tags: ["Closed Won", "Finance"],
  },
  {
    id: "7",
    name: "Amanda Foster",
    email: "a.foster@retailco.com",
    phone: "+1 (555) 789-0123",
    company: "Retail Co",
    position: "Marketing Manager",
    status: "lost",
    source: "cold-call",
    priority: "low",
    value: 18000,
    assignedTo: "Tom Wilson",
    createdAt: "2024-01-08",
    lastContact: "2024-01-20",
    notes: "Went with competitor. Budget constraints.",
    tags: ["Lost", "Price Sensitive"],
  },
  {
    id: "8",
    name: "Robert Kim",
    email: "r.kim@healthtech.com",
    phone: "+1 (555) 890-1234",
    company: "HealthTech Inc",
    position: "Product Manager",
    status: "qualified",
    source: "email",
    priority: "medium",
    value: 52000,
    assignedTo: "Jane Smith",
    createdAt: "2024-01-12",
    lastContact: "2024-01-21",
    notes: "Interested in Q2 implementation.",
    tags: ["Healthcare", "Q2 Target"],
  },
];

export const mockActivities: Activity[] = [
  {
    id: "a1",
    leadId: "1",
    type: "email",
    title: "Sent proposal document",
    description: "Sent detailed proposal with pricing and implementation timeline.",
    timestamp: "2024-01-20T10:30:00",
    user: "John Doe",
  },
  {
    id: "a2",
    leadId: "1",
    type: "call",
    title: "Discovery call completed",
    description: "45-minute call discussing requirements and pain points.",
    timestamp: "2024-01-18T14:00:00",
    user: "John Doe",
  },
  {
    id: "a3",
    leadId: "2",
    type: "meeting",
    title: "Product demo",
    description: "Technical demo with engineering team. Very positive feedback.",
    timestamp: "2024-01-22T11:00:00",
    user: "Jane Smith",
  },
  {
    id: "a4",
    leadId: "2",
    type: "note",
    title: "Board meeting scheduled",
    description: "Client scheduled internal board meeting for Jan 28 to review proposal.",
    timestamp: "2024-01-21T16:45:00",
    user: "Jane Smith",
  },
  {
    id: "a5",
    leadId: "3",
    type: "task",
    title: "Schedule demo",
    description: "Need to schedule product demo for next week.",
    timestamp: "2024-01-19T09:00:00",
    user: "John Doe",
  },
];

export const getLeadById = (id: string): Lead | undefined => {
  return mockLeads.find((lead) => lead.id === id);
};

export const getActivitiesByLeadId = (leadId: string): Activity[] => {
  return mockActivities.filter((activity) => activity.leadId === leadId);
};

export const getLeadsByStatus = (status: LeadStatus): Lead[] => {
  return mockLeads.filter((lead) => lead.status === status);
};

export const statusConfig = {
  new: { label: "New", color: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-indigo-500" },
  qualified: { label: "Qualified", color: "bg-purple-500" },
  proposal: { label: "Proposal", color: "bg-amber-500" },
  negotiation: { label: "Negotiation", color: "bg-orange-500" },
  won: { label: "Won", color: "bg-success" },
  lost: { label: "Lost", color: "bg-destructive" },
};

export const priorityConfig = {
  low: { label: "Low", color: "text-muted-foreground" },
  medium: { label: "Medium", color: "text-primary" },
  high: { label: "High", color: "text-warning" },
  urgent: { label: "Urgent", color: "text-destructive" },
};
