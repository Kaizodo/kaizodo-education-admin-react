import React, { useEffect, useState } from 'react';
import KPICard from './components/KPICard';
import AttendanceChart from './Charts/AttendanceChart';
import RevenueChart from './Charts/RevenueChart';
import GradeDistribution from './Charts/GradeDistribution';
import ClassWiseChart from './Charts/ClassWiseChart';
import SubjectPerformance from './Charts/SubjectPerformance';
import RecentActivities from './components/RecentActivities';
import TopPerformers from './components/TopPerformers';
import LibraryStats from './components/LibraryStats';
import TransportInfo from './components/TransportInfo';
import UpcomingEvents from './components/UpcomingEvents';
import {
  recentActivities,
  topStudents,
} from '@/data/mockData';
import { DashboardService } from '@/services/DashboardService';
import DashboardSkeleton from './components/DashboardSkeleton';

const Dashboard: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);


  const get = async () => {
    setLoading(true);
    var res = await DashboardService.get();
    if (res.success) {
      setDashboard(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    get();
  }, []);



  const kpiDaata = [
    {
      id: '1',
      title: 'Total Students',
      value: dashboard?.total_students ?? 0,
      change: 12.5,
      changeType: 'increase',
      icon: 'Users',
      color: 'blue'
    },
    {
      id: '2',
      title: 'Total Teachers',
      value: dashboard?.total_teacher ?? 0,
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
      value: dashboard?.total_feeCollection ?? 0,
      change: -3.2,
      changeType: 'decrease',
      icon: 'IndianRupee',
      color: 'orange',
      suffix: ''
    },
    {
      id: '5',
      title: 'Pending Fees',
      value: dashboard?.total_pending ?? 0,
      change: -8.5,
      changeType: 'decrease',
      icon: 'AlertCircle',
      color: 'red',
      suffix: ''
    },
    {
      id: '6',
      title: 'Active Classes',
      value: dashboard?.total_class ?? 0,
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
      value: dashboard?.total_books ?? 0,
      change: 8.3,
      changeType: 'increase',
      icon: 'Book',
      color: 'purple'
    }
  ];

  const weeklyAttendanceData = dashboard?.weekly_attendance_student
    ? Object.entries(dashboard.weekly_attendance_student).map(([name, value]) => ({
      name,
      value,
    }))
    : [];

  const weeklyAttendanceEmployee = dashboard?.weekly_attendance_employee
    ? Object.entries(dashboard.weekly_attendance_employee).map(([name, value]) => ({
      name,
      value,
    }))
    : [];

  const monthlyFeeCollectionData = dashboard?.monthly_fee_collection
    ? dashboard.monthly_fee_collection.map((item: any) => ({
      name: item.month,
      value: Number(item.total_collected),
    }))
    : [];


  const classWiseData = dashboard?.class_students
    ? dashboard.class_students.map((cls: any) => ({
      name: cls.name,
      value: cls.total_students,
    }))
    : [];

  const libraryDataFromDashboard = dashboard ? {
    totalBooks: dashboard.total_books,
    issuedBooks: dashboard.total_issued,
    returnedToday: dashboard.total_return,
    newArrivals: dashboard.new_arrival,
    popularBooks: dashboard.most_issue_book?.map((book: any) => ({
      title: book.item_name,
      issued: book.issued_count,
    })) ?? [],
  } : null;


  const monthlyAttendanceStudentData = dashboard?.monthly_attendance?.student_monthly_attendance
    ? Object.entries(dashboard.monthly_attendance.student_monthly_attendance).map(([month, value]) => ({
      name: month,
      value,
    }))
    : [];

  const monthlyAttendanceEmployeeData = dashboard?.monthly_attendance?.employee_monthly_attendance
    ? Object.entries(dashboard.monthly_attendance.employee_monthly_attendance).map(([month, value]) => ({
      name: month,
      value,
    }))
    : [];

  const transportData = dashboard?.transport
    ? {
      totalBuses: dashboard.transport.total_buses ?? 0,
      activeRoutes: dashboard.transport.total_route ?? 0,
      studentsUsingTransport: dashboard.transport.total_student ?? 0,
      maintenanceScheduled: 0,
    }
    : {
      totalBuses: 0,
      activeRoutes: 0,
      studentsUsingTransport: 0,
      maintenanceScheduled: 0,
    };

  const examAttendanceData = dashboard?.exam_attendance
    ? dashboard.exam_attendance.map((item: any) => ({
      name: item.name,
      value: item.value,
    }))
    : [];

  const subjectPerformanceData = dashboard?.subject_performance
    ? dashboard.subject_performance
      .filter((subj: any) => subj.average > 0)
      .map((subj: any) => ({
        name: subj.subject,
        value: subj.average,
      }))
    : [];

  const gradeDistributionData = dashboard?.grade_distribution
    ? Object.entries(dashboard.grade_distribution).map(([grade, count]) => ({
      name: grade,
      value: count,
    }))
    : [];




  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen" style={{
      height: loading ? 300 : undefined
    }}>
      {loading && <DashboardSkeleton />}
      {!loading && <>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
          {kpiDaata.map((kpi) => (
            <KPICard key={kpi.id} data={kpi} />
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="xl:col-span-1">
            <AttendanceChart data={weeklyAttendanceData} title="Weekly Attendance Student" />
          </div>
          <div className="xl:col-span-1">
            <AttendanceChart data={weeklyAttendanceEmployee} title="Weekly Attendance Employee" />
          </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="xl:col-span-1">
            <RevenueChart data={monthlyFeeCollectionData} />
          </div>
          <div className="xl:col-span-1">
            <GradeDistribution data={gradeDistributionData} />
          </div>
        </div>
        <div className="xl:col-span-1">
          <ClassWiseChart data={classWiseData} />
        </div>

        {/* Secondary Charts Section */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="xl:col-span-1">
            <AttendanceChart data={monthlyAttendanceStudentData} title="Monthly Attendance Student" />
          </div>
          <div className="xl:col-span-1">
            <AttendanceChart data={monthlyAttendanceEmployeeData} title="Monthly Attendance Employee" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="xl:col-span-1">
            <SubjectPerformance data={subjectPerformanceData} />
          </div>
          <div className="xl:col-span-1">
            <LibraryStats stats={libraryDataFromDashboard || { totalBooks: 0, issuedBooks: 0, returnedToday: 0, newArrivals: 0, popularBooks: [] }} />
          </div>
        </div>

        {/* Information Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <TransportInfo data={transportData} />
          </div>
          <div className="xl:col-span-1">
            <UpcomingEvents events={dashboard?.occasion} />
          </div>
          <div className="xl:col-span-1">
            <AttendanceChart data={examAttendanceData} title="Exam Results Trend" />
          </div>
        </div>

        {/* Bottom Section - Activities and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RecentActivities activities={recentActivities} />
          </div>
          <div className="xl:col-span-1">
            <TopPerformers students={topStudents} />
          </div>
        </div>
      </>}
    </div>
  );
};

export default Dashboard;