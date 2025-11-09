import Api from "@/lib/api";

export class StudentAttendanceReports {

    private static endpoint = "attendance-report/";

    public static async attendanceOverview(session_id?: number, class_id?: number, month?: number) {
        return Api(`${this.endpoint}overview`, { session_id, class_id, month });
    }


    public static async classWiseDailyExport() {
        return Api(`${this.endpoint}today-attendance-export`, {}, {
            download: true
        });
    }

    public static async todayClassWiseExport() {
        return Api(`${this.endpoint}today-class-attendance-export`, {}, {
            download: true
        });
    }

    public static async todaySummaryExport() {
        return Api(`${this.endpoint}today-attendance-summary`, {}, {
            download: true
        });
    }

    public static async mostAbsentExport(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}most-absent-student`, { session_id, class_id }, {
            download: true
        });
    }

    public static async monthlyAttendanceSummary(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}monthly-attendance-summary`, { session_id, class_id }, {
            download: true
        });
    }

    public static async monthlyAttendanceTrend(month?: number, class_id?: number) {
        return Api(`${this.endpoint}monthly-attendance-trend`, { month, class_id }, {
            download: true
        });
    }

    public static async mostTakenLeaveType() {
        return Api(`${this.endpoint}export-most-taken-leave-type`, {}, {
            download: true
        });
    }

    public static async todayGenderWiseAttendance() {
        return Api(`${this.endpoint}export-today-gender-attendance`, {}, {
            download: true
        });
    }

    public static async sessionGenderReport(session_id?: number) {
        return Api(`${this.endpoint}export-session-gender-attendance`, {session_id}, {
            download: true
        });
    }

    public static async classSessionGenderReport(session_id?: number) {
        return Api(`${this.endpoint}export-class-session-gender-attendance`, {session_id}, {
            download: true
        });
    }
    
    public static async exportSessionMonthReport(session_id?: number) {
        return Api(`${this.endpoint}export-session-monthly-classs-attendance`, {session_id}, {
            download: true
        });
    }
    
    public static async exportTopAttendancePerformers(session_id?: number) {
        return Api(`${this.endpoint}export-top-attendance-performers`, {session_id}, {
            download: true
        });
    }
}