import Api from '@/lib/api';


export class EmployeeAtendanceReportsService {

    private static endpoint = 'employee-attendance/';

    public static async overviewAttendance(session_id?: number, month?: number) {
        return Api(`${this.endpoint}overview`, { session_id , month});
    }

    public static async exportDaily(session_id?: number) {
        return Api(`${this.endpoint}export-today`, { session_id }, {
            download: true
        });
    }

    public static async exportMonthly(month?: number) {
        return Api(`${this.endpoint}export-monthly`, { month }, {
            download: true
        });
    }

    public static async exportYearly(session_id?: number) {
        return Api(`${this.endpoint}export-yearly`, { session_id }, {
            download: true
        });
    }

    public static async exportDailyDepartment(session_id?: number) {
        return Api(`${this.endpoint}export-department-daily`, { session_id }, {
            download: true
        });
    }

    public static async exportMonthlyDepartment(month?: number) {
        return Api(`${this.endpoint}export-department-monthly`, { month }, {
            download: true
        });
    }





}