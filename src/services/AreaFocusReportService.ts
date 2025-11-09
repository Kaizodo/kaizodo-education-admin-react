import Api from '@/lib/api';


export class AreaFocusReportService {

    private static endpoint = 'area-report/';

    public static async areaOfFocusStatistics(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}overview`, { session_id, class_id });
    }


    public static async exportStudentRisk(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}export-student-risk`, { session_id, class_id }, {
            download: true
        });
    }

    public static async exportClassPerformance(session_id?: number) {
        return Api(`${this.endpoint}export-class-wise-performance`, { session_id }, {
            download: true
        });
    }


    public static async exportClassAttendance(session_id?: number) {
        return Api(`${this.endpoint}export-class-wise-attendance`, { session_id }, {
            download: true
        });
    }


    public static async exportClassAssignment(session_id?: number) {
        return Api(`${this.endpoint}export-class-wise-assignment`, { session_id }, {
            download: true
        });
    }


    public static async exportClassYearsPerformance(session_id?: number) {
        return Api(`${this.endpoint}export-class-wise-five-years-avg`, { session_id }, {
            download: true
        });
    }


    public static async exportStudentAssignmentLowScore(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}export-low-assignment-score`, { session_id, class_id }, {
            download: true
        });
    }





}