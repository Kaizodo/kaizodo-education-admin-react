import React, { useState } from 'react';
import {
    User,
    Calendar,
    GraduationCap,
    Award,
    TrendingUp,
    Clock,
    BookOpen,
    Target,
    Star,
    MessageCircle,
    Users,
    Activity,
    CheckCircle,
    AlertCircle,
    XCircle,
    Brain,
    Heart,
    Lightbulb,
    Zap,
    Eye,
    Compass,
    BarChart3,
    Sparkles,
    Bot,
    UserCheck,
    Focus,
    Briefcase,
    ChevronRight,
    Info,
    Home
} from 'lucide-react';
import moment from 'moment';
import { getGenderName, getBloodGroupName } from '@/data/user';
import { FaVenusMars, FaCalendar, FaTint, FaPray, FaUsers, FaUserTag, FaIdCard, FaSchool } from 'react-icons/fa';
import { LuBookHeart } from 'react-icons/lu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { nameLetter } from '@/lib/utils';

interface StudentData {
    id: string;
    name: string;
    class: string;
    rollNumber: string;
    admissionDate: string;
    dateOfBirth: string;
    photo: string;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    address: string;
    overallGrade: string;
    gpa: number;
    attendance: number;
    subjects: SubjectPerformance[];
    behaviorScore: number;
    extracurricular: Activity[];
    achievements: Achievement[];
    recentActivity: ActivityLog[];
    teacherFeedback: Feedback[];
    skillsAssessment: SkillScore[];
    feeStatus: string;
    psychometricProfile: PsychometricProfile;
    aiPsychometricAnalysis: AIPsychometricAnalysis;
}

interface SubjectPerformance {
    subject: string;
    currentGrade: string;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
    assignments: number;
    testsCompleted: number;
    color: string;
}

interface Activity {
    name: string;
    role: string;
    performance: string;
}

interface Achievement {
    title: string;
    date: string;
    category: string;
    description: string;
}

interface ActivityLog {
    date: string;
    activity: string;
    type: 'academic' | 'behavioral' | 'attendance' | 'achievement';
}

interface Feedback {
    teacher: string;
    subject: string;
    comment: string;
    date: string;
    rating: number;
}

interface SkillScore {
    skill: string;
    score: number;
    maxScore: number;
}

interface PsychometricProfile {
    counselorName: string;
    lastAssessmentDate: string;
    personalityType: string;
    learningStyle: string;
    intelligenceTypes: IntelligenceType[];
    emotionalIntelligence: EmotionalIntelligence;
    careerInterests: CareerInterest[];
    strengthsAndWeaknesses: {
        strengths: string[];
        areasForImprovement: string[];
    };
    recommendedFocusAreas: string[];
    counselorNotes: string;
    nextAssessmentDue: string;
}

interface IntelligenceType {
    type: string;
    score: number;
    description: string;
    icon: string;
}

interface EmotionalIntelligence {
    selfAwareness: number;
    selfRegulation: number;
    motivation: number;
    empathy: number;
    socialSkills: number;
}

interface CareerInterest {
    field: string;
    interestLevel: number;
    aptitudeMatch: number;
    description: string;
    recommendedSubjects: string[];
}

interface AIPsychometricAnalysis {
    lastAnalysisDate: string;
    cognitiveProfile: CognitiveProfile;
    behavioralPatterns: BehavioralPattern[];
    learningRecommendations: LearningRecommendation[];
    riskFactors: RiskFactor[];
    potentialIndicators: PotentialIndicator[];
    aiConfidenceScore: number;
    predictiveInsights: PredictiveInsight[];
}

interface CognitiveProfile {
    processingSpeed: number;
    workingMemory: number;
    attention: number;
    reasoning: number;
    creativity: number;
}

interface BehavioralPattern {
    pattern: string;
    frequency: string;
    impact: 'positive' | 'neutral' | 'negative';
    description: string;
}

interface LearningRecommendation {
    category: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
    expectedOutcome: string;
}

interface RiskFactor {
    factor: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    intervention: string;
}

interface PotentialIndicator {
    area: string;
    score: number;
    description: string;
    developmentPath: string;
}

interface PredictiveInsight {
    insight: string;
    probability: number;
    timeframe: string;
    actionItems: string[];
}

const mockStudentData: StudentData = {
    id: "STU001",
    name: "Emily Johnson",
    class: "Grade 10-A",
    rollNumber: "2024001",
    admissionDate: "2022-08-15",
    dateOfBirth: "2008-03-12",
    photo: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    parentName: "Sarah Johnson",
    parentEmail: "sarah.johnson@email.com",
    parentPhone: "+1 (555) 123-4567",
    address: "123 Oak Street, Springfield, IL 62701",
    overallGrade: "A-",
    gpa: 3.7,
    attendance: 92,
    behaviorScore: 85,
    feeStatus: "Paid",
    subjects: [
        { subject: "Mathematics", currentGrade: "A", percentage: 89, trend: 'up', assignments: 12, testsCompleted: 8, color: "bg-blue-500" },
        { subject: "English", currentGrade: "A-", percentage: 85, trend: 'stable', assignments: 10, testsCompleted: 6, color: "bg-green-500" },
        { subject: "Science", currentGrade: "B+", percentage: 82, trend: 'up', assignments: 14, testsCompleted: 7, color: "bg-purple-500" },
        { subject: "History", currentGrade: "A", percentage: 91, trend: 'up', assignments: 8, testsCompleted: 5, color: "bg-orange-500" },
        { subject: "Art", currentGrade: "A+", percentage: 95, trend: 'stable', assignments: 6, testsCompleted: 4, color: "bg-pink-500" },
        { subject: "Physical Education", currentGrade: "B", percentage: 78, trend: 'down', assignments: 4, testsCompleted: 3, color: "bg-red-500" }
    ],
    extracurricular: [
        { name: "Drama Club", role: "Lead Actor", performance: "Excellent" },
        { name: "Science Olympiad", role: "Team Member", performance: "Good" },
        { name: "Student Council", role: "Secretary", performance: "Outstanding" }
    ],
    achievements: [
        { title: "Academic Excellence Award", date: "2024-01-15", category: "Academic", description: "Top 5% in class performance" },
        { title: "Science Fair Winner", date: "2023-11-20", category: "Academic", description: "First place in regional science fair" },
        { title: "Perfect Attendance", date: "2023-06-30", category: "Attendance", description: "100% attendance for spring semester" }
    ],
    recentActivity: [
        { date: "2024-01-20", activity: "Submitted Math Assignment #12", type: "academic" },
        { date: "2024-01-19", activity: "Participated in Science Olympiad practice", type: "academic" },
        { date: "2024-01-18", activity: "Received commendation for helping classmate", type: "behavioral" },
        { date: "2024-01-17", activity: "Perfect attendance this week", type: "attendance" }
    ],
    teacherFeedback: [
        { teacher: "Ms. Davis", subject: "Mathematics", comment: "Emily shows exceptional problem-solving skills and helps other students.", date: "2024-01-15", rating: 5 },
        { teacher: "Mr. Thompson", subject: "English", comment: "Great participation in class discussions. Creative writing skills are improving.", date: "2024-01-10", rating: 4 },
        { teacher: "Dr. Wilson", subject: "Science", comment: "Excellent lab work and scientific thinking. Shows genuine curiosity.", date: "2024-01-08", rating: 5 }
    ],
    skillsAssessment: [
        { skill: "Critical Thinking", score: 85, maxScore: 100 },
        { skill: "Communication", score: 78, maxScore: 100 },
        { skill: "Collaboration", score: 92, maxScore: 100 },
        { skill: "Creativity", score: 88, maxScore: 100 },
        { skill: "Leadership", score: 75, maxScore: 100 },
        { skill: "Time Management", score: 80, maxScore: 100 }
    ],
    psychometricProfile: {
        counselorName: "Dr. Sarah Mitchell",
        lastAssessmentDate: "2024-01-10",
        personalityType: "ENFP - The Campaigner",
        learningStyle: "Visual-Kinesthetic",
        intelligenceTypes: [
            { type: "Linguistic", score: 85, description: "Strong verbal and written communication skills", icon: "📝" },
            { type: "Logical-Mathematical", score: 92, description: "Excellent problem-solving and analytical thinking", icon: "🔢" },
            { type: "Spatial", score: 78, description: "Good visual-spatial awareness and artistic abilities", icon: "🎨" },
            { type: "Musical", score: 65, description: "Moderate musical intelligence and rhythm", icon: "🎵" },
            { type: "Bodily-Kinesthetic", score: 70, description: "Good physical coordination and hands-on learning", icon: "🏃" },
            { type: "Interpersonal", score: 88, description: "Strong social skills and empathy", icon: "👥" },
            { type: "Intrapersonal", score: 82, description: "Good self-awareness and reflection", icon: "🧘" },
            { type: "Naturalistic", score: 75, description: "Appreciation for nature and environmental awareness", icon: "🌿" }
        ],
        emotionalIntelligence: {
            selfAwareness: 85,
            selfRegulation: 78,
            motivation: 92,
            empathy: 88,
            socialSkills: 85
        },
        careerInterests: [
            {
                field: "STEM Research",
                interestLevel: 95,
                aptitudeMatch: 90,
                description: "Strong interest in scientific research and innovation",
                recommendedSubjects: ["Advanced Mathematics", "Physics", "Chemistry", "Computer Science"]
            },
            {
                field: "Creative Arts",
                interestLevel: 82,
                aptitudeMatch: 85,
                description: "Natural artistic abilities and creative expression",
                recommendedSubjects: ["Fine Arts", "Digital Design", "Creative Writing", "Drama"]
            },
            {
                field: "Education & Training",
                interestLevel: 78,
                aptitudeMatch: 88,
                description: "Enjoys helping others learn and develop",
                recommendedSubjects: ["Psychology", "Communication", "Leadership", "Child Development"]
            },
            {
                field: "Healthcare",
                interestLevel: 75,
                aptitudeMatch: 80,
                description: "Interest in helping others and medical sciences",
                recommendedSubjects: ["Biology", "Chemistry", "Health Sciences", "Psychology"]
            }
        ],
        strengthsAndWeaknesses: {
            strengths: [
                "Exceptional analytical and problem-solving abilities",
                "Strong leadership potential and social skills",
                "High motivation and goal-oriented mindset",
                "Creative thinking and innovative approach",
                "Excellent communication and presentation skills"
            ],
            areasForImprovement: [
                "Time management and organization skills",
                "Handling stress and pressure situations",
                "Attention to detail in routine tasks",
                "Patience with slower-paced activities",
                "Balancing perfectionism with practical completion"
            ]
        },
        recommendedFocusAreas: [
            "Advanced STEM courses to nurture analytical strengths",
            "Leadership development programs",
            "Creative expression through arts and writing",
            "Time management and organizational skills training",
            "Stress management and mindfulness techniques"
        ],
        counselorNotes: "Emily demonstrates exceptional potential in STEM fields with strong leadership qualities. She shows high emotional intelligence and social awareness. Recommend focusing on time management skills and providing challenging academic opportunities to maintain engagement. Consider advanced placement courses and leadership roles in extracurricular activities.",
        nextAssessmentDue: "2024-07-10"
    },
    aiPsychometricAnalysis: {
        lastAnalysisDate: "2024-01-22",
        cognitiveProfile: {
            processingSpeed: 88,
            workingMemory: 85,
            attention: 82,
            reasoning: 92,
            creativity: 89
        },
        behavioralPatterns: [
            {
                pattern: "High engagement in collaborative projects",
                frequency: "Daily",
                impact: "positive",
                description: "Consistently seeks group work and peer interaction"
            },
            {
                pattern: "Procrastination on routine assignments",
                frequency: "Weekly",
                impact: "negative",
                description: "Tends to delay mundane tasks in favor of challenging problems"
            },
            {
                pattern: "Leadership emergence in group settings",
                frequency: "Frequently",
                impact: "positive",
                description: "Naturally takes charge and guides team discussions"
            }
        ],
        learningRecommendations: [
            {
                category: "Learning Environment",
                recommendation: "Provide collaborative learning opportunities with challenging projects",
                priority: "high",
                expectedOutcome: "Increased engagement and academic performance"
            },
            {
                category: "Study Techniques",
                recommendation: "Implement visual learning aids and hands-on experiments",
                priority: "high",
                expectedOutcome: "Better retention and understanding of complex concepts"
            },
            {
                category: "Time Management",
                recommendation: "Use gamification and deadline chunking strategies",
                priority: "medium",
                expectedOutcome: "Improved task completion and reduced procrastination"
            }
        ],
        riskFactors: [
            {
                factor: "Perfectionism leading to stress",
                severity: "medium",
                description: "High standards may cause anxiety when facing difficult challenges",
                intervention: "Stress management techniques and growth mindset coaching"
            },
            {
                factor: "Boredom with routine tasks",
                severity: "low",
                description: "May disengage from repetitive or unchallenging activities",
                intervention: "Provide varied and challenging assignments"
            }
        ],
        potentialIndicators: [
            {
                area: "Scientific Research",
                score: 94,
                description: "Exceptional aptitude for research methodology and scientific thinking",
                developmentPath: "Advanced research programs, science competitions, mentorship opportunities"
            },
            {
                area: "Innovation & Entrepreneurship",
                score: 87,
                description: "Strong creative problem-solving and leadership potential",
                developmentPath: "Innovation challenges, startup incubators, business leadership courses"
            },
            {
                area: "Educational Leadership",
                score: 85,
                description: "Natural teaching abilities and peer mentoring skills",
                developmentPath: "Peer tutoring programs, teaching assistant roles, education courses"
            }
        ],
        aiConfidenceScore: 92,
        predictiveInsights: [
            {
                insight: "High probability of success in STEM higher education",
                probability: 89,
                timeframe: "Next 2-4 years",
                actionItems: ["Enroll in AP STEM courses", "Participate in research programs", "Seek STEM mentorship"]
            },
            {
                insight: "Leadership role potential in academic or professional settings",
                probability: 85,
                timeframe: "Next 1-3 years",
                actionItems: ["Join student government", "Lead project teams", "Develop public speaking skills"]
            },
            {
                insight: "May benefit from accelerated learning programs",
                probability: 78,
                timeframe: "Current academic year",
                actionItems: ["Assess for gifted programs", "Consider grade acceleration", "Provide enrichment activities"]
            }
        ]
    }
};



const RadarChart: React.FC<{ skills: SkillScore[] }> = ({ skills }) => {
    const size = 200;
    const center = size / 2;
    const maxRadius = 80;

    const points = skills.map((skill, index) => {
        const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
        const radius = (skill.score / skill.maxScore) * maxRadius;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
            skill: skill.skill,
            score: skill.score
        };
    });

    const pathData = points.map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
        <div className="relative">
            <svg width={size} height={size} className="mx-auto">
                {[0.2, 0.4, 0.6, 0.8, 1].map(ratio => (
                    <circle key={ratio} cx={center} cy={center} r={maxRadius * ratio}
                        fill="none" stroke="#e5e7eb" strokeWidth="1" />
                ))}

                {skills.map((_, index) => {
                    const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
                    const endX = center + maxRadius * Math.cos(angle);
                    const endY = center + maxRadius * Math.sin(angle);
                    return (
                        <line key={index} x1={center} y1={center} x2={endX} y2={endY}
                            stroke="#e5e7eb" strokeWidth="1" />
                    );
                })}

                <path d={pathData} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />

                {points.map((point, index) => (
                    <circle key={index} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
                ))}
            </svg>

            <div className="absolute inset-0">
                {skills.map((skill, index) => {
                    const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
                    const labelRadius = maxRadius + 20;
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);

                    return (
                        <div key={skill.skill}
                            className="absolute text-xs font-medium text-gray-700 transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: x, top: y }}>
                            {skill.skill}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const IntelligenceChart: React.FC<{ intelligenceTypes: any }> = ({ intelligenceTypes }) => {
    return (
        <div className="space-y-4">
            {intelligenceTypes?.map((intelligence: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                    <div className="text-2xl">{intelligence.icon}</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{intelligence.name}</span>
                            <span className="text-sm font-semibold text-blue-600">{intelligence.total_obtained_points}/{intelligence.total_possible_points}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${intelligence.average_percentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500">{intelligence.feedback}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const EmotionalIntelligenceChart: React.FC<{ ei: EmotionalIntelligence }> = ({ ei }) => {
    const eiData = [
        { label: "Self Awareness", value: ei.selfAwareness, color: "bg-green-500" },
        { label: "Self Regulation", value: ei.selfRegulation, color: "bg-blue-500" },
        { label: "Motivation", value: ei.motivation, color: "bg-purple-500" },
        { label: "Empathy", value: ei.empathy, color: "bg-pink-500" },
        { label: "Social Skills", value: ei.socialSkills, color: "bg-orange-500" }
    ];

    return (
        <div className="space-y-3">
            {eiData.map((item, index) => (
                <div key={index}>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm text-gray-500">{item.value}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${item.value}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const UserProfileAdvance = ({ user, subjects, books, activity }: { user: any, subjects: any[], books: any[], activity: any }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'psychometric' | 'ai-analysis'>('overview');
    const student = {
        ...mockStudentData,
        name: `${user?.first_name} ${user?.last_name}`,
        photo: user?.image,
        class: user?.class_name,
        rollNumber: user?.roll_no,
        dateOfBirth: moment(user?.dob).isValid() ? moment(user?.dob).format('DD MMM, Y') : '--'
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 85) return 'bg-green-500';
        if (percentage >= 70) return 'bg-yellow-400';
        if (percentage >= 50) return 'bg-orange-400';
        return 'bg-red-400';
    };

    const ProgressBar = ({ percentage }: any) => (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
                className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getAttendanceStatus = (percentage: number) => {
        if (percentage >= 95) return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' };
        if (percentage >= 85) return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-100' };
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' };
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };


    const getRelationLabel = (relation: number) => {
        switch (relation) {
            case 1:
                return 'Father';
            case 2:
                return 'Mother';
            case 3:
                return 'Guardian';
            default:
                return 'Relative';
        }
    };

    const attendanceStatus = getAttendanceStatus(student.attendance);
    const AttendanceIcon = attendanceStatus.icon;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <div className="flex items-center space-x-6">
                            <Avatar className="w-24 h-24 mr-3">
                                <AvatarImage src={student.photo} alt={student.name} />
                                <AvatarFallback className="w-24 h-24 text-3xl flex items-center justify-center">
                                    {nameLetter(student.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold">{student.name}</h1>
                                <p className="text-blue-100 text-lg">{student.class} • Roll No: {student.rollNumber}</p>
                                <p className="text-blue-100">Student ID: {student.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                    <p className="font-semibold">{student.dateOfBirth}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <GraduationCap className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Overall Grade</p>
                                    <p className={`font-semibold px-3 py-1 rounded-full text-sm ${getGradeColor(student.overallGrade)}`}>
                                        {student.overallGrade}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">GPA</p>
                                    <p className="font-semibold text-xl">{student.gpa}/4.0</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Attendance</p>
                                    <div className="flex items-center space-x-2">
                                        <AttendanceIcon className={`w-4 h-4 ${attendanceStatus.color}`} />
                                        <p className="font-semibold">{student.attendance}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='p-3'>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {!!user.gender && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaVenusMars className="mr-2 text-blue-500" />
                                    <span className="font-medium">Gender: {getGenderName(user.gender)}</span>
                                </li>
                            )}

                            {!!user.blood_group && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaTint className="mr-2 text-blue-500" />
                                    <span className="font-medium">Blood Group: {getBloodGroupName(user.blood_group)}</span>
                                </li>
                            )}
                            {!!user.religion_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaPray className="mr-2 text-blue-500" />
                                    <span className="font-medium">Religion: {user.religion_name}</span>
                                </li>
                            )}
                            {!!user.caste_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaUsers className="mr-2 text-blue-500" />
                                    <span className="font-medium">Caste: {user.caste_name}</span>
                                </li>
                            )}
                            {!!user.reserved_category_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaUserTag className="mr-2 text-blue-500" />
                                    <span className="font-medium">Reserved Category: {user.reserved_category_name}</span>
                                </li>
                            )}
                            {!!user.roll_no && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaIdCard className="mr-2 text-blue-500" />
                                    <span className="font-medium">Roll No: {user.roll_no}</span>
                                </li>
                            )}
                            {!!user.admission_no && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaIdCard className="mr-2 text-blue-500" />
                                    <span className="font-medium">Admission No: {user.admission_no}</span>
                                </li>
                            )}
                            {!!user.joining_date && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaCalendar className="mr-2 text-blue-500" />
                                    <span className="font-medium">Admission Date: {moment(user.joining_date).format("DD MMM YYYY")}</span>
                                </li>
                            )}
                            {!!user.previous_organization_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaSchool className="mr-2 text-blue-500" />
                                    <span className="font-medium">Previous School: {user.previous_organization_name}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'overview'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <BarChart3 className="w-4 h-4" />
                                <span>Academic Overview</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('psychometric')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'psychometric'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Brain className="w-4 h-4" />
                                <span>Psychometric Profile</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('ai-analysis')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'ai-analysis'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Bot className="w-4 h-4" />
                                <Sparkles className="w-4 h-4" />
                                <span>AI Analysis</span>
                            </div>
                        </button>
                    </div>



                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <>
                        {/* Performance Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Academic Performance</p>
                                        <p className="text-2xl font-bold text-green-600">{student.overallGrade}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <BookOpen className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Behavior Score</p>
                                        <p className="text-2xl font-bold text-blue-600">{student.behaviorScore}/100</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Star className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Activities</p>
                                        <p className="text-2xl font-bold text-purple-600">{student.extracurricular.length}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Achievements</p>
                                        <p className="text-2xl font-bold text-orange-600">{student.achievements.length}</p>
                                    </div>
                                    <div className="p-3 bg-orange-100 rounded-full">
                                        <Award className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Academic Performance */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                    Academic Performance by Subject
                                </h2>

                                <div className="space-y-6">
                                    {subjects.map((subject: any, index: number) => {
                                        const percentage = subject.total_exam_marks
                                            ? Math.round((subject.obtained_exam_marks / subject.total_exam_marks) * 100)
                                            : 0;

                                        return (
                                            <div
                                                key={index}
                                                className="border border-gray-100 rounded-lg bg-gray-50 p-5 shadow-sm hover:shadow-md transition"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                                                    <span className="text-sm text-gray-500">
                                                        Total: <strong>{subject.total_exam_marks}</strong> | Obtained: <strong>{subject.obtained_exam_marks}</strong>
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    {subject.exams.map((exam: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between items-center text-sm text-gray-700 bg-white rounded-md px-4 py-2 shadow-sm border border-gray-100"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-900">{exam.exam_name}</span>
                                                                <span className="text-xs text-gray-500">Exam</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="font-semibold text-gray-900">{exam.marks}</span>
                                                                <span className="text-gray-400"> / {exam.total_marks}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-4">
                                                    <ProgressBar percentage={percentage} />
                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                        Overall: {percentage}%
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Skills Assessment */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Target className="w-5 h-5 mr-2" />
                                    Skills Assessment
                                </h2>
                                <RadarChart skills={student.skillsAssessment} />
                                <div className="mt-6 space-y-2">
                                    {student.skillsAssessment.map((skill, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{skill.skill}</span>
                                            <span className="font-semibold">{skill.score}/100</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <LuBookHeart className="w-5 h-5 mr-2 text-red-600" />
                                Books Interests
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {books.map((book: any, idx: number) => (
                                    <div key={idx} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                                        <h3 className="text-base font-semibold text-gray-800">{book.item_name}</h3>
                                        <p className="text-sm text-gray-600">Author: {book.author}</p>
                                        <p className="text-sm text-gray-600">Edition: {book.edition}</p>
                                        <div className="mt-2 text-sm text-gray-700 font-medium">
                                            Issued: <span className="text-blue-600">{book.issue_count}</span> time{book.issue_count > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Books Intrested In */}



                            {/* Parent Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-blue-600" />
                                    Parent/Guardian Information
                                </h2>

                                <div className="space-y-6">
                                    {user.relatives.map((relative: any, idx: number) => (
                                        <div key={idx} className="flex items-start space-x-4">
                                            <img
                                                src={relative.image}
                                                alt="relative"
                                                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">{getRelationLabel(relative.relation)}</p>
                                                <p className="font-semibold text-gray-800 mb-1">
                                                    {relative.first_name} {relative.last_name}
                                                </p>

                                                <div className="text-sm text-gray-600 space-y-1">
                                                    {relative.email && (
                                                        <p>
                                                            <span className="text-gray-500">Email:</span>{' '}
                                                            <span className="text-blue-600">{relative.email}</span>
                                                        </p>
                                                    )}
                                                    {relative.mobile && (
                                                        <p>
                                                            <span className="text-gray-500">Mobile:</span>{' '}
                                                            <span>{relative.mobile}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-start space-x-3">
                                            <Home className="w-5 h-5 mt-1 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Address</p>
                                                <p className="text-gray-700">{user.present_address || 'Not Available'}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* Extracurricular Activities */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Extracurricular Activities
                                </h2>
                                <div className="space-y-4">
                                    {student.extracurricular.map((activity, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                                                <span className="text-sm text-gray-500">{activity.role}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-600">Performance: </span>
                                                <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${activity.performance === 'Outstanding' ? 'bg-green-100 text-green-800' :
                                                    activity.performance === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {activity.performance}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Activity className="w-5 h-5 mr-2" />
                                    Recent Activity
                                </h2>
                                <div className="space-y-4">
                                    {student.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                                            <div className={`w-3 h-3 rounded-full mt-2 ${activity.type === 'academic' ? 'bg-blue-500' :
                                                activity.type === 'behavioral' ? 'bg-green-500' :
                                                    activity.type === 'attendance' ? 'bg-purple-500' :
                                                        'bg-orange-500'
                                                }`}></div>
                                            <div className="flex-1">
                                                <p className="text-gray-800">{activity.activity}</p>
                                                <p className="text-sm text-gray-500">{activity.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Teacher Feedback */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Teacher Feedback
                                </h2>
                                <div className="space-y-4">
                                    {student.teacherFeedback.map((feedback, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{feedback.teacher}</p>
                                                    <p className="text-sm text-gray-500">{feedback.subject}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                            }`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm mb-2">{feedback.comment}</p>
                                            <p className="text-xs text-gray-500">{feedback.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Award className="w-5 h-5 mr-2" />
                                Achievements & Awards
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {student.achievements.map((achievement, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${achievement.category === 'Academic' ? 'bg-blue-100 text-blue-800' :
                                                achievement.category === 'Attendance' ? 'bg-green-100 text-green-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                {achievement.category}
                                            </span>
                                            <Award className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-1">{achievement.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                                        <p className="text-xs text-gray-500">{achievement.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'psychometric' && (
                    <>
                        {/* Psychometric Profile Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <Brain className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Psychometric Assessment</h2>
                                        <p className="text-gray-600">Conducted by {student.psychometricProfile.counselorName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Last Assessment</p>
                                    <p className="font-semibold">{student.psychometricProfile.lastAssessmentDate}</p>
                                    <p className="text-sm text-gray-500 mt-1">Next Due: {student.psychometricProfile.nextAssessmentDue}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <UserCheck className="w-5 h-5 text-purple-600" />
                                        <h3 className="font-semibold text-gray-800">Personality Type</h3>
                                    </div>
                                    <p className="text-lg font-bold text-purple-600">{student.psychometricProfile.personalityType}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Eye className="w-5 h-5 text-green-600" />
                                        <h3 className="font-semibold text-gray-800">Learning Style</h3>
                                    </div>
                                    <p className="text-lg font-bold text-green-600">{student.psychometricProfile.learningStyle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Multiple Intelligences */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Lightbulb className="w-5 h-5 mr-2" />
                                    Multiple Intelligences Assessment
                                </h3>
                                <IntelligenceChart intelligenceTypes={activity} />
                            </div>

                            {/* Emotional Intelligence */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Heart className="w-5 h-5 mr-2" />
                                    Emotional Intelligence
                                </h3>
                                <EmotionalIntelligenceChart ei={student.psychometricProfile.emotionalIntelligence} />
                            </div>
                        </div>

                        {/* Career Interests */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Compass className="w-5 h-5 mr-2" />
                                Career Interest Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {student.psychometricProfile.careerInterests.map((career, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-800">{career.field}</h4>
                                            <div className="flex items-center space-x-2">
                                                <Briefcase className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm font-medium text-blue-600">{career.interestLevel}%</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Interest Level</span>
                                                <span>{career.interestLevel}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${career.interestLevel}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Aptitude Match</span>
                                                <span>{career.aptitudeMatch}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${career.aptitudeMatch}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Recommended Subjects:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {career.recommendedSubjects.map((subject, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Strengths and Weaknesses */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Target className="w-5 h-5 mr-2" />
                                    Strengths & Areas for Improvement
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Key Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {student.psychometricProfile.strengthsAndWeaknesses.strengths.map((strength, index) => (
                                                <li key={index} className="flex items-start space-x-2">
                                                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                                            <Focus className="w-4 h-4 mr-2" />
                                            Areas for Improvement
                                        </h4>
                                        <ul className="space-y-2">
                                            {student.psychometricProfile.strengthsAndWeaknesses.areasForImprovement.map((area, index) => (
                                                <li key={index} className="flex items-start space-x-2">
                                                    <ChevronRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{area}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Focus Areas */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Recommended Focus Areas
                                </h3>
                                <div className="space-y-3">
                                    {student.psychometricProfile.recommendedFocusAreas.map((area, index) => (
                                        <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                            <p className="text-sm text-gray-700">{area}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Counselor Notes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Counselor's Professional Assessment
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700 leading-relaxed">{student.psychometricProfile.counselorNotes}</p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        Assessment by: <span className="font-semibold">{student.psychometricProfile.counselorName}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'ai-analysis' && (
                    <>
                        {/* AI Analysis Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-white/20 rounded-full">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center">
                                            AI-Powered Psychometric Analysis
                                            <Sparkles className="w-5 h-5 ml-2" />
                                        </h2>
                                        <p className="text-pink-100">Advanced behavioral pattern recognition and predictive insights</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-sm">Confidence Score:</span>
                                        <span className="text-xl font-bold">{student.aiPsychometricAnalysis.aiConfidenceScore}%</span>
                                    </div>
                                    <p className="text-sm text-pink-100">Last Analysis: {student.aiPsychometricAnalysis.lastAnalysisDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cognitive Profile */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Brain className="w-5 h-5 mr-2" />
                                Cognitive Profile Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {Object.entries(student.aiPsychometricAnalysis.cognitiveProfile).map(([key, value]) => (
                                    <div key={key} className="text-center p-4 bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600 mb-1">{value}</div>
                                        <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                                                style={{ width: `${value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Behavioral Patterns */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Activity className="w-5 h-5 mr-2" />
                                    Behavioral Pattern Recognition
                                </h3>
                                <div className="space-y-4">
                                    {student.aiPsychometricAnalysis.behavioralPatterns.map((pattern, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">{pattern.pattern}</h4>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`w-3 h-3 rounded-full ${pattern.impact === 'positive' ? 'bg-green-500' :
                                                        pattern.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                                                        }`}></span>
                                                    <span className="text-sm text-gray-500">{pattern.frequency}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{pattern.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Learning Recommendations */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Lightbulb className="w-5 h-5 mr-2" />
                                    AI Learning Recommendations
                                </h3>
                                <div className="space-y-4">
                                    {student.aiPsychometricAnalysis.learningRecommendations.map((rec, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">{rec.category}</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                                                    {rec.priority} priority
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{rec.recommendation}</p>
                                            <p className="text-xs text-gray-500">Expected: {rec.expectedOutcome}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Risk Factors and Potential Indicators */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Risk Factors */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Risk Factor Analysis
                                </h3>
                                <div className="space-y-4">
                                    {student.aiPsychometricAnalysis.riskFactors.map((risk, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">{risk.factor}</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                                                    {risk.severity} risk
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                                            <div className="p-2 bg-blue-50 rounded text-sm text-blue-800">
                                                <strong>Intervention:</strong> {risk.intervention}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Potential Indicators */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Star className="w-5 h-5 mr-2" />
                                    Potential & Talent Indicators
                                </h3>
                                <div className="space-y-4">
                                    {student.aiPsychometricAnalysis.potentialIndicators.map((potential, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">{potential.area}</h4>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-lg font-bold text-green-600">{potential.score}/100</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{potential.description}</p>
                                            <div className="p-2 bg-green-50 rounded text-sm text-green-800">
                                                <strong>Development Path:</strong> {potential.developmentPath}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Predictive Insights */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Compass className="w-5 h-5 mr-2" />
                                Predictive Insights & Future Projections
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {student.aiPsychometricAnalysis.predictiveInsights.map((insight, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-800">{insight.insight}</h4>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-purple-600">{insight.probability}%</div>
                                                <div className="text-xs text-gray-500">{insight.timeframe}</div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                                                style={{ width: `${insight.probability}%` }}></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</p>
                                            <ul className="space-y-1">
                                                {insight.actionItems.map((action, idx) => (
                                                    <li key={idx} className="flex items-start space-x-2">
                                                        <ChevronRight className="w-3 h-3 text-purple-500 mt-1 flex-shrink-0" />
                                                        <span className="text-xs text-gray-600">{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Analysis Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                            <div className="flex items-start space-x-3">
                                <Info className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">AI Analysis Summary</h3>
                                    <p className="text-gray-700 mb-4">
                                        Based on comprehensive data analysis including academic performance, behavioral patterns, and psychometric assessments,
                                        the AI system has identified key areas of strength and potential development opportunities for {student.name}.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-3 bg-white rounded-lg">
                                            <div className="text-sm text-gray-500">Primary Strength</div>
                                            <div className="font-semibold text-blue-600">Analytical Thinking</div>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg">
                                            <div className="text-sm text-gray-500">Development Focus</div>
                                            <div className="font-semibold text-purple-600">Time Management</div>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg">
                                            <div className="text-sm text-gray-500">Career Alignment</div>
                                            <div className="font-semibold text-green-600">STEM Research</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfileAdvance;