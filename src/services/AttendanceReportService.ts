import Api from '@/lib/api';


export class AttendanceReportService {

  private static endpoint = 'attendance-reports/';

  public static async getStudentAttendance(form: any) {
    return Api(`${this.endpoint}student-attendance`, form);
  }

  public static async getStudentAttendanceExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}student-attendance`, form, {
      download: true
    });
  }

  public static async getStudentAttendanceType(form: any) {
    return Api(`${this.endpoint}student-attendance-type`, form);
  }

  public static async getStudentAttendanceTypeExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}student-attendance-type`, form, {
      download: true
    });
  }

  public static async dailyAttendanceReports(form: any) {
    return Api(`${this.endpoint}daily-attendance`, form);
  }

  public static async dailyAttendanceReportsExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}daily-attendance`, form, {
      download: true
    });
  }



  public static async studentDayWiseAttendanceReport(form: any) {
    return Api(`${this.endpoint}student-day-wise-attendance`, form);
  }

  public static async studentDayWiseAttendanceReportExport(form: {
    export?: boolean;
    date?: string;
    class_id?: number;
    section_id?: number;
  }) {
    return Api(`${this.endpoint}student-day-wise-attendance`, form, {
      download: true,
    });
  }


}