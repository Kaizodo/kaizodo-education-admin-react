import Api from '@/lib/api';


export class EmployeeReportService {

    private static endpoint = 'employee-reports/';

    public static async employeeProfile(form: any) {
        return Api(`${this.endpoint}employee-profile`, form);
    }

    public static async employeeProfileExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}employee-profile`, form, {
          download: true
        });
    }

    public static async employeeDayWiseAttendance(form: any){
        return Api(`${this.endpoint}employee-day-wise-attendance`,form);
    }

    public static async employeeAttendanceReport(form: any){
        return Api(`${this.endpoint}employee-attendace-report`,form);
    }

    public static async employeeAttendanceReportExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}employee-attendace-report`, form, {
          download: true
        });
    }
}